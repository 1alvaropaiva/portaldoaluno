import { SetMetadata } from '@nestjs/common';

export const Role = (role: 'aluno' | 'admin') => SetMetadata('role', role);
