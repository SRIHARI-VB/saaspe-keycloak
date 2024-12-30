<#macro emailLayout>
<!DOCTYPE html>
<html style="background: #f3f3f3 !important">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet" />
    <style>
      @media only screen {
        html {
          min-height: 100%;
          background: #f3f3f3;
        }
      }
      @media only screen and (max-width: 596px) {
        .container {
          width: 95% !important;
        }
        .content-block {
          padding-left: 16px !important;
          padding-right: 16px !important;
          width: 100% !important;
        }
      }
    </style>
  </head>
  <body style="background: #f3f3f3 !important; margin: 0; padding: 0; min-width: 100%; font-family: Poppins, sans-serif; font-size: 16px; line-height: 1.3; color: #0a0a0a; text-align: left;">
    <div class="body" style="width: 100%; margin: 0; padding: 0; background: #f3f3f3 !important;">
      <div class="center" style="width: 100%; background: #f3f3f3;">
        <div style="max-width: 450px; margin: 0 auto; padding: 24px 0;"> 
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="https://saaspemedia.blob.core.windows.net/images/branding/saaspe-logo.png?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2033-12-31T17:33:24Z&st=2023-06-15T09:33:24Z&spr=https&sig=aBbw0Ic58peTtd%2B6rK8uB%2BbE%2FAj7BKtC4KqaVR2sKdo%3D"
                 alt="saase logo"
                 style="max-width: 200px; height: auto;" />
          </div>
          <div style="padding: 24px; background-color: white; border-radius: 8px">
            <div style="text-align: center;">
              <img src="https://saaspemedia.blob.core.windows.net/images/branding/misc/email-notification.png?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2033-12-31T17:33:24Z&st=2023-06-15T09:33:24Z&spr=https&sig=aBbw0Ic58peTtd%2B6rK8uB%2BbE%2FAj7BKtC4KqaVR2sKdo%3D" 
                alt="mail-logo"
                style="max-width: 200px; height: auto;"/>
            </div>
            <#nested>
          </div>
          <!-- Footer -->
          <div style="text-align: center; padding: 24px 16px;">
            <p style="color: #7b7a8c; margin: 0 0 10px 0;">
              &copy; 2022 SaasPe. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
</#macro>