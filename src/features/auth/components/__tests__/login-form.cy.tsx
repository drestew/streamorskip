import { LogInForm } from '@features/auth/components/LoginForm/LoginForm';
import user from '@fixtures/user.json';

describe('<LogInForm />', () => {
  beforeEach(() => {
    cy.mount(<LogInForm />);
  });

  it('displays error for invalid input', () => {
    cy.get('input').type('testUserNo@');
    cy.getEl('submit').click();
    cy.getEl('validationError').should('exist');
  });

  it('displays error for non-existent email', () => {
    cy.intercept('GET', `/rest/v1/*`, (req) => {
      req.continue((res) => {
        expect(res.statusCode).to.eq(406);
      });
    });
    cy.get('input').type(user.email);
    cy.getEl('submit').click();
    cy.getEl('validationError').should('exist');
  });

  it('confirms user and displays message to check email for login link', () => {
    cy.intercept('GET', `/rest/v1/*`, {
      body: {}, // no response body needed since stub bypasses validation
    });
    cy.intercept('POST', '/auth/v1/*', (req) => {
      req.continue((res) => {
        expect(res.statusCode).oneOf([400, 429]); // ensures real email is never stubbed
      });
    });
    cy.get('input').type(user.email);
    cy.getEl('submit').click();
    cy.getEl('emailSent').should('exist');
  });
});
