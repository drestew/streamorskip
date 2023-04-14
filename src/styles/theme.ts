type Color = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
};

type Font = {
  regular: string;
  medium: string;
  semibold: string;
  bold: string;
};

export type Theme = {
  color: {
    primary: Color;
    secondary: Color;
    tertiary: Color;
    gray: Color;
    error: Color;
    dark: Color;
  };
  space: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
  };
  font: {
    xs: Font;
    sm: Font;
    md: Font;
    lg: Font;
    xl: Font;
  };
};

export const theme = {
  color: {
    primary: {
      100: '#7282BE',
      200: '#4A5DA2',
      300: '#324692',
      400: '#1E327A',
      500: '#0E2060',
    },
    secondary: {
      100: '#3DA2A2',
      200: '#1F9393',
      300: '#068484',
      400: '#006B6B',
      500: '#005252',
    },
    tertiary: {
      100: '#FFE298',
      200: '#E5C46F',
      300: '#AA8B39',
      400: '#735A17',
      500: '#3D2D04',
    },
    error: {
      100: '#FF7C75',
      200: '#E8554D',
      300: '#BD2B23',
      400: '#8A110B',
      500: '#3C0300',
    },
    gray: {
      100: '#737478',
      300: '#636369',
      200: '#51525A',
      400: '#40424B',
      500: '#2F303A',
    },
    dark: {
      300: '#1E212B',
    },
  },
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  font: {
    xs: {
      regular: `
          font-size: 0.75rem;
          font-weight: 400;
        `,
      bold: `
          font-size: 0.75rem;
          font-weight: 700;
        `,
    },
    sm: {
      regular: `
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 400;
        `,
      bold: `
          font-size: 0.875rem;
          font-weight: 700;
        `,
    },
    md: {
      regular: `
          font-size: 1rem;
          font-weight: 400;
        `,
      bold: `
          font-size: 0.1rem;
          font-weight: 700;
        `,
    },
    lg: {
      regular: `
          font-size: 1.25rem;
          font-weight: 400;
        `,
      bold: `
          font-size: 1.25rem;
          font-weight: 700;
        `,
    },
    xl: {
      regular: `
          font-size: 1.5rem;
          font-weight: 400;
        `,
      bold: `
          font-size: 1.5rem;
          font-weight: 700;
        `,
    },
  },
};

export function color(name: keyof Theme['color'], shade: keyof Color) {
  return ({ theme }: { theme: Theme }) => theme.color[name][shade];
}

export function space(...names: Array<keyof Theme['space']>) {
  return ({ theme }: { theme: Theme }) => {
    const spaces = names.map((name) => theme.space[name]);
    return spaces.join(' ');
  };
}

export function font(size: keyof Theme['font'], weight: keyof Font) {
  return ({ theme }: { theme: Theme }) => theme.font[size][weight];
}
