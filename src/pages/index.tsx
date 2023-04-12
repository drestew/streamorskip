import { CatalogList } from '@features/catalog';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <main>
      <p>Site Under Construction</p>
      {/*<CatalogList />*/}
      {/*<div*/}
      {/*  className="container"*/}
      {/*  style={{ padding: '50px 0 100px 0', width: '400px' }}*/}
      {/*>*/}
      {/*  {!session ? (*/}
      {/*    <Auth*/}
      {/*      supabaseClient={supabase}*/}
      {/*      appearance={{ theme: ThemeSupa }}*/}
      {/*      theme="dark"*/}
      {/*    />*/}
      {/*  ) : (*/}
      {/*    <Account session={session} />*/}
      {/*  )}*/}
      {/*</div>*/}
    </main>
  );
}
