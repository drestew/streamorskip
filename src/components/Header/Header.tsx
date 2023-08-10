import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@public/logo.png';
import { Button } from '../Button/Button';
import { space } from '@styles/theme';
import { Menu } from '../Menu/Menu';
import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(8)};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
`;

type HeaderProps = {
  isFetching: boolean;
};
export function Header({ isFetching }: HeaderProps) {
  const user = useUser();

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
      {!user && !isFetching ? (
        <StyledLink href="/login">
          <Button color="secondary" shade={300} size="sm" role="link">
            Log In
          </Button>
        </StyledLink>
      ) : (
        <Menu />
      )}
    </HeaderContainer>
  );
}
