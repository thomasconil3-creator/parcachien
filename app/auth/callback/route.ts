import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // si 'next' est dans les paramètres, on l'utilise pour rediriger après
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Échange réussi, on redirige l'utilisateur vers la page
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // S'il y a une erreur ou pas de code, on renvoie vers le login avec une erreur
  return NextResponse.redirect(`${origin}/login?error=Lien+invalide+ou+expire`)
}
