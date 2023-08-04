import { SignupForm } from '@features/auth/components/SignupForm/SignupForm';
import user from '@fixtures/user.json';

describe('<SignupForm />', () => {
  beforeEach(() => {
    cy.mount(<SignupForm />);
  });

  it('displays error for invalid input', () => {
    cy.get('input').type('testUserNo@');
    cy.getEl('submit').click();
    cy.getEl('validationError').should('exist');
  });

  it('displays error for unavailable email', () => {
    // response is 200 because is it returns an email, meaning it's unavailable
    cy.intercept('GET', `/rest/v1/*`, {
      body: {},
    });

    cy.get('input').type(user.email);
    cy.getEl('submit').click();
    cy.getEl('validationError').should('exist');
  });

  it('confirms available email and displays message to check email for login link', () => {
    // response is 406 because no email returned, meaning it's available
    cy.intercept('GET', '/rest/v1/*', (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(406);
      });
    });
    cy.intercept('POST', '/auth/v1/*', (req) => {
      req.continue((res) => {
        expect(res.statusCode).oneOf([200, 429]);
      });
    });
    cy.get('input').type(user.email);
    cy.getEl('submit').click();
    cy.getEl('emailSent').should('exist');
  });
});
