import * as Form from '@radix-ui/react-form';
import styled from 'styled-components';
import { Button } from '@features/ui/button/button';
import { color, space } from '@styles/theme';

const FormContainer = styled(Form.Root)`
  max-width: 400px;
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
  return (
    <FormContainer>
      <FormTitle>Sign up</FormTitle>
      <FormField name="signup">
        <Form.Label>Your email address</Form.Label>
        <Form.Message match="valueMissing">
          Please enter your email
        </Form.Message>
        <Form.Message match="typeMismatch">
          Please provide a valid email
        </Form.Message>
        <FormInput asChild>
          <input type="email" required placeholder="you@example.com" />
        </FormInput>
      </FormField>
      <Form.Submit asChild>
        <Button color="primary" shade={300} size="md">
          Sign up
        </Button>
      </Form.Submit>
      <LogIn>
        <p>
          Have an account already? <a href="/login">Log in</a> instead.
        </p>
      </LogIn>
    </FormContainer>
  );
}
