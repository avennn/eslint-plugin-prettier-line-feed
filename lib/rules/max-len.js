/**
 * 只处理常规的写法的超出max-len的情况，不处理有语法错误或者非常规写法
 *
 * 如何判断一行超过了最大的长度？
 *
 * object是否可以处理？简单判断开闭括号是否在一行
 */
const { isOverMaxLen, isSameLine, getSourceCodeLineRanges, getIndex2LineStart } = require('./utils');

const messages = {
  exceedMax: 'Object Properties count over {{max}}',
};

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: '对象属性超过一定数量时换行',
      category: 'Stylishtic',
      recommended: true,
    },
    fixable: 'code',
    messages,
    schema: [
      {
        type: 'object',
        properties: {
          code: {
            type: 'number',
          },
          tabWidth: {
            type: 'number',
          },
          /**
           * 严格模式下，
           */
          strict: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const options = context.options[0] || {};
    const maxLen = options.code || 80;
    const lineRanges = getSourceCodeLineRanges(sourceCode);
    return {
      ObjectExpression(node) {
        const startBracket = sourceCode.getFirstToken(node);
        const endBracket = sourceCode.getLastToken(node);
        if (isSameLine(startBracket, endBracket)) {
          const index = getIndex2LineStart(lineRanges, endBracket);
          console.log('end bracket', index);
          if (index + 1 > maxLen) {
            context.report({
              node,
              messageId: 'exceedMax',
              data: {
                max: maxLen,
              },
              fix(fixer) {
                const result = [];
                const propertySize = node.properties.length;
                node.properties.forEach((prop, i) => {
                  const beforeToken = sourceCode.getTokenBefore(prop);
                  result.push(fixer.replaceTextRange([beforeToken.range[1], prop.range[0]], '\n'));
                  if (i === propertySize - 1) {
                    console.log('===', i, propertySize);
                    result.push(fixer.replaceTextRange([prop.range[1], endBracket.range[0]], '\n'));
                  }
                });
                return result;
              },
            });
          }
        }
      },
    };
  },
};
