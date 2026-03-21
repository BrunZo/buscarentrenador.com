import { readFile } from 'fs/promises';
import path from 'path';
import { Resend } from 'resend';
import { ServerError } from '../errors';

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new ServerError(`Missing required environment variable: ${key}`);
  return value;
}

async function loadTemplate(name: string, vars: Record<string, string>): Promise<{ html: string; text: string }> {
  const dir = path.join(process.cwd(), 'service/templates');
  const [html, text] = await Promise.all([
    readFile(path.join(dir, `${name}.html`), 'utf-8'),
    readFile(path.join(dir, `${name}.txt`), 'utf-8'),
  ]);

  const interpolate = (s: string) =>
    s.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '');

  return { html: interpolate(html), text: interpolate(text) };
}

async function sendEmail(to: string, subject: string, templateName: string, vars: Record<string, string>) {
  const resend = new Resend(getEnv('RESEND_API_KEY'));
  const from = `${getEnv('RESEND_FROM_NAME')} <${getEnv('RESEND_FROM_EMAIL')}>`;
  const { html, text } = await loadTemplate(templateName, vars);

  const { error } = await resend.emails.send({ from, to, subject, html, text });
  if (error) throw new ServerError(`Failed to send email: ${subject}`);
}

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<void> {
  const url = `${getEnv('NEXT_PUBLIC_APP_URL')}/verify-email?token=${token}`;
  await sendEmail(email, 'Verificá tu correo electrónico - BuscarEntrenador.com', 'verify-email', { name, url });
}

export async function sendPasswordResetEmail({ email, name, token }: {
  email: string;
  name: string;
  token: string;
}): Promise<void> {
  const url = `${getEnv('NEXT_PUBLIC_APP_URL')}/reset-password?token=${token}`;
  await sendEmail(email, 'Resetear tu contraseña - BuscarEntrenador.com', 'reset-password', { name, url });
}
