export function verifyEmailTemplate(
  firstName: string,
  otp: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Hello ${firstName},</h2>

        <p>Welcome to <strong>Reality Capital Bank</strong>.</p>

        <p>Your email verification code is:</p>

        <h1
          style="
            letter-spacing:6px;
            color:#0d6efd;
          "
        >
          ${otp}
        </h1>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          If you didn't create this account,
          you can safely ignore this email.
        </p>

        <hr>

        <small>
          Reality Capital Bank
        </small>
      </body>
    </html>
  `;
}