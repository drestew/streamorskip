import * as Form from '@radix-ui/react-form';
import styled from 'styled-components';
import { Button } from '@features/ui/button/button';
import { color, font, space } from '@styles/theme';
import React from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

const FormContainer = styled(Form.Root)`
  width: 100%;
  background-color: white;
  padding: ${space(4)};
  border-radius: 5px;
  margin: ${space(3)};
`;

const FormTitle = styled.h1`
  margin-bottom: ${space(2)};
`;

const FormField = styled(Form.Field)`
  display: flex;
  flex-direction: column;
`;

const FormInput = styled(Form.Control)`
  border: solid 1px #d0d0d0;
  border-radius: 5px;
  padding: ${space(2)};
  margin-bottom: ${space(2)};
  &::placeholder {
    color: #d0d0d0;
  }
`;

const SupportText = styled.div`
  margin-bottom: ${space(3)};

  & > * {
    color: ${color('gray', 100)};
    ${font('sm', 'regular')};
  }
`;

const Signup = styled.div`
  margin-top: ${space(6)};

  & > * {
    color: ${color('gray', 100)};
  }
`;

export function LogInForm() {
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = React.useState('');
  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/',
        shouldCreateUser: false,
      },
    });

    if (error) {
      console.log('Error: LoginForm', {
        message: error.message,
        details: error.cause,
      });
    }

    return data;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Log In</FormTitle>
      <FormField name="log in">
        <Form.Label>Your email address</Form.Label>
        <Form.Message match="valueMissing">
          Please enter your email
        </Form.Message>
        <Form.Message match="typeMismatch">
          Please provide a valid email
        </Form.Message>
        <FormInput asChild>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormInput>
      </FormField>
      <SupportText>
        <p>
          We’ll send you an email with a magic link that will log you in. No
          need for a password!
        </p>
      </SupportText>
      <Form.Submit asChild>
        <Button color="primary" shade={300} size="md">
          Email Link
        </Button>
      </Form.Submit>
      <Signup>
        <p>
          Don&#39;t have an account? <Link href="/signup">Sign up</Link> now.
        </p>
      </Signup>
    </FormContainer>
  );
}
