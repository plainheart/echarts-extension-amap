const chalk = require('chalk')

console.log()
console.log(chalk.bgCyan('📝 Rewriting AMD dependency... '))

require('./rewrite-amd')

console.log()
console.log(chalk.bgCyan('✨ Build Done! '))
console.log()
