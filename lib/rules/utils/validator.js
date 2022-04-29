exports.isComma = (token) => {
  return token.type === 'Punctuator' && token.value === ',';
};
