import { color, space, font } from '@styles/theme';
import { supabaseClient } from '@utils/supabase-client';
import styled, { css } from 'styled-components';
import { Database } from '../../../types/supabase';
import { useState } from 'react';

type Profile = Database['public']['Tables']['profile']['Row'];

const Container = styled.div`
  width: 400px;
  margin: auto;
  background-color: gray;
`;

export function Auth() {
  const [email, setEmail] = useState('');

  async function createUser() {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: email,
    });
  }

  return (
    <Container>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </form>
      <button onClick={createUser}>Create Account</button>
    </Container>
  );
}
// TODO redirect signup to welcome page (username, avatar)
