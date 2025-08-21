
export const template = (code , firstName , subject ) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">
    <tr>
      <td style="text-align: center;">
        <h2 style="color: #372b3eff;">Hello ${firstName},</h2>
        <p style="color: #494572ff;">Here is your verification code:</p>
        <div style="font-size: 26px; font-weight: bold; color: #000000; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #555555; font-size: 14px;">Please enter this code to confirm your email.</p>
      </td>
    </tr>
  </table>
</body>
</html>
` 
