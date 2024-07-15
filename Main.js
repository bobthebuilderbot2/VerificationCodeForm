function generateVerificationCode() {
  let code = '';
  for (let i = 0; i < 5; i++) {
    let digit = Math.floor(Math.random() * 10);
    if (i === 0 && digit === 0) {
      digit = Math.floor(Math.random() * 9) + 1;
    }
    code += digit;
  }
  return code.substring(0, 3) + '-' + code.substring(3, 5);
}

function sendEmail(email, subject, htmlBody) {
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody
  });
}

function onFormSubmit(e) {
  const responses = e.values;
  const email = responses[1];  
  const id = responses[2];  

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Credentials");
  const data = sheet.getDataRange().getValues();
  let isValid = false;

  // Check credentials
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email && data[i][1] === id) {  
      isValid = true;
      break;
    }
  }

  if (isValid) {
    const code = generateVerificationCode();
    const subject = "Your Email Verification Code";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <div style="background-color: #8CBF42; padding: 20px; color: white;">
          <h1>A·kis·met</h1>
        </div>
        <div style="padding: 20px;">
          <p>Your email verification code is:</p>
          <p style="font-size: 48px; font-weight: bold;">${code}</p>
          <p>If you did not request a code, you can ignore this email.</p>
          <p>The Akismet Team</p>
        </div>
      </div>
    `;
    sendEmail(email, subject, htmlBody);
  } else {
    const subject = "Invalid Credentials";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <div style="background-color: #FF0000; padding: 20px; color: white;">
          <h1>A·kis·met</h1>
        </div>
        <div style="padding: 20px;">
          <p>Your credentials are incorrect. Please try again.</p>
          <p style="font-size: 48px; font-weight: bold; color: #FF0000;">ERROR</p>
          <p>If you did not attempt to log in, you can ignore this email.</p>
          <p>The Akismet Team</p>
        </div>
      </div>
    `;
    sendEmail(email, subject, htmlBody);
  }
}
