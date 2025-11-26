import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  reason: z.enum(['general', 'support']),
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
  acceptNoLegalAdvice: z.literal(true),
});

async function sendMail(opts: { to: string; subject: string; text: string; replyTo: string }) {
  /**
   * TODO: branche ici ton provider e-mail
   * Exemple Resend:
   *   const resend = new Resend(process.env.RESEND_API_KEY);
   *   await resend.emails.send({ from:"contact@jemedefends.fr", ...opts })
   */
  console.log('sendMail stub', opts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const to = data.reason === 'support' ? 'support@jemedefends.fr' : 'contact@jemedefends.fr';

    const subjectPrefix = data.reason === 'support' ? '[SUPPORT]' : '[CONTACT]';
    const subject = `${subjectPrefix} ${data.subject}`;

    const text = `
Nouveau message via formulaire

Type: ${data.reason}
Nom: ${data.name}
Email: ${data.email}

Sujet: ${data.subject}

Message:
${data.message}
`.trim();

    await sendMail({
      to,
      subject,
      text,
      replyTo: data.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: err.flatten() },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: err?.message ?? 'Erreur serveur' }, { status: 500 });
  }
}
