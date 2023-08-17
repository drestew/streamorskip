import styled from 'styled-components';
import { color, space } from '@styles/theme';
import React from 'react';
import * as Select from '@radix-ui/react-select';
import { supabaseClient } from '@utils/supabase-client';

type SearchItem = {
  title: string;
  nfid: number;
  rating: number | null;
};

const Input = styled.input`
  width: 400px;
  padding: ${space(1)};
  background-color: white;
  border-radius: 5px;
`;

const Label = styled.label`
  clip-path: inset(100%);
  position: absolute;
`;

const Content = styled(Select.Content)`
  background-color: white;
  width: 400px;
`;

const Item = styled(Select.Item)`
  cursor: pointer;
  padding: ${space(1)} ${space(2)};
  &:hover {
    background-color: ${color('primary', 200)};
    color: white;
  }
`;

export function Search() {
  const [searchText, setSearchText] = React.useState('');
  const [titles, setTitles] = React.useState<SearchItem[]>([]);
  const [searchResults, setSearchResults] = React.useState<
    (JSX.Element | undefined)[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const titleCountDB = async () => {
      const { count, error } = await supabaseClient
        .from('catalog')
        .select('title', { count: 'exact', head: true });

      if (error) {
        console.log('Error getting titles: ', {
          message: error.message,
          details: error.details,
        });
      }

      return count;
    };

    async function getTitles() {
      const titlesArr: SearchItem[][] = [];
      const titleCount = await titleCountDB();
      if (titleCount) {
        for (let i = 0; i < titleCount; i += 1000) {
          const { data, error } = await supabaseClient
            .from('catalog')
            .select('title, nfid, rating')
            .eq('on_Nflix', true)
            .gt('rating', 0)
            .range(i, i + 1000)
            .order('rating', { ascending: false });

          if (error) {
            console.log('Error getting titles: ', {
              message: error.message,
              details: error.details,
            });
          }
          if (data) {
            titlesArr.push(data);
          }
        }
      }
      const titlesConcat = ([] as Array<SearchItem>).concat(...titlesArr);
      setTitles(titlesConcat);
    }
    getTitles();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
    setDropdownOpen(true);
    const titleOptions = titles.filter((content) => {
      const titleLCase = content.title.toLowerCase();
      return (
        titleLCase.startsWith(event.target.value.toLowerCase()) ||
        titleLCase.includes(event.target.value.toLowerCase())
      );
    });
    const searchResult = titleOptions.map((result, index) => {
      if (index > 5) return;
      return (
        <Item key={result.nfid} value={result.title}>
          {result.title}
        </Item>
      );
    });
    setSearchResults(searchResult);
  }

  function handleValueChange(value: string) {
    setSearchText(value);
    setDropdownOpen(false);
  }

  function handleOutsideClick() {
    setDropdownOpen(false);
  }

  return (
    <>
      <Label htmlFor="searchbar">
        <span>Search for a movie or series</span>
      </Label>
      <Input
        value={searchText}
        onChange={(event) => handleChange(event)}
        placeholder="Search for a movie or series..."
        id="searchbar"
        data-cy="searchbar"
        role="search"
      />
      <Select.Root
        open={dropdownOpen}
        onValueChange={handleValueChange}
        value={''} // needs to be set in order to set state of input text
      >
        <Content onPointerDownOutside={handleOutsideClick}>
          <Select.Viewport>{searchResults}</Select.Viewport>
        </Content>
      </Select.Root>
    </>
  );
}
