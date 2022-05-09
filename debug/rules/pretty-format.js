const Linter = require('eslint').Linter;
const linter = new Linter();
const rule = require('../../lib/rules/pretty-format');

linter.defineRule('pretty-format', rule);

// const result1 = linter.verifyAndFix(
//   `import React, {
// useSize,
// useScroll, useSetState, useMount, useImperative, useHooks, useEventListener
// } from 'ahooks';
// import * as veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks';

// export const student = {
//   id: 1,
//   name: 'javen',
//   age: 18,
//   gender: 'male'
// }

// let cond1 = true
// let cond2 = true
// let cond3 = true
// let subject = null;

// export function test1() {
//   if (cond1) {
//     if (cond2) {
//       if (cond3) {
//         subject = { id: 2, name: '语文', studentCount: 50 }
//       }
//     }
//   }
//   const thisIsALongList = ['xxxxxxx', 'yyyyyyyyy', 'zzzzzzzzz'];
//   console.log({ subject })
// }

// console.log('good');`,
//   {
//     parserOptions: {
//       sourceType: 'module',
//       ecmaVersion: 12,
//     },
//     rules: {
//       'max-len': [2, { code: 50 }],
//     },
//   }
// );

// const result2 = linter.verifyAndFix(
//   `import React, { FC, ReactNode, useState, useRef, useCallback, useEffect } from 'react';`,
//   {
//     parserOptions: {
//       sourceType: 'module',
//       ecmaVersion: 12,
//     },
//     rules: {
//       'pretty-format': [2, { printWidth: 50 }],
//     },
//   }
// );

const result3 = linter.verifyAndFix(
  `import * as
veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks';`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);

const result4 = linter.verifyAndFix(
  `import *
as veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks';`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);

const result5 = linter.verifyAndFix(
  `import
* as veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks';`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);

const result6 = linter.verifyAndFix(
  `  import
* as veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks';`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);

const result7 = linter.verifyAndFix(
  `import * as
veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongNs from 'ahooks'
;`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);
const result8 = linter.verifyAndFix(
  `import veryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryVeryLongDefault from 'ahooks';`,
  {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 12,
    },
    rules: {
      'pretty-format': [2, { printWidth: 50 }],
    },
  }
);

console.log('result: ', result8);
