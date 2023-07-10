import * as Form from '@radix-ui/react-form';
import styled from 'styled-components';
import { Button } from '@features/ui/button/button';
import { color, space } from '@styles/theme';
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
  margin-bottom: ${space(3)};
  &::placeholder {
    color: #d0d0d0;
  }
`;

const LogIn = styled.div`
  margin-top: ${space(6)};

  & > * {
    color: ${color('gray', 100)};
  }
`;

export function SignupForm() {
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = React.useState('');
  const [signupComplete, setSignupComplete] = React.useState(false);
  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/api/auth/callback',
      },
    });

    setSignupComplete(true);

    if (error) {
      console.log('Error: SignupForm', {
        message: error.message,
        details: error.cause,
      });
    }

    return data;
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Sign up</FormTitle>
      {signupComplete ? (
        <div>
          <p>
            <strong>Signup complete!</strong> Check your email at <i>{email}</i>{' '}
            for your login link.
          </p>
        </div>
      ) : (
        <>
          <FormField name="signup">
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
          <Form.Submit asChild>
            <Button color="primary" shade={300} size="md">
              Sign up
            </Button>
          </Form.Submit>
          <LogIn>
            <p>
              Have an account already? <Link href="/login">Log in</Link>{' '}
              instead.
            </p>
          </LogIn>
        </>
      )}
    </FormContainer>
  );
}
