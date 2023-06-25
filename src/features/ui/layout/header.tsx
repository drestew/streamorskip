import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@public/logo.png';
import { Button } from '@features/ui/button/button';
import { space } from '@styles/theme';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(8)};
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Link href="/">
        <Image
          alt="logo"
          src={logo}
          width="168"
          height="30"
          quality={100}
          priority
        />
      </Link>
      <Link href="/login">
        <Button color="secondary" shade={300} size="sm" role="link">
          Log In
        </Button>
      </Link>
    </HeaderContainer>
  );
}
