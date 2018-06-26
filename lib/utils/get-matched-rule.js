const RuleSet = require('webpack/lib/RuleSet');

function createMatcher(fakeFile) {
  return (rule) => {
    // #1201 we need to skip the `include` check when locating the vue rule
    const clone = Object.assign({}, rule);
    delete clone.include;
    const normalized = RuleSet.normalizeRule(clone, {}, '');
    return (
      !rule.enforce &&
      normalized.resource &&
      normalized.resource(fakeFile)
    );
  };
}

module.exports = (compiler) => {
  const rawRules = compiler.options.module.rules;
  const { rules } = new RuleSet(rawRules);

  const ruleIndex = rawRules.findIndex(createMatcher('a.svg'));
  const rule = rules[ruleIndex];
  if (rule.oneOf) {
    throw new Error('svg-sprite-loader currently does not support rules with oneOf.');
  }
  const loader = rule.loader
    ? rule.loader
    : rule.use.find(item => /svg-sprite-loader/.test(item.loader));
  return loader.options || {};
};
