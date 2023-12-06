import styled, { css } from 'styled-components';
import { color, space } from '@styles/theme';
import React from 'react';
import { supabaseClient } from '@utils/supabase-client';
import Image from 'next/image';
import search from '@public/search.png';
import close from '@public/close.png';
import { useFilters } from '@features/filters';
import { useRouter } from 'next/router';
import {
  useCombobox,
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from 'downshift';

type SearchItem = {
  title: string;
  nfid: number;
  rating: number | null;
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: ${space(1)};
  background-color: white;
  border-radius: 5px;
  border: none;
`;

const Label = styled.label`
  position: absolute !important;
  clip-path: inSet(100%);
`;

const IconContainer = styled.div`
  background-color: ${color('primary', 300)};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 5px 5px 0;
  position: absolute;
  top: 0;
  right: -1px;
  width: 2.5rem;
  height: 100%;
  cursor: pointer;
`;

const SearchIcon = styled.button`
  background-color: ${color('primary', 300)};
  border-style: none;
  align-self: center;
  cursor: pointer;
  position: relative;
  padding: 0;
`;

const CloseIcon = styled.button`
  position: absolute;
  left: -40px;
  cursor: pointer;
  border-style: none;
  background-color: white;
  padding-right: 5px;
`;

const List = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  z-index: 2;
  background-color: white;
  position: absolute;
  top: 2.1rem;
  width: 100%;
  padding: 0;

  ${(props) => {
    if (props.isOpen) {
      return css`
        border: solid 1px ${color('primary', 300)};
      `;
    }
  }}
`;

const Item = styled.li`
  cursor: pointer;
  padding: ${space(1)} ${space(2)};
  &:hover {
    background-color: ${color('primary', 200)};
    color: white;
  }
`;

export function Search() {
  const [titles, setTitles] = React.useState<SearchItem[]>([]);
  const [searchResults, setSearchResults] = React.useState<
    (SearchItem | undefined)[]
  >([]);
  const { handleFilters } = useFilters();
  const router = useRouter();
  let titleOptions: SearchItem[] = [];

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

  function clearSearchText() {
    selectItem(null);
    const query = { ...router.query };
    delete query.search;
    router.push({ pathname: router.pathname, query });
  }

  // need separate useEffects for search and genre dependencies since
  // they function the opposite of one another
  React.useEffect(() => {
    if (!router.query.search) {
      selectItem(null);
      const query = { ...router.query };
      router.push({ pathname: router.pathname, query });
    }
  }, [router.query.search]);

  React.useEffect(() => {
    if (router.query.search) {
      const query = { ...router.query };
      delete router.query.search;
      router.push({ pathname: router.pathname, query });
    }
  }, [router.query.genre]);

  React.useEffect(() => {
    selectItem(null);
    const query = { ...router.query };
    delete query.search;
    router.push({ pathname: router.pathname, query });
  }, [router.query.category]);

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getItemProps,
    selectItem,
    inputValue,
  } = useCombobox<SearchItem | undefined>({
    stateReducer,
    items: searchResults,
    itemToString: (item) => (item ? item.title : ''),
    onInputValueChange: ({ inputValue: newInputValue }) => {
      if (newInputValue) {
        titleOptions = titles.filter((content) => {
          const titleLCase = content.title.toLowerCase();
          return (
            titleLCase.startsWith(newInputValue.toLowerCase()) ||
            titleLCase.includes(newInputValue.toLowerCase())
          );
        });
        const searchResult = titleOptions.map((item, index) => {
          if (index > 5) return;

          return { title: item.title, nfid: item.nfid, rating: item.rating };
        });
        setSearchResults(searchResult);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      handleFilters({ search: selectedItem?.title });
    },
  });

  function stateReducer(
    state: UseComboboxState<SearchItem | undefined>,
    actionAndChanges: UseComboboxStateChangeOptions<SearchItem | undefined>
  ) {
    const { type, changes } = actionAndChanges;
    if (
      changes.inputValue === '' &&
      (state.inputValue !== '' || useCombobox.stateChangeTypes.InputClick)
    ) {
      return {
        ...changes,
        isOpen: false,
      };
    }
    if (type === useCombobox.stateChangeTypes.InputKeyDownEnter) {
      handleFilters({ search: inputValue });
    }
    return changes;
  }

  return (
    <Container>
      <Label {...getLabelProps()} htmlFor="searchbar">
        <span aria-hidden="true">Search for a movie or series.</span>
      </Label>
      <Input
        {...getInputProps()}
        placeholder="Search for a movie or series..."
        id="searchbar"
        data-cy="search-input"
      />
      <List {...getMenuProps()} data-cy="search-dropdown" isOpen={isOpen}>
        {isOpen &&
          searchResults
            .map((item, index) => {
              if (index > 5) return;
              return (
                <Item key={item?.nfid} {...getItemProps({ item, index })}>
                  {item?.title}
                </Item>
              );
            })
            .filter((item) => item)}
      </List>
      <IconContainer>
        {inputValue && (
          <CloseIcon onClick={clearSearchText} data-cy="clear-search">
            <Image src={close} alt="clear search" />
          </CloseIcon>
        )}
        <SearchIcon
          onClick={() => handleFilters({ search: inputValue })}
          data-cy="search-icon"
        >
          <Image src={search} alt="search content" width={18} height={18} />
        </SearchIcon>
      </IconContainer>
    </Container>
  );
}
