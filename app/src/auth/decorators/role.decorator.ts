import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: ('aluno' | 'admin')[]) =>
  SetMetadata('roles', roles);
