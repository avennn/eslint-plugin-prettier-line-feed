/**
 * 只处理常规的写法的超出max-len的情况，不处理有语法错误或者非常规写法
 *
 * 如何判断一行超过了最大的长度？
 *
 * object是否可以处理？简单判断开闭括号是否在一行
 */
const { isSameLine, getSourceCodeLineRanges, getOffest2LineStart } = require('./utils');
const { isComma } = require('./utils/validator');

const messages = {
  exceedMax: 'Line length exceeds {{maxLen}}',
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
          const offset = getOffest2LineStart(lineRanges, endBracket);
          if (offset + 1 > maxLen) {
            context.report({
              node,
              messageId: 'exceedMax',
              data: {
                maxLen,
              },
              fix(fixer) {
                const result = [];
                const propertySize = node.properties.length;
                node.properties.forEach((prop, i) => {
                  const beforeToken = sourceCode.getTokenBefore(prop);
                  result.push(fixer.replaceTextRange([beforeToken.range[1], prop.range[0]], '\n'));
                  if (i === propertySize - 1) {
                    result.push(fixer.replaceTextRange([prop.range[1], endBracket.range[0]], '\n'));
                  }
                });
                return result;
              },
            });
          }
        }
      },
      ArrayExpression(node) {
        const startBracket = sourceCode.getFirstToken(node);
        const endBracket = sourceCode.getLastToken(node);
        if (isSameLine(startBracket, endBracket)) {
          const offset = getOffest2LineStart(lineRanges, endBracket);
          if (offset + 1 > maxLen) {
            context.report({
              node,
              messageId: 'exceedMax',
              data: {
                maxLen,
              },
              fix(fixer) {
                const result = [];
                const elementSize = node.elements.length;
                node.elements.forEach((element, i) => {
                  const beforeToken = sourceCode.getTokenBefore(element);
                  result.push(fixer.replaceTextRange([beforeToken.range[1], element.range[0]], '\n'));
                  if (i === elementSize - 1) {
                    result.push(fixer.replaceTextRange([element.range[1], endBracket.range[0]], '\n'));
                  }
                });
                return result;
              },
            });
          }
        }
      },
      ImportDeclaration(node) {
        const importSpecifiers = node.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');
        const importSpecifierSize = importSpecifiers.length;
        if (importSpecifierSize) {
          const offset = getOffest2LineStart(lineRanges, node, false);
          const lastImportSpecifierLine = importSpecifiers[importSpecifierSize - 1].loc.start.line;
          console.log('====???', lastImportSpecifierLine);
          // 如果import语句末尾所在行超出maxLen, 且该行中还有ImportSpecifier
          if (offset + 1 > maxLen) {
            context.report({
              node,
              messageId: 'exceedMax',
              data: {
                maxLen,
              },
              fix(fixer) {
                const result = [];
                importSpecifiers.forEach((item, i) => {
                  const beforeToken = sourceCode.getTokenBefore(item);
                  result.push(fixer.replaceTextRange([beforeToken.range[1], item.range[0]], '\n'));
                  if (i === importSpecifierSize - 1) {
                    let afterToken = sourceCode.getTokenAfter(item);
                    if (isComma(afterToken)) {
                      const punctuatorToken = afterToken;
                      afterToken = sourceCode.getTokenAfter(afterToken);
                      result.push(fixer.replaceTextRange([punctuatorToken.range[1], afterToken.range[0]], '\n'));
                    } else {
                      result.push(fixer.replaceTextRange([item.range[1], afterToken.range[0]], '\n'));
                    }
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
