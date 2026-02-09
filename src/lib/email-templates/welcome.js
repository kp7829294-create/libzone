function getFirstName(fullName) {
  const name = (fullName || "").trim();
  if (!name) return "Reader";
  const first = name.split(/\s+/)[0];
  return first || name || "Reader";
}

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "http://localhost:3000"
  );
}

export function getWelcomeEmailHtml(userName = "Reader") {
  const firstName = getFirstName(userName);
  const appUrl = getAppUrl();
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Libzone</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: 600px) {
      .mobile-padding { padding: 24px 16px !important; }
      .mobile-text { font-size: 24px !important; }
      .mobile-subtext { font-size: 15px !important; }
      .mobile-hero { min-height: 140px !important; padding: 32px 20px !important; }
      .mobile-feature-padding { padding: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #e0f2fe 0%, #f1f5f9 40%, #f8fafc 100%); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px; padding-top: 48px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px;">
          <!-- Header badge -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 14px 28px; border-radius: 20px; box-shadow: 0 12px 40px rgba(37, 99, 235, 0.35);">
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Libzone</span><br>
                    <span style="font-size: 9px; color: rgba(255,255,255,0.95); letter-spacing: 2.5px; text-transform: uppercase;">Read · Learn · Succeed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Main card -->
          <tr>
            <td style="background: #ffffff; border-radius: 28px; box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04); overflow: hidden;">
              <!-- Decorative gradient bar -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background: linear-gradient(90deg, #2563eb 0%, #4f46e5 25%, #7c3aed 50%, #4f46e5 75%, #2563eb 100%); height: 8px;"></td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mobile-padding" style="padding: 44px 40px;">
                <!-- Celebration emoji & headline -->
                <tr>
                  <td align="center" style="padding-bottom: 8px;">
                    <span style="font-size: 56px; line-height: 1;">🎉</span>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1.2;" class="mobile-text">
                      Welcome to Libzone, ${firstName}!
                    </h1>
                    <p style="margin: 0 0 36px 0; font-size: 17px; line-height: 1.65; color: #64748b; max-width: 420px; margin-left: auto; margin-right: auto;" class="mobile-subtext">
                      Your account is all set. You're now part of a community that loves reading and learning.
                    </p>
                  </td>
                </tr>
                <!-- Feature cards -->
                <tr>
                  <td>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="50%" valign="top" class="mobile-feature-padding" style="padding: 0 8px 16px 0;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border-radius: 20px; padding: 24px; border: 1px solid rgba(99, 102, 241, 0.15);">
                            <tr>
                              <td align="center">
                                <span style="font-size: 32px; display: block; margin-bottom: 12px;">📚</span>
                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e40af;">Browse books</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.4;">Explore our library</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" class="mobile-feature-padding" style="padding: 0 0 16px 8px;">
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 20px; padding: 24px; border: 1px solid rgba(34, 197, 94, 0.2);">
                            <tr>
                              <td align="center">
                                <span style="font-size: 32px; display: block; margin-bottom: 12px;">✨</span>
                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #15803d;">Borrow & return</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.4;">Simple and fast</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- CTA -->
                <tr>
                  <td align="center" style="padding-top: 24px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                      <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); border-radius: 16px; box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);">
                          <a href="${appUrl}/student" target="_blank" rel="noopener" style="display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.3px;">
                            Start exploring →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer note -->
                <tr>
                  <td style="padding-top: 36px; border-top: 1px solid #e2e8f0; margin-top: 32px;">
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5;">
                      Need help? Reply to this email anytime.
                    </p>
                    <p style="margin: 16px 0 0 0; font-size: 12px; color: #cbd5e1; text-align: center;">
                      © ${new Date().getFullYear()} Libzone · The future of campus libraries
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Bottom tagline -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8; font-weight: 500;">
                Trusted by 150+ institutions worldwide
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function getWelcomeEmailText(userName = "Reader") {
  const firstName = getFirstName(userName);
  const appUrl = getAppUrl();
  return `Welcome to Libzone, ${firstName}!

Your account is all set. You're now part of a community that loves reading and learning.

What you can do:
• Browse our library of books
• Borrow and return books easily
• Track your reading journey

Get started: ${appUrl}/student

Need help? Just reply to this email.

© ${new Date().getFullYear()} Libzone - The future of campus libraries`;
}
