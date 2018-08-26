interface Option {
  title?: string
  css?: string[]
  js?: string[]
  body?: string
}

export default (option: Option) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  ${
    option.css && option.css.length && process.env.NODE_ENV === 'production'
    ? option.css.map(css => '<link rel="stylesheet" href="' + css + '"/>').join('\n')
    : ''
  }
  <title>${option.title || ''}</title>
</head>
<body>
  <div id="root"></div>
  ${option.body || ''}
  ${
    option.js && option.js.length
    ? option.js.map(js => '<script src="' + js + '"></script>').join('\n')
    : ''
  }
</body>
</html>
`
