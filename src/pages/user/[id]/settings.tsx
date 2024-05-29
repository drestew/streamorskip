import styled from 'styled-components';
import React from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@src/types/supabase';
import { Header } from '@components/Header/Header';
import { color, font, space } from '@styles/theme';
import * as Switch from '@radix-ui/react-switch';
import { Button } from '@components/Button/Button';

const PageContainer = styled.div`
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
  margin: auto;

  @media (min-width: 550px) {
    width: 80%;
  }

  @media (min-width: 1100px) {
    width: 60%;
  }
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

const SaveContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardSave = styled.p`
  color: ${color('secondary', 400)};
  margin-top: ${space(1)};
`;

export default function Settings() {
  const [filterRated, setFilterRated] = React.useState<boolean>(false);
  const [filterSaved, setFilterSaved] = React.useState<boolean>(false);
  const [filterRemovedContent, setFilterRemovedContent] =
    React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userEmail, setUserEmail] = React.useState<string | undefined>('');
  const [settingsSaved, setSettingsSaved] = React.useState(false);
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
  }, [supabase.auth, userId]);

  React.useEffect(() => {
    if (!userId) {
      return;
    }

    getSettings();

    async function getSettings() {
      const { data, error } = await supabase
        .from('profile')
        .select('filter_rated, filter_saved, filter_removed_content')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error getting user settings:', {
          message: error.message,
          details: error.details,
        });
      }

      if (!data) {
        return null;
      }

      setFilterRated(data.filter_rated);
      setFilterSaved(data.filter_saved);
      setFilterRemovedContent(data.filter_removed_content);
    }
  }, [supabase, userId]);

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const { error } = await supabase
      .from('profile')
      .update({
        filter_rated: filterRated,
        filter_saved: filterSaved,
        filter_removed_content: filterRemovedContent,
      })
      .eq('id', userId);

    setSettingsSaved(true);

    if (error) {
      console.error('Error updating user settings:', {
        message: error.message,
        details: error.details,
      });
    }
  }

  return (
    <PageContainer>
      <Header userId={userId} supabase={supabase} />
      <CardContainer onSubmit={(event) => handleSubmit(event)}>
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
              checked={filterRated}
              value={filterRated ? 'on' : 'off'}
              onCheckedChange={() => setFilterRated(!filterRated)}
            >
              <ToggleThumb />
            </ToggleRoot>
          </PreferenceItem>
          <PreferenceItem>
            <CardText htmlFor="filter-list">Filter content on my list</CardText>
            <ToggleRoot
              id="filter-saved"
              name="filter-saved"
              checked={filterSaved}
              value={filterSaved ? 'on' : 'off'}
              onCheckedChange={() => setFilterSaved(!filterSaved)}
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
              checked={filterRemovedContent}
              value={filterRemovedContent ? 'on' : 'off'}
              onCheckedChange={() =>
                setFilterRemovedContent(!filterRemovedContent)
              }
            >
              <ToggleThumb />
            </ToggleRoot>
          </PreferenceItem>
        </PreferencesContainer>
        <SaveContainer>
          <Button color="primary" size="md" shade={300} type="submit">
            Save Settings
          </Button>
          {settingsSaved && <CardSave>Saved!</CardSave>}
        </SaveContainer>
      </CardContainer>
    </PageContainer>
  );
}
