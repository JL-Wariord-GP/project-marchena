// src/controllers/emailController.js
import { sendEmail } from "../services/emailService.js";

export const sendWelcomeEmail = async (req, res) => {
  const { to } = req.body;
  const emailOptions = {
    to,
    subject: "Bienvenido a nuestro sistema",
    html: `<h1>Gracias por registrarte</h1><p>Esperamos que disfrutes nuestra aplicación.</p>`,
  };

  const enviado = await sendEmail(emailOptions);
  if (enviado) {
    res.status(200).json({ message: "Correo enviado exitosamente." });
  } else {
    res.status(500).json({ message: "Error al enviar correo." });
  }
};
