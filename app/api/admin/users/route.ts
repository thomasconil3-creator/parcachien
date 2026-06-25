import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

const ADMIN_EMAILS = ['ceo@velox-ia.com', 'thomasconil3@gmail.com', 'ceo@parcachien.com'];

export async function GET() {
  // Vérifier que le demandeur est admin
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  // Client admin avec service_role (accès à auth.users)
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  let users = [];
  const { data, error } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

  if (error) {
    console.error("Supabase listUsers failed, falling back to profiles table:", error);
    // Fallback to public.profiles table
    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('id, email, created_at, first_name, last_name, username, dob, postal_code')
      .order('created_at', { ascending: false });

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    users = (profiles || []).map(p => ({
      id: p.id,
      email: p.email,
      created_at: p.created_at,
      last_sign_in_at: null,
      email_confirmed: false,
      first_name: p.first_name || '',
      last_name: p.last_name || '',
      username: p.username || '',
      dob: p.dob || '',
      postal_code: p.postal_code || '',
    }));
  } else {
    users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      email_confirmed: !!u.email_confirmed_at,
      first_name: u.raw_user_meta_data?.first_name || '',
      last_name: u.raw_user_meta_data?.last_name || '',
      username: u.raw_user_meta_data?.username || '',
      dob: u.raw_user_meta_data?.dob || '',
      postal_code: u.raw_user_meta_data?.postal_code || '',
    }));
  }

  return NextResponse.json({ users });


}
