import styled from 'styled-components';
import { space } from '@styles/theme';
import React from 'react';
import * as Select from '@radix-ui/react-select';
import { supabaseClient } from '@utils/supabase-client';

const Input = styled.input`
  width: 400px;
  padding: ${space(1)};
  background-color: white;
  border-radius: 5px;
`;

const Content = styled(Select.Content)`
  background-color: white;
  width: 400px;
`;

export function Search() {
  const [searchText, setSearchText] = React.useState('');
  const [titles, setTitles] = React.useState<string[]>([]);

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
      const titlesArr: { title: string }[][] = [];
      const titleCount = await titleCountDB();
      if (titleCount) {
        for (let i = 0; i < titleCount; i += 1000) {
          const { data, error } = await supabaseClient
            .from('catalog')
            .select('title')
            .range(i, i + 1000);
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
      const titles = ([] as Array<{ title: string }>)
        .concat(...titlesArr)
        .map((titleObj) => titleObj.title);
      setTitles(titles);
    }
    getTitles();
  }, [titles]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(event.target.value);
    const titleOptions = titles.filter((title) => {
      const titleLCase = title.toLowerCase();
      return (
        titleLCase.startsWith(event.target.value) ||
        titleLCase.includes(event.target.value)
      );
    });
  }

  return (
    <>
      <Input
        value={searchText}
        onChange={(event) => handleChange(event)}
        placeholder="Search"
      />
      <Select.Root open={searchText !== ''}>
        <Content>
          <Select.Viewport>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="apple">Apple</Select.Item>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.Viewport>
        </Content>
      </Select.Root>
    </>
  );
}
