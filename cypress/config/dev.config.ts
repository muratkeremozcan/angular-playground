import { defineConfig } from 'cypress';
import * as cyExtendsTask from '@bahmutov/cypress-extends';
import * as cyCodeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  projectId: '4mhoqq',
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
    openMode: 0
  },
  videoUploadOnPasses: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return Object.assign({}, cyCodeCoverageTask(on, config), cyExtendsTask(config.configFile));
    },
    baseUrl: 'https://d1kaucldkbcik4.cloudfront.net',
    specPattern: 'cypress/e2e/**/*.ts'
  }
});
