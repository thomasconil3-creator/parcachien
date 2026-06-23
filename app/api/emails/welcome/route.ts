import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// À configurer dans le tableau de bord Vercel / .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'ParcAChien <bonjour@parcachien.com>',
      to: [email],
      subject: '🐾 Bienvenue dans la meute ParcAChien !',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Salut ${firstName || ''} ! 👋</h2>
          <p>Bienvenue sur ParcAChien. Ton inscription est validée !</p>
          <p>Tu peux dès maintenant :</p>
          <ul>
            <li>Ajouter ton chien sur ton profil</li>
            <li>Faire des check-ins dans les parcs de ta ville</li>
            <li>Rechercher tes amis via leur pseudo</li>
            <li>Découvrir les professionnels partenaires (Vétérinaires, Boutiques) sur la carte</li>
          </ul>
          <p>À très vite sur l'application,</p>
          <p><strong>L'équipe ParcAChien</strong></p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
