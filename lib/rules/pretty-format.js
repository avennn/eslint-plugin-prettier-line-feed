/**
 * 按prettier的处理，先转成原始格式，如果超出printWidth，则格式化处理
 */
const { isSameLine, getSourceCodeLineRanges, getOffest2LineStart } = require('./utils');
const { isComma, isSemicolon, isNsImport } = require('./utils/validator');
const { calcRawFormatLength } = require('./utils/calc');

const messages = {
  formatNotGood: '格式不正确',
};

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: '格式化',
      category: 'Stylishtic',
      recommended: true,
    },
    fixable: 'code',
    messages,
    schema: [
      {
        type: 'object',
        properties: {
          printWidth: {
            type: 'number',
          },
          tabWidth: {
            type: 'number',
          },
          objectCurlySpacing: {
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
    const maxLen = options.printWidth || 80;
    const strict = typeof options.strict == 'boolean' ? options.strict : true;
    const lineRanges = getSourceCodeLineRanges(sourceCode);

    function handleNamespaceOrDefaultImport(node) {
      if (node.loc.start.line !== node.loc.end.line) {
        context.report({
          node,
          messageId: 'formatNotGood',
          fix(fixer) {
            const result = [];
            const tokens = sourceCode.getTokens(node);
            for (let i = 0; i < tokens.length - 1; i++) {
              result.push(
                fixer.replaceTextRange(
                  [tokens[i].range[1], tokens[i + 1].range[0]],
                  isSemicolon(tokens[i + 1]) ? '' : ' '
                )
              );
            }
            return result;
          },
        });
      }
    }

    return {
      ObjectExpression(node) {
        const startBracket = sourceCode.getFirstToken(node);
        const endBracket = sourceCode.getLastToken(node);
        if (isSameLine(startBracket, endBracket)) {
          const offset = getOffest2LineStart(lineRanges, endBracket);
          if (offset + 1 > maxLen) {
            context.report({
              node,
              messageId: 'formatNotGood',
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
              messageId: 'formatNotGood',
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
        if (isNsImport(node)) {
          handleNamespaceOrDefaultImport(node);
          return;
        }
        const hasDefaultImport = node.specifiers.some((specifier) => specifier.type === 'ImportDefaultSpecifier');
        const importSpecifiers = node.specifiers.filter((specifier) => specifier.type === 'ImportSpecifier');
        const importSpecifierSize = importSpecifiers.length;

        if (hasDefaultImport) {
          if (!importSpecifierSize) {
            handleNamespaceOrDefaultImport(node);
            return;
          }
          if (node.loc.start.line === node.loc.end.line) {
          }
        }

        if (importSpecifierSize) {
          const offset = getOffest2LineStart(lineRanges, node, false);
          const lastImportSpecifier = importSpecifiers[importSpecifierSize - 1];
          const lastImportSpecifierLine = lastImportSpecifier.loc.start.line;
          let endBracket = sourceCode.getTokenAfter(lastImportSpecifier);
          if (isComma(endBracket)) {
            endBracket = sourceCode.getTokenAfter(endBracket);
          }
          const hasImportSpecifierBeforeEndBracket = isSameLine(lastImportSpecifier, endBracket);

          // 如果import语句末尾所在行超出maxLen, 且该行中还有ImportSpecifier
          if (offset + 1 > maxLen && hasImportSpecifierBeforeEndBracket) {
            context.report({
              node,
              messageId: 'formatNotGood',
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
