const chalk = require('chalk')
const path = require('path')
const fs = require('fs-extra')
const { version } = require('../package.json')

function generateExamples() {
  const exampleDir = path.resolve(__dirname, '../examples')
  const libVersionMap = {}
  ;[['', version], ['amap', '1.4.15'], ['echarts', 'latest']].forEach(function(lib) {
    const libName = lib[0]
    const libVersion = lib[1]
    const formattedLibName = ((libName ? libName + '_' : '') + 'version').toUpperCase()
    libVersionMap[formattedLibName] = (
      libName
        ? fs.readFileSync(
            exampleDir + '/' + libName + '.version',
            { encoding: 'utf-8' }
          ) || lib[1]
        : libVersion
    ).trim()
  })
  const exampleTypes = ['scatter', 'heatmap', 'lines']
  ;[['en', false], ['zh_CN']].forEach(function(lang) {
    lang = `${lang[1] === false ? '' : '_' + lang[0]}`
    exampleTypes.forEach(function(type) {
      const fileName = `${type}${lang}.html`
      const dest = path.resolve(exampleDir, './', fileName)
      console.log(
        chalk.cyan.dim('\nGenerating example'),
        chalk.cyan(fileName),
        chalk.cyan.dim('=>'),
        chalk.cyan(dest),
        chalk.cyan.dim('...')
      )
      const tpl = fs.readFileSync(
        dest + '.tpl',
        { encoding: 'utf-8' }
      )
      let example = tpl
      Object.keys(libVersionMap).forEach(function(libVer) {
        example = example.replace(
          new RegExp(`{${libVer}}`, 'g'),
          libVersionMap[libVer].trim()
        )
      })
      fs.writeFileSync(
        dest,
        example,
        { encoding: 'utf-8' }
      )
      console.log(
        chalk.green.dim('\nGenerated'),
        chalk.green(dest),
        chalk.green.dim('successfully.')
      )
    })
  })

  console.log()
  console.log(chalk.bgCyan(' ✨ Generate Examples Done! '))
  console.log()
}

generateExamples()
