const cyExtendsTask = require('@bahmutov/cypress-extends');
const cyCodeCoverageTask = require('@cypress/code-coverage/task');

module.exports = (on, config) => {

  const allConfigs = Object.assign({},
    cyCodeCoverageTask(on, config),
    // using a plugin until Cypress adds native support for extending configuration files. Otherwise you have to duplicate cypress.json properties in each config file.
    cyExtendsTask(config.configFile)
  );

  return allConfigs;
};
