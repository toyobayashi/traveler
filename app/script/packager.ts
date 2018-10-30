import * as packager from 'electron-packager'
import * as path from 'path'
import * as fs from 'fs-extra'
import * as pkg from '../package.json'
import { execSync } from 'child_process'
import { prod } from './webpack'
import { zip } from 'zauz'
import { productionPackage, packagerOptions, arch } from './packager.config'
const { createPackageWithOptions } = require('asar')

function bundleProductionCode () {
  console.log(`[${new Date().toLocaleString()}] Bundle production code...`)
  return prod()
}

function packageApp () {
  process.stdout.write(`[${new Date().toLocaleString()}] `)
  return packager(packagerOptions)
}

function writePackageJson (root: string) {
  return fs.writeJson(path.join(root, 'package.json'), productionPackage)
}

async function rename (appPath: string) {
  let dirName: string | string[] = path.basename(appPath).split('-')
  dirName.splice(1, 0, `v${pkg.version}`)
  dirName = dirName.join('-')
  const newPath = path.join(path.dirname(appPath), dirName)
  if (fs.existsSync(newPath)) {
    console.log(`[${new Date().toLocaleString()}] Overwriting... `)
    await fs.remove(newPath)
  }
  await fs.rename(appPath, newPath)
  return newPath
}

function zipApp (p: string) {
  console.log(`[${new Date().toLocaleString()}] Zip ${p}`)
  return zip(p, p + '.zip')
}

function createDebInstaller (appPath: string) {
  console.log(`[${new Date().toLocaleString()}] Create .deb installer...`)
  const distRoot = path.dirname(appPath)
  const icon: { [size: string]: string } = {
    '16x16': path.join(__dirname, '../res', '16x16.png'),
    '24x24': path.join(__dirname, '../res', '24x24.png'),
    '32x32': path.join(__dirname, '../res', '32x32.png'),
    '48x48': path.join(__dirname, '../res', '48x48.png'),
    '64x64': path.join(__dirname, '../res', '64x64.png'),
    '128x128': path.join(__dirname, '../res', '128x128.png'),
    '256x256': path.join(__dirname, '../res', '256x256.png'),
    '512x512': path.join(__dirname, '../res', '512x512.png'),
    '1024x1024': path.join(__dirname, '../res', '1024x1024.png')
  }
  fs.mkdirsSync(path.join(distRoot, '.tmp/DEBIAN'))
  fs.writeFileSync(
    path.join(distRoot, '.tmp/DEBIAN/control'),
    `Package: ${pkg.name}
Version: ${pkg.version}-${Math.round(new Date().getTime() / 1000)}
Section: utility
Priority: optional
Architecture: ${arch === 'x64' ? 'amd64' : 'i386'}
Depends: kde-cli-tools | kde-runtime | trash-cli | libglib2.0-bin | gvfs-bin, libgconf-2-4, libgtk-3-0 (>= 3.10.0), libnotify4, libnss3 (>= 2:3.26), libxtst6, xdg-utils
Installed-Size: ${getDirectorySizeSync(appPath)}
Maintainer: ${pkg.author.name} <lifenglin314@outlook.com>
Homepage: https://github.com/${pkg.author.name}/${pkg.name}
Description: Unofficial 12306 Desktop Application
`)

  fs.mkdirsSync(path.join(distRoot, '.tmp/usr/share/applications'))
  fs.writeFileSync(
    path.join(distRoot, `.tmp/usr/share/applications/${pkg.name}.desktop`),
    `[Desktop Entry]
Name=${pkg.name}
Comment=Unofficial 12306 Desktop Application
GenericName=Utility
Exec=/usr/share/${pkg.name}/${pkg.name}
Icon=${pkg.name}
Type=Application
StartupNotify=true
Categories=Utility;
`)

  for (const size in icon) {
    fs.mkdirsSync(path.join(distRoot, `.tmp/usr/share/icons/hicolor/${size}/apps`))
    fs.copySync(icon[size], path.join(distRoot, `.tmp/usr/share/icons/hicolor/${size}/apps/${pkg.name}.png`))
  }
  fs.copySync(appPath, path.join(distRoot, `.tmp/usr/share/${pkg.name}`))

  execSync(`dpkg -b ./.tmp ./${pkg.name}-v${pkg.version}-linux-${arch}.deb`, { cwd: distRoot, stdio: 'inherit' })
  fs.removeSync(path.join(distRoot, '.tmp'))
}

function getDirectorySizeSync (dir: string) {
  const ls = fs.readdirSync(dir)
  let size = 0
  for (let i = 0; i < ls.length; i++) {
    const item = path.join(dir, ls[i])
    const stat = fs.statSync(item)
    if (stat.isDirectory()) {
      size += getDirectorySizeSync(item)
    } else {
      size += stat.size
    }
  }
  return size
}

function packNodeModules (root: string) {
  return new Promise<void>((resolve) => {
    createPackageWithOptions(root, path.join(root, '../app.asar'), { unpack: '*.node' }, () => {
      fs.removeSync(root)
      resolve()
    })
  })
}

async function main () {
  const start = new Date().getTime()
  await bundleProductionCode()
  const [appPath] = await packageApp()
  const root = process.platform === 'darwin' ? path.join(appPath, `${pkg.name}.app/Contents/Resources/app`) : path.join(appPath, 'resources/app')
  await writePackageJson(root)
  execSync(`npm install --no-package-lock --production --arch=${arch} --target_arch=${arch} --build-from-source --runtime=electron --target=3.0.6 --dist-url=https://atom.io/download/electron`, { cwd: root, stdio: 'inherit' })
  await packNodeModules(root)

  const newPath = await rename(appPath)
  const size = await zipApp(newPath)
  if (process.platform === 'linux') createDebInstaller(newPath)
  console.log(`[${new Date().toLocaleString()}] Size: ${size} Bytes`)
  return (new Date().getTime() - start) / 1000
}

main().then(s => console.log(`\n  Done in ${s} seconds.`)).catch(e => console.log(e))
