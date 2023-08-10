import React from 'react';
import { CatalogCard } from './CatalogCard';
import { theme } from '@styles/theme';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@styles/global-style';

describe('<CatalogCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    function setModalState() {
      return false;
    }

    cy.mount(
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <CatalogCard
          title="Mighty Morphin Power Rangers"
          nfid={70184128}
          rating={6.4}
          stream={null}
          synopsis="Five average teens are chosen by an intergalactic wizard to become the Power Rangers, who must use their new powers to fight the evil Rita Repulsa."
          img="https://occ-0-2851-38.1.nflxso.net/dnm/api/v6/evlCitJPPCVCry0BZlEFb5-QjKc/AAAABVQvr2do2ukNtPmRSP3F5r0T_2TzFuPaYrYgL5du6wL2D3JvKPtySMSfYu9BEVuUJEmKaxHVx1mKWAxkMhm_rCRi1Q.jpg?r=04f"
          priorityImg={false}
          modalState={setModalState}
        />
      </ThemeProvider>
    );
  });
});
