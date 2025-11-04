import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaEntity } from '../pessoas/entities/pessoa.entity';
import { MailController } from './mail.controller';
import MailService from './mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PessoaEntity]),
    MailerModule.forRootAsync({
      useFactory: (): MailerOptions => {
        const hasAuth = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

        return {
          transport: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            ...(hasAuth
              ? {
                  auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                  },
                }
              : {}),
            tls: {
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: process.env.SMTP_FROM,
          },
        };
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
