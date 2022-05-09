// token常规格式的长度计算
function calcRawFormatLength(token, options = { objectCurlySpacing: true, commaSpacing: true }) {
  switch (token.type) {
    case 'ImportDeclaration':
      return calcImportDeclarationRawFormatLength(token, options);
    default:
      return 0;
  }
}

function calcImportDeclarationRawFormatLength(token, options) {
  const { objectCurlySpacing, commaSpacing } = options;
  return token.text;
}

module.exports = {
  calcRawFormatLength,
  calcImportDeclarationRawFormatLength,
};
