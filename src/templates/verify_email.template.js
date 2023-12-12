require("dotenv").config();

require("dotenv").config();

const logoUrl =
  "https://openseauserdata.com/files/e06001f351f2ae5c3927d5d730346e87.jpg";

const emailTemplate = (vendorEmail, vendorName, token, uid) => {
  const verificationLink = `http://localhost:3000/vendor/auth/verify-email/${uid}/${token}`;

  const subject = "Handicraft Sri Lanka - Email Verification";

  const text = `Dear ${vendorName},

Thank you for signing up with Handicraft Sri Lanka. Please verify your email address by clicking on the following link:

${verificationLink}

If you did not sign up for Handicraft Sri Lanka, please ignore this email.

Best regards,
Handicraft Sri Lanka Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Handicraft Sri Lanka - Email Verification</title>
</head>
<body>
  <div style="text-align: center;">
    <img src="${logoUrl}" alt="Handicraft Sri Lanka Logo" style="max-width: 200px; margin-bottom: 20px;">
    <p>Dear User,</p>
    <p>Thank you for signing up with Handicraft Sri Lanka. Please verify your email address by clicking on the following button:</p>
    <a href="${verificationLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; border-radius: 4px;">Verify Email</a>
    <p style="margin-top: 20px;">If you did not sign up for Handicraft Sri Lanka, please ignore this email.</p>
    <p>Best regards,<br>Handicraft Sri Lanka Team</p>
  </div>
</body>
</html>
`;

  return {
    from: process.env.HOST_EMAIL,
    to: vendorEmail,
    subject: subject,
    text: text,
    html: html,
  };
};

module.exports = { emailTemplate: emailTemplate };
