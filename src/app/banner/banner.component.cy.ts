import { BannerComponent } from './banner.component';

describe('Banner Component', () => {
  it('loads with a default title', () => {
    /**
     * 2. Compile the component to test
     * Cypress uses a mount function that acts similar to a module or
     * configureTestingModule() in Jasmine. To just compile the component to test, the
     * developer would just pass in the Class instance of the component.
     *
     * You could also pass in the selector instead. This does not work with standalone components.
     */
    cy.mount(BannerComponent);

    cy.get('h1').should('have.text', 'Test Tour of Heroes');
  });

  it('can change the title via Input', () => {
    /**
     * 4. Mount flexibility
     * You get the ability to use a selector syntax for a more customizable feel.
     * This is extremely useful when you're using transcluded content or if you don't have
     * many inputs and/or outputs to test.
     *
     * When using this format, it feels a lot more like configureTestingModule. You will
     * have to import or declare the component depending on if the component is standalone.
     */
    cy.mount('<banner title="This is a test"></banner>', {
      imports: [BannerComponent]
    });

    cy.get('h1').should('have.text', 'This is a test');
  });

  it('loads with a green font color', () => {
    cy.mount(BannerComponent);

    /**
     * 7. Style Testing
     * One of my favorite features of Cypress component testing is the ease of
     * style testing. For most selectors you pass the css property you want to test
     * and then assert on its value.
     */
    cy.get('h1').should('have.css', 'color')
      .and('be.colored', 'green');
  });
});
