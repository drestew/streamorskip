import { Search } from '@features/filters/components/Search/Search';

describe('<Search />', () => {
  beforeEach(() => {
    cy.mount(<Search />);
  });

  it('renders the dropdown', () => {
    cy.getEl('search-input').type('The Last Dance', {
      delay: 500,
    });
    cy.getEl('search-dropdown').contains('The Last Dance');
  });
});
