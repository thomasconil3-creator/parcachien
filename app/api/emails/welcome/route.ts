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
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAF8F5; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #E2DDD5;">
          <!-- Header -->
          <div style="background-color: #F59500; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px;">🐾 ParcAChien</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background-color: white;">
            <h2 style="color: #242019; margin-top: 0; font-size: 22px;">Salut ${firstName || "l'ami"} ! 👋</h2>
            <p style="color: #4A443A; font-size: 16px; line-height: 1.6;">
              Bienvenue sur ParcAChien. Ton inscription est officiellement validée ! Nous sommes ravis de t'accueillir dans la plus grande meute de PACA.
            </p>
            
            <div style="background-color: #FFF8ED; border-left: 4px solid #F59500; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
              <p style="margin-top: 0; color: #242019; font-weight: bold;">Voici ce que tu peux faire dès maintenant :</p>
              <ul style="color: #4A443A; line-height: 1.8; margin-bottom: 0; padding-left: 20px;">
                <li>Créer le <strong>profil de ton chien</strong></li>
                <li>Faire des <strong>check-ins</strong> dans les parcs</li>
                <li>Trouver tes amis vétérinaires et boutiques sur la <strong>carte B2B</strong></li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://parcachien.com" style="background-color: #F59500; color: white; padding: 14px 32px; text-decoration: none; font-weight: bold; border-radius: 50px; font-size: 16px; display: inline-block;">
                Explorer la carte
              </a>
            </div>
            
            <p style="color: #4A443A; font-size: 16px;">À très vite sur l'application,<br><strong>L'équipe ParcAChien</strong></p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #242019; padding: 20px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              Une application conçue avec ❤️ par <strong>Velox IA</strong>
            </p>
            <p style="color: #6B7280; font-size: 11px; margin-top: 5px;">
              Marseille, France • Agence Digitale & Intelligence Artificielle
            </p>
          </div>
        </div>
      `,
    });

    // Envoi de la notification à l'administrateur
    await resend.emails.send({
      from: 'ParcAChien Admin <bonjour@parcachien.com>',
      to: ['ceo@velox-ia.com'],
      subject: '🚀 Nouvel utilisateur inscrit sur ParcAChien !',
      html: `
        <div style="font-family: sans-serif;">
          <h2>Nouvelle inscription 🎉</h2>
          <p>Un nouvel utilisateur vient de s'inscrire sur ParcAChien.</p>
          <ul>
            <li><strong>Prénom :</strong> ${firstName || 'Non renseigné'}</li>
            <li><strong>Email :</strong> ${email}</li>
          </ul>
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
