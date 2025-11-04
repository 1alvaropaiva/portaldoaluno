/* eslint-disable */
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
    context?: ISendMailOptions['context'];
  }): Promise<void> {
    try {
      const sendMailParams: ISendMailOptions = {
        to: params.to,
        from: process.env.SMTP_FROM,
        subject: params.subject,
        html: params.html,
        context: params.context,
      };

      const response = await this.mailerService.sendMail(sendMailParams);
      this.logger.log(
        `E-mail enviado para ${params.to}. Resposta: ${JSON.stringify(
          response ?? {},
        )}`,
      );
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao enviar e-mail para ${params.to}: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Erro ao enviar e-mail para ${params.to}: ${JSON.stringify(error)}`,
        );
      }
      throw error;
    }
  }
}

export default MailService;
