import { NextApiHandler } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { SupabaseClient } from '@supabase/supabase-js';

async function addProfile(supabaseClient: SupabaseClient) {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  const { error } = await supabaseClient
    .from('profile')
    .insert({ id: user?.id });

  if (error) {
    console.log('Error:', {
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
