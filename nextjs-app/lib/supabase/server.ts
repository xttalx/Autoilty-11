import { createServerComponentClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerComponentClient({ cookies: () => cookieStore });
}
