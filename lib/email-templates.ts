export const verifyEmailTemplate = (verifyUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ayarlio E-posta Doğrulama</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      padding: 40px 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .btn-container {
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #333333;
    }
    .footer {
      text-align: center;
      padding: 24px 20px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }
    .link-fallback {
      font-size: 13px;
      color: #6b7280;
      word-break: break-all;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed #e5e7eb;
    }
    .link-fallback a {
      color: #3b82f6;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="logo">Ayarlio</a>
      </div>
      <div class="content">
        <h1>E-posta Adresinizi Doğrulayın</h1>
        <p>Ayarlio'ya hoş geldiniz! İşletme profilinizi oluşturmaya başlamadan önce e-posta adresinizi doğrulamamız gerekiyor.</p>
        
        <div class="btn-container">
          <a href="${verifyUrl}" class="btn">E-postamı Doğrula</a>
        </div>
        
        <p style="font-size: 14px; margin-bottom: 0;">Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı güvenle silebilirsiniz.</p>
        
        <div class="link-fallback">
          <p style="margin-bottom: 8px; font-size: 13px;">Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza kopyalayın:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Ayarlio. Tüm hakları saklıdır.
      </div>
    </div>
  </div>
</body>
</html>
`;

export const resetPasswordTemplate = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ayarlio Parola Sıfırlama</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      padding: 40px 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .btn-container {
      margin: 30px 0;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      border-radius: 8px;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #333333;
    }
    .footer {
      text-align: center;
      padding: 24px 20px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }
    .link-fallback {
      font-size: 13px;
      color: #6b7280;
      word-break: break-all;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px dashed #e5e7eb;
    }
    .link-fallback a {
      color: #3b82f6;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="logo">Ayarlio</a>
      </div>
      <div class="content">
        <h1>Parolanızı Sıfırlayın</h1>
        <p>Ayarlio hesabınız için parola sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni parolanızı belirleyebilirsiniz.</p>
        
        <div class="btn-container">
          <a href="${resetUrl}" class="btn">Parolayı Sıfırla</a>
        </div>
        
        <p style="font-size: 14px; margin-bottom: 0;">Bu işlemi siz talep etmediyseniz, e-postayı güvenle silebilirsiniz. Şifreniz siz yeni bir tane belirleyene kadar değişmeyecektir.</p>
        
        <div class="link-fallback">
          <p style="margin-bottom: 8px; font-size: 13px;">Buton çalışmıyorsa aşağıdaki bağlantıyı tarayıcınıza kopyalayın:</p>
          <a href="${resetUrl}">${resetUrl}</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Ayarlio. Tüm hakları saklıdır.
      </div>
    </div>
  </div>
</body>
</html>
`;

export const appointmentConfirmationTemplate = (
  serviceName: string,
  staffName: string,
  startTime: Date,
  endTime: Date,
  code: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ayarlio Randevu Onayı</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      padding: 40px 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
      overflow: hidden;
    }
    .header {
      text-align: center;
      padding: 30px 20px;
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 30px;
      line-height: 1.5;
    }
    .footer {
      text-align: center;
      padding: 24px 20px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      font-size: 13px;
      color: #64748b;
    }
    .code {
      display: inline-block;
      margin-top: 8px;
      padding: 8px 16px;
      background-color: #e5e7eb;
      color: #111827;
      font-size: 18px;
      font-weight: 600;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="#" class="logo">Ayarlio</a>
      </div>
      <div class="content">
        <h1>Randevunuz Onaylandı!</h1>
        <p>Merhaba, randevunuz başarıyla onaylandı. İşte randevu detaylarınız:</p>
        <p><strong>Hizmet:</strong> ${serviceName}</p>
        <p><strong>Personel:</strong> ${staffName}</p>
        <p><strong>Tarih & Saat:</strong> ${startTime.toLocaleString("tr-TR", { dateStyle: "long", timeStyle: "short" })} - ${endTime.toLocaleTimeString("tr-TR", { timeStyle: "short" })}</p>
        <p><strong>*Randevu Kodu:</strong><div class="code">${code}</div></p>
        <p>Lütfen randevunuza zamanında gelmeye özen gösterin. Herhangi bir değişiklik yapmanız gerekirse, lütfen bizimle iletişime geçin.</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Ayarlio. Tüm hakları saklıdır.
      </div>
    </div>
  </div>
</body>
</html>
`;
