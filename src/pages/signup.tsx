import { SignupForm } from '@features/auth/components/signup-form/signup-form';
import { supabaseClient } from '@utils/supabase-client';
export default function Signup() {
  async function signupUser() {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: 'sgedelson@gmail.com',
      options: {
        emailRedirectTo: 'http://localhost:3000/',
      },
    });

    return data;
  }

  return (
    <>
      <SignupForm signupUser={signupUser} />
    </>
  );
}
