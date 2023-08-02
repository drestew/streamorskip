import { LogInForm } from '@features/auth/components/LoginForm/LoginForm';

describe('<LogInForm />', () => {
  beforeEach(() => {
    cy.mount(<LogInForm />);
  });

  it('displays "invalid email" error', () => {
    cy.get('input').type('testUserNo@');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="validationError"]').should('exist');
  });

  it('displays "email doesn\'t exist" error', () => {
    cy.get('input').type('testUser123@gmail.com');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="validationError"]').should('exist');
  });
});
