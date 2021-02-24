const fs = require('fs')
const path = require('path')
const { name, version, author } = require('../package.json')

const COMMENT_END_REGEX = /\*\//g

function getLicense(raw) {
  const license = fs.readFileSync(
    path.resolve(__dirname, '../LICENSE'),
    { encoding: 'utf-8' }
  )
  const content = `${name} \n@version ${version}\n@author ${author}\n\n${license}`
  return raw ? content : wrapComment(content)
}

function toComment(str) {
  return str ? `/*! ${str.replace(COMMENT_END_REGEX, '* /')} */` : '';
}

function wrapComment(str) {
  if (!str.includes('\n')) {
    return toComment(str)
  }
  return `/*!\n * ${str
    .replace(/\*\//g, '* /')
    .split('\n')
    .join('\n * ')}\n */`
}

module.exports = {
  getLicense,
  toComment,
  wrapComment
}
