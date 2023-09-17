// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import { theme } from '@styles/theme';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@styles/global-style';

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18';
import React from 'react';
import { MountReturn } from 'cypress/react';
import { createMockRouter } from '../../test-utils/createMockRouter';
import { RouterContext } from 'next/dist/shared/lib/router-context';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       */
      mount(component: React.ReactNode): Cypress.Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', (component) => {
  const wrapper = (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterContext.Provider value={createMockRouter({})}>
        {component}
      </RouterContext.Provider>
    </ThemeProvider>
  );
  return mount(wrapper);
});

// Example use:
// cy.mount(<MyComponent />)
