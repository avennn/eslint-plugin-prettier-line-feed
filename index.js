const allRules = {
  // 'object-property-count': require('./lib/rules/object-property-count'),
  'max-len': require('./lib/rules/max-len'),
};

module.exports = {
  rules: allRules,
  configs: {
    recommended: {
      plugins: ['prettier-line-feed'],
      rules: {
        'prettier-line-feed/max-len': [2, { code: 80 }],
      },
    },
  },
};
