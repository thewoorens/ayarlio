const baseUrl = process.env.APP_URL || "http://localhost:3000";
const logoUrl = `${baseUrl}/ayarlio-logo.png`;

const baseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #f9fafb;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    .content-table {
      width: 100%;
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    .header {
      padding: 40px 0 30px 0;
      text-align: center;
    }
    
    .body-content {
      padding: 0 40px 40px 40px;
    }
    
    h1 {
      color: #111827;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      margin: 0 0 16px 0;
      text-align: center;
    }
    
    p {
      color: #4b5563;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    
    .btn-container {
      text-align: center;
      padding: 10px 0 30px 0;
    }
    
    .btn {
      background-color: #000000;
      border-radius: 8px;
      color: #ffffff !important;
      display: inline-block;
      font-size: 16px;
      font-weight: 600;
      line-height: 50px;
      text-align: center;
      text-decoration: none;
      width: 240px;
      -webkit-text-size-adjust: none;
    }
    
    .footer {
      padding: 0 40px 40px 40px;
      text-align: center;
    }
    
    .footer-text {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .divider {
      border-top: 1px solid #e5e7eb;
      margin: 30px 0;
    }
    
    .detail-card {
      background-color: #f3f4f6;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    
    .detail-item {
      margin-bottom: 12px;
    }
    
    .detail-label {
      color: #6b7280;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    
    .detail-value {
      color: #111827;
      font-size: 16px;
      font-weight: 500;
    }
    
    .code-box {
      background-color: #000000;
      color: #ffffff;
      display: inline-block;
      padding: 8px 16px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center">
        <table class="content-table" role="presentation" cellspacing="0" cellpadding="0" border="0">
          <!-- Logo -->
          <tr>
            <td class="header">
              <img src="${logoUrl}" alt="Ayarlio" width="140" style="display: block; margin: 0 auto;">
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="body-content">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <div class="divider"></div>
              <p class="footer-text">
                &copy; ${new Date().getFullYear()} Ayarlio. Tüm hakları saklıdır.<br>
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
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

export const verifyEmailTemplate = (verifyUrl: string) => baseTemplate(`
  <h1>E-posta Adresinizi Doğrulayın</h1>
  <p>Ayarlio'ya hoş geldiniz! İşletmenizi büyütmeye başlamak için tek bir adım kaldı. Aşağıdaki butona tıklayarak e-posta adresinizi doğrulayabilirsiniz.</p>
  
  <div class="btn-container">
    <a href="${verifyUrl}" class="btn">E-postayı Doğrula</a>
  </div>
  
  <p style="font-size: 14px; color: #6b7280; text-align: center;">Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı güvenle silebilirsiniz.</p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e5e7eb;">
    <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin-bottom: 0;">
      Buton çalışmıyorsa bu bağlantıyı tarayıcınıza kopyalayın:<br>
      <a href="${verifyUrl}" style="color: #3b82f6; text-decoration: underline;">${verifyUrl}</a>
    </p>
  </div>
`, "E-posta Doğrulama");

export const resetPasswordTemplate = (resetUrl: string) => baseTemplate(`
  <h1>Parolanızı Sıfırlayın</h1>
  <p>Ayarlio hesabınız için bir parola sıfırlama talebi aldık. Yeni parolanızı belirlemek için aşağıdaki butona tıklayın.</p>
  
  <div class="btn-container">
    <a href="${resetUrl}" class="btn">Parolayı Sıfırla</a>
  </div>
  
  <p style="font-size: 14px; color: #6b7280; text-align: center;">Bu işlemi siz talep etmediyseniz, başkası e-posta adresinizi yanlışlıkla girmiş olabilir. Parolanız siz yeni bir tane belirleyene kadar güvendedir.</p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e5e7eb;">
    <p style="font-size: 12px; color: #9ca3af; word-break: break-all; margin-bottom: 0;">
      Buton çalışmıyorsa bu bağlantıyı tarayıcınıza kopyalayın:<br>
      <a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline;">${resetUrl}</a>
    </p>
  </div>
`, "Parola Sıfırlama");

export const appointmentConfirmationTemplate = (
  serviceName: string,
  staffName: string,
  startTime: Date,
  endTime: Date,
  code: string,
) => {
  const dateStr = startTime.toLocaleString("tr-TR", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = `${startTime.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}`;

  return baseTemplate(`
    <h1>Randevunuz Onaylandı!</h1>
    <p>Harika haber! Randevunuz başarıyla oluşturuldu ve onaylandı. Detayları aşağıda bulabilirsiniz:</p>
    
    <div class="detail-card">
      <div class="detail-item">
        <div class="detail-label">Hizmet</div>
        <div class="detail-value">${serviceName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Personel</div>
        <div class="detail-value">${staffName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Tarih</div>
        <div class="detail-value">${dateStr}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Saat</div>
        <div class="detail-value">${timeStr}</div>
      </div>
      <div style="margin-top: 20px;">
        <div class="detail-label">Randevu Kodu</div>
        <div class="code-box">${code}</div>
      </div>
    </div>
    
    <p style="margin-bottom: 0;">Randevunuza zamanında gelmenizi rica ederiz. Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>
  `, "Randevu Onayı");
};

export const deleteAccountOTPTemplate = (otp: string) => baseTemplate(`
  <h1 style="color: #e11d48;">Hesap Silme Doğrulaması</h1>
  <p>Hesabınızı silmek için bir talepte bulundunuz. Bu işlemi tamamlamak için aşağıdaki doğrulama kodunu kullanın. <strong>Dikkat: Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.</strong></p>
  
  <div class="btn-container">
    <div class="code-box" style="background-color: #e11d48; color: #ffffff; padding: 15px 25px; border-radius: 8px; font-size: 24px; letter-spacing: 5px;">${otp}</div>
  </div>
  
  <p style="font-size: 14px; color: #6b7280; text-align: center;">Bu işlemi siz talep etmediyseniz, lütfen hemen şifrenizi değiştirin ve bu e-postayı dikkate almayın.</p>
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e5e7eb;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">
      Doğrulama kodu 10 dakika boyunca geçerlidir.
    </p>
  </div>
`, "Hesap Silme Doğrulaması");


