import { Resend } from "resend";
import logger from "./logger";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const resend = new Resend(RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailParams) => {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Ayarlio <ayarlio@silisia.com>",
      to,
      subject,
      html: html || "",
      text: text || "",
    });

    logger.info(`Email successfully queued for sending`, {
      to,
      id: data.data?.id,
    });
    return data;
  } catch (error) {
    logger.error("Failed to send email:", { error, to, subject });
    throw error;
  }
};
