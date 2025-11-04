import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import MailService from './mail.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaEntity } from '../pessoas/entities/pessoa.entity';
import * as bcrypt from 'bcryptjs';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(PessoaEntity)
    private readonly pessoaRepository: Repository<PessoaEntity>,
  ) {}

  private resetTokens: Map<string, string> = new Map();

  @Post('request-reset')
  @ApiOperation({ summary: 'Solicita redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Se o e-mail existir, um link de redefinição será enviado.',
  })
  async requestReset(@Body() { email }: RequestResetPasswordDto) {
    const pessoa = await this.pessoaRepository.findOne({
      where: { email },
      select: ['id', 'email'],
    });

    if (!pessoa) {
      return {
        message:
          'Se este e-mail existir, enviaremos instruções para redefinição de senha.',
      };
    }

    const token = Math.random().toString(36).substring(2, 15);
    this.resetTokens.set(token, pessoa.email);
    await this.mailService.sendEmail({
      to: pessoa.email,
      subject: 'Redefinição de senha',
      html: `
        <h1>Redefinir senha</h1>
        <p>Olá! Aqui está o seu token de redefinição de senha:</p>
        <a href="${token}">${token}</a>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    });

    return {
      message: 'Enviaremos via e-mail as instruções para redefinição de senha.',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Redefine a senha a partir de um token' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    const email = this.resetTokens.get(token);
    if (!email) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const pessoa = await this.pessoaRepository.findOne({ where: { email } });
    if (!pessoa) {
      throw new BadRequestException('Usuário não encontrado.');
    }

    pessoa.senha = await bcrypt.hash(newPassword, 10);
    await this.pessoaRepository.save(pessoa);

    this.resetTokens.delete(token);

    return { message: 'Senha redefinida com sucesso.' };
  }
}
