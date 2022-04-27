/**
 *
 * @param {object|array} tokenOrTokensOrRange token | [token, token] | [0, 80]
 * @param {number} maxLen
 * @returns
 */
function isOverMaxLen(tokenOrTokensOrRange, maxLen) {
  if (Array.isArray(tokenOrTokensOrRange)) {
    if (tokenOrTokensOrRange.every((item) => typeof item === 'number')) {
      return tokenOrTokensOrRange[1] - tokenOrTokensOrRange[0] > maxLen;
    }
    return tokenOrTokensOrRange[1].range[1] - tokenOrTokensOrRange[0].range[0];
  }
  return token.range[1] - token.range[0] > maxLen;
}

function isSameLine(token1, token2) {
  return token1.loc.start.line === token2.loc.start.line;
}

module.exports = {
  isOverMaxLen,
  isSameLine,
};
