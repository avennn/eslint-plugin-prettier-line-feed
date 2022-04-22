const Linter = require('eslint').Linter;
const linter = new Linter();
const rule = require('../../lib/rules/object-property-count');

linter.defineRule('object-property-count', rule);

const result = linter.verifyAndFix(`var student = {id: 1, name: 'javen', age: 18, gender: 'male' }`, {
  rules: {
    'object-property-count': [2, { max: 3 }],
  },
});

console.log('result: ', result);
