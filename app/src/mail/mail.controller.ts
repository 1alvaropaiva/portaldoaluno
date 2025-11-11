import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import MailService from './mail.service';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AlunoEntity } from '../alunos/entities/aluno.entity';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,
  ) {}

  private resetTokens: Map<string, string> = new Map();

  @Post('request-reset')
  @ApiOperation({ summary: 'Solicita redefinição de senha' })
  @ApiResponse({
    status: 200,
    description:
      'Enviaremos via e-mail as instruções para redefinição de senha.',
  })
  async requestReset(@Body() { email }: RequestResetPasswordDto) {
    const aluno = await this.alunoRepository.findOne({
      where: { email },
      select: ['id', 'email'],
    });

    if (!aluno) {
      return {
        message: 'Não encontramos seu e-mail em nossa base de dados :(',
      };
    }

    const token = Math.random().toString(36).substring(2, 15);
    this.resetTokens.set(token, aluno.email);
    await this.mailService.sendEmail({
      to: aluno.email,
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

    const aluno = await this.alunoRepository.findOne({ where: { email } });
    if (!aluno) {
      throw new BadRequestException('Aluno não encontrado.');
    }

    aluno.senha = await bcrypt.hash(newPassword, 10);
    await this.alunoRepository.save(aluno);

    this.resetTokens.delete(token);

    return { message: 'Senha redefinida com sucesso.' };
  }
}
