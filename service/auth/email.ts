import { Resend } from 'resend';
import { ServerError } from '../errors';

/**
 * Server actions:
 * 
 * sendVerificationEmail({ email, name, token })
 *  returns: message_id
 *  errors: ServerError
 * 
 * sendPasswordResetEmail({ email, name, token })
 *  returns: message_id
 *  errors: ServerError
 */

export async function sendVerificationEmail({ email, name, token }: {
  email: string;
  name: string;
  token: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const verificationUrl = `${appUrl}/verify-email?token=${token}`;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = process.env.RESEND_FROM_NAME || 'BuscarEntrenador.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verificá tu correo electrónico</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4f46e5; margin-bottom: 20px;">¡Bienvenido a BuscarEntrenador.com!</h1>
        
        <p>Hola ${name},</p>
        
        <p>Gracias por registrarte en BuscarEntrenador.com. Para completar tu registro, necesitamos que verifiques tu correo electrónico.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verificar mi correo
          </a>
        </div>
        
        <p>Si el botón no funciona, copiá y pegá el enlace de arriba en tu navegador:</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Este enlace expirará en 24 horas. Si no solicitaste esta verificación, podés ignorar este correo.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          BuscarEntrenador.com - Tu plataforma para encontrar entrenadores matematicos
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hola ${name},

Gracias por registrarte en BuscarEntrenador.com. Para completar tu registro, necesitamos que verifiques tu correo electrónico.

Hacé clic en el siguiente enlace para verificar tu correo:
${verificationUrl}

Este enlace expirará en 24 horas. Si no solicitaste esta verificación, podés ignorar este correo.

BuscarEntrenador.com - Tu plataforma para encontrar entrenadores matematicos
  `;

  const { error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: 'Verificá tu correo electrónico - BuscarEntrenador.com',
    text: textContent,
    html: htmlContent,
  });

  if (error) {
    throw new ServerError('Failed to send verification email');
  }

  return;
}

export async function sendPasswordResetEmail({ email, name, token }: {
  email: string;
  name: string;
  token: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const fromName = process.env.RESEND_FROM_NAME || 'BuscarEntrenador.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resetear tu contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h1 style="color: #4f46e5; margin-bottom: 20px;">Resetear tu contraseña</h1>
        
        <p>Hola ${name},</p>
        
        <p>Recibimos una solicitud para resetear la contraseña de tu cuenta en BuscarEntrenador.com.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Resetear mi contraseña
          </a>
        </div>
        
        <p>Si el botón no funciona, copiá y pegá el enlace de arriba en tu navegador:</p>
        <p style="word-break: break-all; color: #4f46e5;">${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Este enlace expirará en 1 hora por motivos de seguridad. Si no solicitaste resetear tu contraseña, podés ignorar este correo de forma segura.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          BuscarEntrenador.com - Tu plataforma para encontrar entrenadores matematicos
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hola ${name},

Recibimos una solicitud para resetear la contraseña de tu cuenta en BuscarEntrenador.com.

Hacé clic en el siguiente enlace para resetear tu contraseña:
${resetUrl}

Este enlace expirará en 1 hora por motivos de seguridad. Si no solicitaste resetear tu contraseña, podés ignorar este correo de forma segura.

BuscarEntrenador.com - Tu plataforma para encontrar entrenadores matematicos
  `;

  const { error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: email,
    subject: 'Resetear tu contraseña - BuscarEntrenador.com',
    text: textContent,
    html: htmlContent,
  });

  if (error) {
    throw new ServerError('Failed to send password reset email');
  }

  return;
}
