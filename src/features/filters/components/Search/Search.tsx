import styled from 'styled-components';
import { color, space } from '@styles/theme';
import React from 'react';
import { supabaseClient } from '@utils/supabase-client';
import Image from 'next/image';
import search from '@public/search.png';
import close from '@public/close.png';
import { Command } from 'cmdk';
import { useFilters } from '@features/filters';
import { useRouter } from 'next/router';

type SearchItem = {
  title: string;
  nfid: number;
  rating: number | null;
};

const Container = styled.div`
  position: relative;
`;

const StyledCommand = styled(Command)`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled(Command.Input)`
  padding: ${space(1)};
  background-color: white;
  border-radius: 5px;
  border: none;
`;

const IconContainer = styled.div`
  background-color: ${color('primary', 300)};
  display: flex;
  align-items: center;
  padding: 0.45rem ${space(3)};
  border-radius: 0 5px 5px 0;
  position: absolute;
  top: 0;
  right: -1px;
`;

const SearchIcon = styled(Image)`
  align-self: center;
  cursor: pointer;
  position: relative;
`;

const CloseIcon = styled(Image)`
  position: absolute;
  left: -40px;
  cursor: pointer;
  background-color: white;
`;

const List = styled(Command.List)`
  z-index: 2;
  background-color: white;
  border: solid 1px ${color('primary', 500)};
  position: absolute;
  top: 2.1rem;
  width: 100%;
`;

const Item = styled(Command.Item)`
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
  const { handleFilters } = useFilters();
  const router = useRouter();

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

  function handleValueChange(value: string) {
    setSearchText(value);
    setDropdownOpen(true);
    const titleOptions = titles.filter((content) => {
      const titleLCase = content.title.toLowerCase();
      return (
        titleLCase.startsWith(value.toLowerCase()) ||
        titleLCase.includes(value.toLowerCase())
      );
    });
    const searchResult = titleOptions.map((result, index) => {
      if (index > 5) return;

      function handleSelectedValue(selectedValue: string) {
        handleFilters({ search: selectedValue });
        const value = titleOptions.find(
          (itemOption) => selectedValue === itemOption.title.toLowerCase()
        );
        if (value) {
          setSearchText(value?.title);
          setDropdownOpen(false);
        }
      }
      return (
        <Item
          key={result.nfid}
          value={result.title}
          onSelect={(selectedValue) => handleSelectedValue(selectedValue)}
        >
          {result.title}
        </Item>
      );
    });
    setSearchResults(searchResult.slice(0, 5));
  }

  function clearSearchText() {
    setSearchText('');
    const query = { ...router.query };
    delete query.search;
    router.push({ pathname: router.pathname, query });
  }

  // need separate useEffects for search and genre dependencies since
  // they function the opposite of one another
  React.useEffect(() => {
    if (!router.query.search) {
      setSearchText('');
    }
  }, [router.query.search]);

  React.useEffect(() => {
    if (router.query.search) {
      const query = { ...router.query };
      delete query.search;
      router.push({ pathname: router.pathname, query });
    }
  }, [router.query.genre]);

  React.useEffect(() => {
    setSearchText('');
    const query = { ...router.query };
    delete query.search;
    router.push({ pathname: router.pathname, query });
  }, [router.query.category]);

  return (
    <Container>
      <StyledCommand label="searchbar" shouldFilter={false}>
        <Input
          value={searchText}
          onValueChange={handleValueChange}
          placeholder="Search for a movie or series..."
          role="search"
          data-cy="searchbar"
        />
        {searchText !== '' && dropdownOpen && (
          <List>
            <Command.Empty>No results found.</Command.Empty>
            {searchResults}
          </List>
        )}
      </StyledCommand>
      <IconContainer>
        {searchText !== '' && (
          <CloseIcon src={close} alt="clear search" onClick={clearSearchText} />
        )}
        <SearchIcon
          src={search}
          alt="search content"
          width={18}
          height={18}
          onClick={clearSearchText}
        />
      </IconContainer>
    </Container>
  );
}
