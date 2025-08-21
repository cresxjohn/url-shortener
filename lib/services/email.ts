import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
// Use Resend's sandbox sender by default (works without domain verification)
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

let resend: Resend | null = null;
if (RESEND_API_KEY) {
  resend = new Resend(RESEND_API_KEY);
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string
) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email send.');
    return;
  }

  try {
    const from = /</.test(EMAIL_FROM)
      ? EMAIL_FROM
      : `DV4 Links <${EMAIL_FROM}>`;

    const brandName = 'DV4 Links';
    const appUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || '';
    const html = buildPasswordResetEmailHtml({ brandName, appUrl, resetUrl });

    const { data, error } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: 'Reset your DV4 Links password',
      html,
      text: `Reset your DV4 Links password\n\nOpen this link to set a new password (expires in 1 hour):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
    });
    if (error) {
      console.error('Resend send error:', error);
      return;
    }
    console.info('Resend email sent (id):', data?.id);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
  }
}

function buildPasswordResetEmailHtml({
  brandName,
  appUrl,
  resetUrl,
}: {
  brandName: string;
  appUrl: string;
  resetUrl: string;
}) {
  const primary = '#4f46e5'; // indigo-600
  const accent = '#7c3aed'; // violet-600
  const text = '#111827'; // gray-900
  const muted = '#6b7280'; // gray-500
  const bg = '#f3f4f6'; // gray-100

  // Simple inline SVG logo (lightning) compatible with most clients
  const logoSvg = `<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${primary}"/><stop offset="100%" stop-color="${accent}"/></linearGradient></defs><rect rx="8" width="24" height="24" fill="url(#g)"/><path d="M13 3l-7 9h5l-1 9 7-10h-5l1-8z" fill="#fff"/></svg>`;

  return `
  <div style="background:${bg}; margin:0; padding:24px 0;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:600px;border-collapse:separate;border-spacing:0 0;">
      <tr>
        <td align="center" style="padding:0 24px 16px;">
          <table role="presentation" width="100%" style="max-width:600px;">
            <tr>
              <td align="left" style="font-family:Inter,Arial,sans-serif;color:${text};font-size:18px;font-weight:700;display:flex;align-items:center;gap:8px;">
                <span style="vertical-align:middle;display:inline-block;">${logoSvg}</span>
                <span style="vertical-align:middle;display:inline-block;">${brandName}</span>
              </td>
              <td align="right" style="font-family:Inter,Arial,sans-serif;font-size:12px;color:${muted};">
                <a href="${appUrl}" style="color:${muted}; text-decoration:none;">${appUrl.replace(/^https?:\/\//, '')}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding:0 24px;">
          <table role="presentation" width="100%" style="background:#ffffff;border-radius:12px;box-shadow:0 1px 3px rgba(17,24,39,0.08);">
            <tr>
              <td style="height:6px;background:linear-gradient(90deg, ${primary}, ${accent});border-top-left-radius:12px;border-top-right-radius:12px;"></td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px;font-family:Inter,Arial,sans-serif;color:${text};">
                <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;">Reset your ${brandName} password</h1>
                <p style="margin:0;color:${muted};font-size:14px;">We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 8px;">
                <a href="${resetUrl}" style="display:inline-block;background:${primary};color:#ffffff;font-family:Inter,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:12px 18px;border-radius:10px;">Reset password</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 0;font-family:Inter,Arial,sans-serif;color:${muted};font-size:12px;">
                <p style="margin:0 0 6px;">Or copy and paste this URL into your browser:</p>
                <p style="margin:0;word-break:break-all;"><a href="${resetUrl}" style="color:${primary};text-decoration:none;">${resetUrl}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px;font-family:Inter,Arial,sans-serif;color:${muted};font-size:12px;">
                <p style="margin:0;">If you did not request this, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:16px 24px 0;font-family:Inter,Arial,sans-serif;color:${muted};font-size:12px;">
          <p style="margin:0;">© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>`;
}
