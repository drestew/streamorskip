import styled from 'styled-components';
import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';
import { Header } from '@components/Header/Header';
import { color, font, space } from '@styles/theme';
import * as Switch from '@radix-ui/react-switch';
import { Button } from '@components/Button/Button';

const PageContainer = styled.div`
  max-width: 400px;
  margin: auto;
  padding: ${space(3)} ${space(4)};
`;

const CardContainer = styled.form`
  padding: ${space(5)};
  background-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${space(4)};
  ${font('sm', 'regular')};
`;

const CardText = styled.label``;

const EmailContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${space(2)};
`;

const Email = styled.input`
  border-radius: 5px;
  color: #838383;
  margin-left: ${space(4)};
  width: 15rem;
  text-align: center;
`;

const PreferencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${space(2)};
`;

const PreferenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleRoot = styled(Switch.Root)`
  all: unset;
  width: 42px;
  height: 25px;
  border-radius: 100px;
  background-color: ${color('gray', 100)};
  display: flex;
  align-items: center;

  &[data-state='checked'] {
    background-color: ${color('secondary', 200)};
  }
`;

const ToggleThumb = styled(Switch.Thumb)`
  display: block;
  border-radius: 100px;
  background-color: white;
  width: 21px;
  height: 21px;
  transition: tranform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state='checked'] {
    transform: translateX(19px);
  }
`;

export default function Settings() {
  const [filterRated, setFilterRated] = React.useState<'on' | 'off'>('off');
  const [filterList, setFilterList] = React.useState<'on' | 'off'>('off');
  const [filterRemovedContent, setFilterRemovedContent] = React.useState<
    'on' | 'off'
  >('off');
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | undefined>('');
  const supabase = useSupabaseClient<Database>();

  React.useEffect(() => {
    getSession();

    async function getSession() {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        setUserId(session.data.session.user.id);
        setUserEmail(session.data.session.user.email);
      }
    }
  }, [supabase.auth]);

  return (
    <PageContainer>
      <Header userId={userId} />
      <CardContainer>
        <EmailContainer>
          <CardText htmlFor="email">Email</CardText>
          <Email value={userEmail} disabled={true} id="email" />
        </EmailContainer>
        <PreferencesContainer>
          <CardText style={{ textDecoration: 'underline' }}>
            Browsing Preferences
          </CardText>
          <PreferenceItem>
            <CardText htmlFor="filter-rated">
              Filter content I&apos;ve rated
            </CardText>
            <ToggleRoot
              id="filter-rated"
              name="filter-rated"
              value={filterRated}
              onCheckedChange={() =>
                setFilterRated((old) => (old === 'on' ? 'off' : 'on'))
              }
            >
              <ToggleThumb />
            </ToggleRoot>
          </PreferenceItem>
          <PreferenceItem>
            <CardText htmlFor="filter-list">Filter content on my list</CardText>
            <ToggleRoot
              id="filter-list"
              name="filter-list"
              value={filterList}
              onCheckedChange={() =>
                setFilterList((old) => (old === 'on' ? 'off' : 'on'))
              }
            >
              <ToggleThumb />
            </ToggleRoot>
          </PreferenceItem>
          <PreferenceItem>
            <CardText htmlFor="filter-removed-content">
              Filter content removed from Netflix
            </CardText>
            <ToggleRoot
              id="filter-removed-content"
              name="filter-removed-content"
              value={filterRemovedContent}
              onCheckedChange={() =>
                setFilterRemovedContent((old) => (old === 'on' ? 'off' : 'on'))
              }
            >
              <ToggleThumb />
            </ToggleRoot>
          </PreferenceItem>
        </PreferencesContainer>
        <Button color="primary" size="md" shade={300}>
          Save Settings
        </Button>
      </CardContainer>
    </PageContainer>
  );
}
