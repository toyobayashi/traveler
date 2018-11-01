import { join } from 'path'

namespace global {
  export function getPath (...relative: string[]): string {
    return join(__dirname, '..', ...relative)
  }
}

export default global.getPath
