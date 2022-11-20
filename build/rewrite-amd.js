const fs = require('node:fs')
const path = require('node:path')
const chalk = require('chalk')
const { name } = require('../package.json')

// Replace dependency in AMD
// FIXME: tricky solution
const distDir = path.resolve(__dirname, '../dist')
const LIB = 'echarts/lib/echarts'
const REPLACED_LIB = 'echarts'
const REPLACE_REGEXP = new RegExp(`define\\(\\[['"]{1}exports['"]{1}, ?['"]{1}${LIB.replace('/', '\\/')}['"]{1}\\]`)

;[name + '.js', name + '.min.js'].forEach(file => {
  const ts = Date.now()
  file = path.resolve(distDir, file)
  console.log()
  console.log(chalk.cyan.bold(file))

  let content = fs.readFileSync(file,{ encoding: 'utf-8' })

  // replace
  content = content.replace(
    REPLACE_REGEXP,
    content
      .match(REPLACE_REGEXP)[0]
      .replace(LIB, REPLACED_LIB))

  // rewrite
  fs.writeFileSync(file, content)

  const elapsed = Date.now() - ts
  console.log(
    chalk.green('rewrote'),
    chalk.green('in'),
    chalk.green.bold(elapsed + 'ms'),
  )
})
