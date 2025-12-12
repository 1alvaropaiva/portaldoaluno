import {
    BadRequestException, ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtPayload } from "src/@types/express";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private readonly repository: Repository<AdminEntity>,
    ) {}
    async create(dto: CreateAdminDto): Promise<AdminEntity> {
        const hash = await bcrypt.hash(dto.senha, 10);

        const admin = this.repository.create({
            ...dto,
            senha: hash,
        });

        return await this.repository.save(admin);
    }
    async findAll(): Promise<AdminEntity[]> {
        return this.repository.find();
    }
    async findOne(id: number): Promise<AdminEntity> {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID inválido');
        }
        const admin = await this.repository.findOne({where: {id}});
        if (!admin) {
            throw new NotFoundException(`Admin com ID ${id} não encontrado`);
        }
        return admin;
    }
    private async findOneWithPassword(
        id: number,
    ): Promise<AdminEntity & { senha: string }> {
        const admin = await this.repository.findOne({
            where: {id},
            select: ['id', 'nome', 'email', 'senha', 'cargo'],
        });
        if (!admin) {
            throw new NotFoundException(`Admin com ID ${id} não encontrado`);
        }
        return admin;
    }
    async update(id: number, dto: UpdateAdminDto): Promise<AdminEntity> {

        const admin = await this.findOneWithPassword(id);

        if (dto.nome !== undefined) {
            admin.nome = dto.nome;
        }

        if (dto.cargo !== undefined) {
            admin.cargo = dto.cargo;
        }

        if (dto.senha !== undefined) {
            admin.senha = await bcrypt.hash(dto.senha, 10);
        }

        if (dto.email !== undefined) {
            admin.email = dto.email;
        }

        return this.repository.save(admin);
    }
    async remove(id: number, user: JwtPayload): Promise<void> {
        if (!Number.isInteger(id) || id <= 0) {
            throw new BadRequestException('ID inválido');
        }
        if (user.id !== id) {
            throw new ForbiddenException('Você só pode remover sua própria conta');
        }
        const admin = await this.repository.findOne({ where: { id } });
        if (!admin) {
            throw new NotFoundException(`Admin com ID ${id} não encontrado`);
        }
        await this.repository.remove(admin);
    }
}
