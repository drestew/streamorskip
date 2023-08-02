import * as Form from '@radix-ui/react-form';
import styled from 'styled-components';
import { Button } from '@components/Button/Button';
import { color, space } from '@styles/theme';
import React from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { supabaseClient } from '@utils/supabase-client';

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

const ValidationError = styled(Form.Message)`
  color: ${color('error', 300)};
`;

export function SignupForm() {
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = React.useState('');
  const [signupComplete, setSignupComplete] = React.useState(false);
  const [duplicateEmail, setDuplicateEmail] = React.useState(false);

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const { data, error } = await supabaseClient
      .from('profile')
      .select('email')
      .eq('email', email)
      .limit(1)
      .single();

    if (error) {
      console.log('Error: Duplicate email', {
        message: error.message,
      });
    }

    if (data) {
      setDuplicateEmail(true);
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'http://localhost:3000/api/auth/callback',
        },
      });

      setSignupComplete(true);

      if (error) {
        console.log('Error: OTP Signup', {
          message: error.message,
          details: error.cause,
        });
      }
    }
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
            <ValidationError match="valueMissing" data-cy="validationError">
              Please enter your email
            </ValidationError>
            <ValidationError match="typeMismatch" data-cy="validationError">
              Please provide a valid email
            </ValidationError>
            <ValidationError
              match={() => duplicateEmail}
              forceMatch={duplicateEmail}
              data-cy="validationError"
            >
              This email is not available.
            </ValidationError>
            <FormInput
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>
          <Form.Submit asChild>
            <Button color="primary" shade={300} size="md" data-cy="submit">
              Sign up
            </Button>
          </Form.Submit>
          <LogIn>
            <p>
              Have an account already?{' '}
              <Link href="/login" data-cy="loginLink">
                Log in
              </Link>{' '}
              instead.
            </p>
          </LogIn>
        </>
      )}
    </FormContainer>
  );
}
