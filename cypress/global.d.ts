export {};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      // the cypress skip-test plugin has an open issue with types, that is  we have declare these here
      // https://github.com/cypress-io/cypress-skip-test/issues/164
      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.skipOn('sandbox')`
       */
      skipOn(nameOrFlag: string | boolean | (() => boolean), cb?: () => void): Chainable<Subject>;
      /** https://www.npmjs.com/package/@cypress/skip-test
       * `cy.onlyOn('sandbox')`
       */
      onlyOn(nameOrFlag: string | boolean | (() => boolean), cb?: () => void): Chainable<Subject>;
    }
  }
}
