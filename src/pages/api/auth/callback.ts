import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@src/types/supabase';

async function addProfile(supabaseClient: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const { error } = await supabaseClient
    .from('profile')
    .insert({ id: user.id, email: user.email });

  if (error) {
    console.error('Error adding user profile:', {
      message: error.message,
      details: error.details,
    });
  }
}

const handler: NextApiHandler = async (req, res) => {
  const { code } = req.query;

  if (code) {
    const supabaseClient = createPagesServerClient({ req, res });
    await supabaseClient.auth.exchangeCodeForSession(String(code));
    await addProfile(supabaseClient);
  }

  res.redirect('/');
};

export default handler;
