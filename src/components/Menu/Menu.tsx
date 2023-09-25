import * as Select from '@radix-ui/react-select';
import styled from 'styled-components';
import Image from 'next/image';
import React from 'react';
import { color, space } from '@styles/theme';
import menu from '@public/menu.png';
import Link from 'next/link';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const MenuContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;

const MenuTrigger = styled(Select.Trigger)`
  background-color: ${color('dark', 300)};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${space(20)};
  border: none;
`;

const MenuList = styled(Select.Content)`
  background-color: #dadcef;
  border-radius: ${space(1)};
  display: flex;
  justify-content: center;
  border: solid 1px ${color('primary', 100)};
  position: relative;
  z-index: 1;
`;

const MenuItem = styled(Select.Item)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${space(1)} ${space(4)};
  cursor: pointer;

  &:hover {
    background-color: ${color('primary', 300)};
    color: white;

    & > * {
      color: white;
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${color('dark', 300)};

  &:hover {
    color: white;
  }
`;

export function Menu() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [menuOpen, setMenuOpen] = React.useState<boolean | undefined>(
    undefined
  );
  async function handleValueChange(value: string) {
    if (value === 'logout') {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log('Error:', {
          message: error?.message,
        });
      }
    }
    setMenuOpen(true);
  }

  return (
    <MenuContainer>
      <Select.Root open={menuOpen} value={''} onValueChange={handleValueChange}>
        <MenuTrigger>
          <Select.Value>
            <Image src={menu} alt="menu" width={20} height={20} />
          </Select.Value>
        </MenuTrigger>
        <MenuList position="popper" alignOffset={-55}>
          <Select.Viewport>
            <MenuItem value={'my-list'}>
              <StyledLink href={`user/${user?.id}`}>My List</StyledLink>
            </MenuItem>
            {/*<MenuItem value={'settings'}>*/}
            {/*  <StyledLink href="/settings">Settings</StyledLink>*/}
            {/*</MenuItem>*/}
            <MenuItem value={'logout'}>Logout</MenuItem>
          </Select.Viewport>
        </MenuList>
      </Select.Root>
    </MenuContainer>
  );
}
