import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys
import json

weburl = 'http://noviercas.glitch.me'

def send_verification(user,data):
    # Configuración
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    email_usuario = "base.noviercas@gmail.com"
    email_password = "qzzv wvbv smfo ggmf"

    # Crear el mensaje
    mensaje = MIMEMultipart()
    mensaje["Subject"] = "Verifica tu usuario"
    mensaje["From"] = email_usuario
    mensaje["To"] = user

    html = '''\
    <style>
      :root {
        --shadow: rgba(0, 0, 0, 0.2) 0px 4px 12px;
        --hidden-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px;
      }
      /* latin-ext */
      @font-face {
        font-family: 'Scope One';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/scopeone/v14/WBLnrEXKYFlGHrOKmGDFUkXNFME.woff2) format('woff2');
        unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
      }
      /* latin */
      @font-face {
        font-family: 'Scope One';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(https://fonts.gstatic.com/s/scopeone/v14/WBLnrEXKYFlGHrOKmGDFXEXN.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      * {
        font-family:'Scope One'
      }
        div#body {
        }
      </style>
      <meta charset="utf-8">
      <html>
      <body style="display:flex;vertical-align: center;align-items: center;align-content: center;text-align: center;">
        <div id='body' style="border: solid darkcyan 2px;border-radius: 10px;padding: 10px;display: inline-block;margin: auto;box-shadow: var(--shadow);">
          <h1 style="color:darkcyan;font-family:arial;">¡Buenos días!</h1>
          <p style="font-family:arial;color:black;">Según lo que indican nuestros registros, usted ha intentado iniciar sesión en nuestra web. Si es así, puede entrar diréctamente por el siguiente enlace.</p>
          <a style="color:darkcyan;font-family:arial;" href="'''+str(weburl)+'''/account#'''+data+'''">Entrar como usuario</a><br>
          <span style="font-family:arial;color:gray">Atención, el enlace dejará de ser válido a los 5 minutos para garantizar una experiencia segura para tod@s.</span>
        </div>
      </body>
      </html>
      '''

    mensaje.attach(MIMEText(f'''\
    {html}
    ''', "html"))

    # Enviar el correo
    try:
        servidor = smtplib.SMTP(smtp_server, smtp_port)
        servidor.starttls()
        servidor.login(email_usuario, email_password)
        servidor.sendmail(email_usuario, user, mensaje.as_string())
        servidor.quit()
        return "Correo enviado correctamente."
    except Exception as e:
        return f"Error al enviar el correo: {e}"


    # Contraseña de aplicación: qzzv wvbv smfo ggmf