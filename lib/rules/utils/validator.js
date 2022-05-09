function isComma(token) {
  return token.type === 'Punctuator' && token.value === ',';
}

function isSemicolon(token) {
  return token.type === 'Punctuator' && token.value === ';';
}

function isNsImport(token) {
  return (
    token.type === 'ImportDeclaration' && token.specifiers.some((item) => item.type === 'ImportNamespaceSpecifier')
  );
}

module.exports = {
  isComma,
  isSemicolon,
  isNsImport,
};
