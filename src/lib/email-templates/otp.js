function getFirstName(fullName) {
  const name = (fullName || "").trim();
  if (!name) return "there";
  const first = name.split(/\s+/)[0];
  return first || name || "there";
}

export function getOtpEmailHtml(otp, userName = "there") {
  const firstName = getFirstName(userName);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Libzone account</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #e0f2fe 0%, #f1f5f9 100%); min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 16px 24px; border-radius: 16px; box-shadow: 0 10px 40px rgba(37, 99, 235, 0.3);">
                    <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">Libzone</span><br>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.9); letter-spacing: 2px; text-transform: uppercase;">Read · Learn · Succeed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background: #ffffff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <!-- Decorative top bar -->
                <tr>
                  <td style="background: linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #2563eb 100%); height: 6px;"></td>
                </tr>
                <tr>
                  <td style="padding: 40px 36px;">
                    <!-- Icon -->
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 24px;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); width: 72px; height: 72px; border-radius: 20px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 36px;">📚</span>
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 800; color: #0f172a; text-align: center; letter-spacing: -0.5px;">
                      Verify your email
                    </h1>
                    <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748b; text-align: center;">
                      Hi ${firstName}! Thanks for joining Libzone. To finish setting up your account, enter the verification code below. We're excited to have you on board!
                    </p>
                    <!-- OTP Box -->
                    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin: 0 auto 32px auto;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 2px dashed #93c5fd; border-radius: 16px; padding: 28px 44px; box-shadow: inset 0 2px 8px rgba(59, 130, 246, 0.08);">
                          <span style="font-size: 38px; font-weight: 800; letter-spacing: 14px; color: #1e40af; font-family: 'Courier New', Courier, monospace;">
                            ${otp}
                          </span>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5;">
                      This code expires in <strong style="color: #64748b;">10 minutes</strong>.<br>
                      If you didn't request this, you can safely ignore this email.
                    </p>
                    <!-- Divider -->
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0 0 0;">
                      <tr>
                        <td style="border-top: 1px solid #e2e8f0;"></td>
                      </tr>
                    </table>
                    <p style="margin: 24px 0 0 0; font-size: 12px; color: #94a3b8; text-align: center;">
                      © 2024 Libzone · The future of campus libraries
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding-top: 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
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

export function getOtpEmailText(otp, userName = "there") {
  const firstName = getFirstName(userName);
  return `Hi ${firstName}!

Thanks for joining Libzone. Use this code to verify your email and complete your registration:

${otp}

This code expires in 10 minutes.

If you didn't request this, you can safely ignore this email.

© 2024 Libzone`;
}
