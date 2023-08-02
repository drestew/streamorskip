import { SignupForm } from '@features/auth/components/SignupForm/SignupForm';

describe('<SignupForm />', () => {
  beforeEach(() => {
    cy.mount(<SignupForm />);
  });

  it('displays "invalid email" error', () => {
    cy.get('input').type('testUserNo@');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="validationError"]').should('exist');
  });

  it('displays "email already exists" error', () => {
    cy.get('input').type('drestew48@gmail.com');
    cy.get('[data-cy="submit"]').click();
    cy.get('[data-cy="validationError"]').should('exist');
  });
});
