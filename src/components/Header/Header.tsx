import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@public/logo.png';
import { Button } from '../Button/Button';
import { font, space } from '@styles/theme';
import { Menu } from '../Menu/Menu';
import React from 'react';
import { useRouter } from 'next/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

type HeaderProps = {
  userId: string | null;
  supabase: SupabaseClient;
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${space(8)};

  @media (min-width: 1100px) {
    padding: 0 ${space(4)};
  }
`;

const Navigation = styled.nav``;

const HeaderList = styled.u`
  display: flex;
  gap: ${space(8)};
  list-style: none;
  text-decoration: none;
`;

const HeaderText = styled.li`
  color: white;
  text-decoration: none;
  ${font('md', 'bold')};
`;

export function Header({ userId, supabase }: HeaderProps) {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }

    return 0;
  });

  React.useEffect(() => {
    // to not show the hamburger menu on larger screens
    const handleWindowResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  async function handleLogOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log('Error logging out:', {
        message: error?.message,
      });
    }
  }

  const { data } = useQuery({
    queryKey: ['auth', userId],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      return { userId: session.data.session?.user.id || null };
    },
  });

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
      {!router.pathname.includes('user') && !data?.userId ? (
        <Link href="/login" key={'login'}>
          <Button color="secondary" shade={300} size="sm" role="link">
            Log In
          </Button>
        </Link>
      ) : windowWidth < 750 ? (
        <Menu userId={data ? data.userId : null} />
      ) : (
        <Navigation>
          <HeaderList>
            <Link
              href={{
                pathname: `/user/[id]/my-list`,
                query: { id: `${data?.userId}` },
              }}
              style={{ textDecoration: 'none' }}
            >
              <HeaderText>My List</HeaderText>
            </Link>
            <Link
              href={{
                pathname: `/user/[id]/ratings`,
                query: { id: `${data?.userId}` },
              }}
              style={{ textDecoration: 'none' }}
            >
              <HeaderText>Ratings</HeaderText>
            </Link>
            <Link
              href={{
                pathname: `/user/[id]/settings`,
                query: { id: `${data?.userId}` },
              }}
              style={{ textDecoration: 'none' }}
            >
              <HeaderText>Settings</HeaderText>
            </Link>
            <HeaderText
              onClick={handleLogOut}
              style={{ textDecoration: 'none' }}
            >
              Log Out
            </HeaderText>
          </HeaderList>
        </Navigation>
      )}
    </HeaderContainer>
  );
}
