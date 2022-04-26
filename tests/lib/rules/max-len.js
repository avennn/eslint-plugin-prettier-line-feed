const RuleTester = require('eslint').RuleTester;
const outdent = require('outdent');
const rule = require('../../../lib/rules/max-len');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});

ruleTester.run('max-len', rule, {
  valid: [
    {
      code: `const student = { id: 1, name: 'javen', age: 18 }`,
    },
  ],
  invalid: [
    {
      code: `const student = { id: 1, name: 'javen', age: 18, gender: 'male' }`,
      options: [
        {
          max: 3,
        },
      ],
      errors: [
        {
          messageId: 'exceedMax',
          data: {
            max: 3,
          },
        },
      ],
      output: outdent`
        const student = {
        id: 1,
        name: 'javen',
        age: 18,
        gender: 'male'
        }
      `,
    },
  ],
});
