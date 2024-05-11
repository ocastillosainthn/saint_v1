import { defineEventHandler } from 'h3';
import { Resend } from 'resend';


const resend = new Resend('re_FwE4ggNV_KpkiU5voiKw9LJGkzMJutojr');

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { invitationCode, email } = body;

  const emailHtml = `
    <div>
      <div style="background-color:#F2F2F2; min-height:400px; padding-top:20px">
        <div style="max-width:500px; margin: auto; text-align: center; background-color:white; padding:20px; margin-top:20px">
          <img src="https://saintapp.up.railway.app/_nuxt/saintLogo.DvkUeMPE.jpg" style="width:45%">
          <div style="background-color:white; text-align: center;">
            <h2>Código de Activación de cuenta</h2>
            <p style="margin-top:30px">Haz sido invitado a administrar una vivienda, ingresa el siguiente código en el APP SAINT para iniciar tu registro.</p>
            <p><div style="background-color: #F2F2F2; font-size:40px; color: black !important; font-weight:900; padding:20px; border-radius:5px;">${invitationCode}</div></p>
          </div>
        </div>
      </div>
    </div>
  `;
  try {
    const response = await resend.emails.send({
      from: 'noreply@sainthn.com',
      to: [email],
      subject: 'SAINT - Código de activación',
      html: emailHtml,
    
    });
    return response;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Error al enviar el correo electrónico' });
  }
});