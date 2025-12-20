import nodemailer from 'nodemailer';

// Create transporter with SMTP configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface SendVerificationEmailParams {
    email: string;
    name: string;
    token: string;
}

export async function sendVerificationEmail({ email, name, token }: SendVerificationEmailParams) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verificationUrl = `${appUrl}/verify-email?token=${token}`;

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

    try {
        await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'BuscarEntrenador.com'}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Verificá tu correo electrónico - BuscarEntrenador.com',
            text: textContent,
            html: htmlContent,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error };
    }
}
