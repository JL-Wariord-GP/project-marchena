// src/services/emailService.js
import nodemailer from "nodemailer";
import { config } from "../config/config.js";

/**
 * Envía un email utilizando el servicio SMTP configurado.
 * @param {Object} emailOptions - Opciones del email.
 * @param {string} emailOptions.to - Correo del destinatario.
 * @param {string} emailOptions.subject - Asunto del mensaje.
 * @param {string} emailOptions.html - Contenido HTML del mensaje.
 * @returns {Promise<boolean>} Retorna true si se envió correctamente; false en caso de error.
 */
export const sendEmail = async (emailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465, // true para 465, false para otros puertos
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    const message = {
      from: `"${config.email.fromName}" <${config.email.user}>`,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Email enviado: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error al enviar email:", error);
    return false;
  }
};
