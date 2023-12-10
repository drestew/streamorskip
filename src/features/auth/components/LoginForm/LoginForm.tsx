import * as Form from '@radix-ui/react-form';
import styled from 'styled-components';
import { Button } from '@components/Button/Button';
import { color, font, space } from '@styles/theme';
import React from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { supabaseClient } from '@utils/supabase-client';

type Input = {
  handleMobileKeyboard: (inputFocused: boolean) => void;
};

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

const ValidationError = styled(Form.Message)`
  color: ${color('error', 300)};
`;

export function LogInForm({ handleMobileKeyboard }: Input) {
  const supabase = createPagesBrowserClient();
  const [email, setEmail] = React.useState('');
  const [sendEmail, setSendEmail] = React.useState(false);
  const [noEmail, setNoEmail] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const input: HTMLInputElement = ref.current;

    function inputFocused() {
      document.activeElement === input
        ? handleMobileKeyboard(true)
        : handleMobileKeyboard(false);
    }

    window.addEventListener('click', inputFocused);

    return () => {
      window.removeEventListener('click', inputFocused);
    };
  }, [handleMobileKeyboard]);

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const { data, error } = await supabaseClient
      .from('profile')
      .select('email')
      .eq('email', email)
      .limit(1)
      .single();

    if (error) {
      console.log("Error: Email doesn't exist", {
        message: error.message,
      });
    }

    if (!data) {
      setNoEmail(true);
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'https://streamorskip.com',
          shouldCreateUser: false,
        },
      });

      setSendEmail(true);

      if (error) {
        console.log('Error: LoginForm', {
          message: error.message,
          details: error.cause,
        });
      }
    }
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>Log In</FormTitle>
      {sendEmail ? (
        <div data-cy="emailSent">
          <p>
            <strong>Email sent!</strong> Check your email at <i>{email}</i>; you
            should have your login link in a few seconds!
          </p>
        </div>
      ) : (
        <>
          <FormField name="log in">
            <Form.Label>Your email address</Form.Label>
            <ValidationError match="valueMissing" data-cy="validationError">
              Please enter your email
            </ValidationError>
            <ValidationError match="typeMismatch" data-cy="validationError">
              Please provide a valid email
            </ValidationError>
            <ValidationError
              match={() => noEmail}
              forceMatch={noEmail}
              data-cy="validationError"
            >
              This email doesn&#39;t exist
            </ValidationError>
            <FormInput
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              ref={ref}
              onFocus={() => noEmail && setNoEmail(false)}
            />
          </FormField>
          <SupportText>
            <p>
              We’ll send you an email with a magic link that will log you in. No
              need for a password!
            </p>
          </SupportText>
          <Form.Submit asChild>
            <Button color="primary" shade={300} size="md" data-cy="submit">
              Email Link
            </Button>
          </Form.Submit>
          <Signup>
            <p>
              Don&#39;t have an account?{' '}
              <Link href="/signup" data-cy="signupLink">
                Sign up
              </Link>{' '}
              now.
            </p>
          </Signup>
        </>
      )}
    </FormContainer>
  );
}
