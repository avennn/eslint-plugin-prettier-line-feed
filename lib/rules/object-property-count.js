const messages = {
  exceedMax: 'Object Properties count exceeds {{max}}',
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
          max: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const sourceCode = context.getSourceCode();
    const options = context.options[0] || {};
    const max = options.max || 3;
    return {
      ObjectExpression(node) {
        const propertyCount = node.properties.length;
        const startBracket = sourceCode.getFirstToken(node);
        const endBracket = sourceCode.getLastToken(node);
        console.log('property count', startBracket, endBracket);
        if (propertyCount > max && startBracket.loc.start.line === endBracket.loc.start.line) {
          context.report({
            node,
            messageId: 'exceedMax',
            data: {
              max,
            },
            fix(fixer) {
              const result = [];
              node.properties.forEach((prop, index) => {
                if (!index) {
                  result.push(fixer.replaceTextRange([startBracket.range[1], prop.range[0]], '\n'));
                } else if (index === propertyCount - 1) {
                  const beforeToken = sourceCode.getTokenBefore(prop);
                  result.push(
                    fixer.replaceTextRange([beforeToken.range[1], prop.range[0]], '\n'),
                    fixer.replaceTextRange([prop.range[1], endBracket.range[0]], '\n')
                  );
                } else {
                  const beforeToken = sourceCode.getTokenBefore(prop);
                  result.push(fixer.replaceTextRange([beforeToken.range[1], prop.range[0]], '\n'));
                }
              });
              return result;
            },
          });
        }
      },
    };
  },
};
