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

function getSourceCodeLineRanges(sourceCode) {
  const result = [];
  const indices = sourceCode.lineStartIndices;
  const len = indices.length;
  for (let i = 0; i < len - 1; i++) {
    result.push([indices[i], indices[i + 1]]);
  }
  result.push([indices[len - 1], sourceCode.text.length]);
  return result;
}

// offset === index
function getOffest2LineStart(lineRanges, token, isStart = true /** 是否取token的开头位置，false则取token的末尾 */) {
  const line = token.loc[isStart ? 'start' : 'end'].line;
  const [startIndex] = lineRanges[line - 1];
  return token.range[isStart ? 0 : 1] - startIndex;
}

module.exports = {
  isOverMaxLen,
  isSameLine,
  getSourceCodeLineRanges,
  getOffest2LineStart,
};
