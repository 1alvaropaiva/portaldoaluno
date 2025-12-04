# Portal do Aluno

API em NestJS para autenticação, gestão de alunos, administração e fluxo de rematrícula (cursos, disciplinas, turmas, pré‑requisitos e matrícula de alunos). Inclui envio de e‑mail para redefinição de senha e uso de Redis para blacklist de tokens (logout) e cache. A documentação é publicada via Swagger e toda a stack de desenvolvimento roda com Docker Compose (API, Postgres, Redis, RedisInsight e smtp4dev).

## Como executar

Pré-requisitos:
- Docker e Docker Compose instalados
- Node.js 18+

Executar com Docker:
1. Suba os serviços:
    - `docker-compose up`
2. Acesse:
    - API (Swagger): http://localhost:8080/swagger
    - smtp4dev (web): http://localhost:90
    - RedisInsight (GUI para Redis): http://localhost:5540

Observação: Portas padrão no Docker: o host expõe 8080 -> 3000 (API), 5433 -> 5432 (Postgres), 6379 -> 6379 (Redis) e 5540 -> 5540 (RedisInsight). A interface do smtp4dev usa a porta 90 no host.

## Estrutura do projeto

- `app/` — Aplicação NestJS
    - `src/`
        - `main.ts` — Bootstrap do servidor, Swagger e ValidationPipe.
        - `app.module.ts` — Módulo raiz: TypeORM + módulos da aplicação.
        - `auth/` — Autenticação (registro/login/logout com JWT e blacklist, guards e roles)
            - `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`
            - `guard/auth.guard.ts`, `guard/roles.guard.ts`, `decorators/role.decorator.ts`
            - `token-blacklist.service.ts`, `session.service.ts`, `dto/login.dto.ts`
        - `alunos/` — Domínio de alunos (CRUD básico e endpoints do próprio usuário)
            - `alunos.controller.ts`, `alunos.service.ts`, `entities/aluno.entity.ts`
            - `dto/create-aluno.dto.ts`, `dto/update-aluno.dto.ts`, `alunos.module.ts`
        - `admin/` — Domínio de administradores (operações para conta admin logada)
            - `admin.controller.ts`, `admin.service.ts`, `entities/admin.entity.ts`
            - `dto/create-admin.dto.ts`, `dto/update-admin.dto.ts`, `admin.module.ts`
        - `rematricula/` — Domínio acadêmico de rematrícula
            - `curso/` — `curso.controller.ts`, `curso.service.ts`, `entities/curso.entity.ts`, `curso.module.ts`
            - `disciplina/` — `disciplina.controller.ts`, `disciplina.service.ts`, `entities/disciplina.entity.ts`, `disciplina.module.ts`
            - `turma/` — `turma.controller.ts`, `turma.service.ts`, `entities/turma.entity.ts`, `turma.module.ts`
            - `prerequisito/` — `prerequisito.controller.ts`, `prerequisito.service.ts`, `entities/prerequisito.entity.ts`, `prerequisito.module.ts`
            - `matricula/` — `matricula.controller.ts`, `matricula.service.ts`, `entities/matricula.entity.ts`, `matricula.module.ts`
            - `rematricula.module.ts` agrega os submódulos.
        - `mail/` — Fluxo de e‑mail para redefinição de senha
            - `mail.controller.ts`, `mail.service.ts`, `mail.module.ts`
        - `redis/` — Módulo de Redis (conexão centralizada)
            - `redis.module.ts`
    - `Dockerfile` — Build da aplicação para o container
    - `.env` — Variáveis específicas da aplicação (consumidas pela API dentro do container)
- `db/` — Recursos do Postgres
    - `pgdata/` — Dados persistidos (volume)
    - `init_scripts/` — Scripts de inicialização do banco
- `redis/` — Dados persistidos do Redis para o Docker
    - `data/` — AOF/RDB e arquivos de estado do Redis
- `propostas/` — Materiais auxiliares e propostas de modelos/rotas (documentação de apoio)
- `docker-compose.yml` — Orquestração: API, Postgres, Redis, RedisInsight e smtp4dev
- `.env` (raiz) — Variáveis globais usadas pelo docker-compose

## Endpoints principais (resumo)

Autenticação (`/auth`):
- `POST /auth/register` — Cria um aluno
  Body:
  ```json
  {
    "nome": "Maria da Silva",
    "email": "maria@exemplo.com",
    "senha": "minhaSenha123",
    "matricula": "20250001"
  }
  ```
  Resposta: `{ "message": "Cadastrado com sucesso!" }`

- `POST /auth/login` — Autentica e retorna os dados de sessão (inclui JWT)
  Body:
  ```json
  { "email": "maria@exemplo.com", "senha": "minhaSenha123" }
  ```
  Resposta (exemplo):
  ```json
  { "token": "<JWT>" }
  ```

- `POST /auth/logout` — Invalida o token atual (requer Bearer token).

Alunos (`/alunos`):
- `GET /alunos` — Lista todos os alunos (público)
- `PUT /alunos/update` — Atualiza os próprios dados (autenticado)
  Body (campos opcionais; e‑mail e matrícula não podem ser alterados):
  ```json
  { "nome": "Novo Nome", "senhaAtual": "minhaSenha123", "novaSenha": "minhaNovaSenha456" }
  ```
- `GET /alunos/dashboard` — Dashboard do aluno autenticado
- `DELETE /alunos/:id` — Remove a própria conta (o `:id` deve ser o do aluno autenticado)

Admin (`/admin`):
- `POST /admin` — Cria um administrador
- `GET /admin` — Lista administradores
- `PUT /admin/update` — Atualiza os próprios dados (autenticado)
- `GET /admin/dashboard` — Dashboard do admin autenticado
- `DELETE /admin/:id` — Remove a própria conta admin

E‑mail/Redefinição de senha (`/mail`):
- `POST /mail/request-reset` — Solicita redefinição de senha para um e‑mail cadastrado
- `POST /mail/reset-password` — Redefine a senha usando o token recebido por e‑mail

Rematrícula (domínio acadêmico):
- Cursos (`/cursos`): `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- Disciplinas (`/disciplinas`): `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- Turmas (`/turmas`): `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- Pré‑requisitos (`/prerequisitos`): `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- Matrículas (`/matriculas`): criação/listagem/atualização/remoção de matrículas de alunos em turmas. A matrícula possui situação (`situacao`) com os estados:
  - `cursando`
  - `cancelada`
  - `cursada`

  Para fins de **pré‑requisito**, somente matrículas com situação `cursada` contam como disciplina cumprida. Ou seja, o aluno só pode se matricular em uma disciplina que possua pré‑requisito se já tiver ao menos uma matrícula `cursada` na disciplina requisito; matrículas `cursando`, `cancelada` ou apenas `ativa` não atendem ao pré‑requisito.

A documentação completa e testável está no Swagger: `/swagger`.

## Autenticação

- JWT Bearer com expiração de 3 horas (algoritmo HS256). O Swagger já está configurado para enviar o token.
- Após fazer `POST /auth/login`, copie o token e use "Authorize" no Swagger, ou envie no header `Authorization: Bearer <JWT>`.
- Logout: tokens são invalidados via blacklist no Redis até a expiração do próprio JWT.
- Autorização por papel (roles): há suporte a guards e decorator de role: `aluno` ou `admin`.

## Variáveis de ambiente

Arquivos `.env`:
- `.env` (raiz):
    - `APP_NAME` (padrão: `portal-api`)
    - `APP_PORT` (porta do host mapeada para a API; padrão: `8080`)
    - `SWAGGER_PATH` (padrão: `swagger`)
    - `SWAGGER_SERVER` (padrão: `/`)
    - `HTTP_LOGGER_DEV` (padrão: `true`)
    - `SMTP4DEV_WEB_INTERFACE_PORT` (padrão: `90`)
    - `REDIS_PASSWORD` (senha do Redis usada no container e na API; padrão: `portalaluno`)
- `app/.env` (usado pela aplicação NestJS):
    - `NODE_ENV=development`
    - `PORT=3000` (porta interna do container/app)
    - `SWAGGER_PATH=swagger`, `SWAGGER_SERVER=/`
    - `POSTGRES_HOST=db`, `POSTGRES_PORT=5432`, `POSTGRES_USER=pguser`, `POSTGRES_PASSWORD=pgpassword`, `POSTGRES_DATABASE=basedados`
    - `RUN_MIGRATIONS=true` (habilita `synchronize` do TypeORM — use com cuidado em produção)
    - `SMTP_HOST=smtp4dev`, `SMTP_PORT=25`, `SMTP_FROM="no-reply@portaldoaluno.com"`
    - Redis:
        - `REDIS_HOST=redis`
        - `REDIS_PORT=6379`
        - `REDIS_DB=0`
        - `REDIS_PASSWORD=portalaluno`
        - `REDIS_PREFIX=portal:`

## Banco de Dados

- Postgres em container com `pguser`/`pgpassword` e base `basedados`.
- Porta do host: `5433` (mapeia para `5432` do container).
- Scripts de inicialização em `db/init_scripts` podem criar objetos iniciais do banco na primeira execução.
- Dados persistidos em `db/pgdata/`.

## Redis e Sessões/Tokens

- O projeto usa Redis como store de cache global via `cache-manager-redis-store` e para blacklist de tokens (logout).
- Tokens de logout (blacklist) são gravados no Redis com prefixo `portal:blacklist:` e TTL automático até a expiração do próprio JWT.
- Serviço Redis em Docker:
  - Host: `localhost`
  - Porta: `6379`
  - Senha: valor de `REDIS_PASSWORD` no `.env` da raiz (padrão: `portalaluno`)
  - DB (índice): `0`
- GUI RedisInsight em: http://localhost:5540
  - Ao abrir, adicione uma conexão com:
    - Host: `redis`
    - Porta: `6379`
    - Senha: `portalaluno`
    - Database: `0`
  - Alternativamente, do host: Host `localhost` com as mesmas credenciais.

Conexão via `redis-cli` (host):
```
redis-cli -h 127.0.0.1 -p 6379 -a portalaluno ping
```
Você deve receber `PONG`.

Chaves gravadas pela aplicação seguem o prefixo configurado em `REDIS_PREFIX` (padrão `portal:`). A blacklist usa `portal:blacklist:<token>`.

## Credenciais para clientes (DBeaver, RedisInsight, etc.)

- PostgreSQL (para DBeaver):
  - Host: `localhost`
  - Porta: `5433`
  - Database: `basedados`
  - Usuário: `pguser`
  - Senha: `pgpassword`

- Redis:
  - Cliente: RedisInsight (GUI) ou redis-cli.
  - Host: `redis`
  - Porta: `6379`
  - Database index: `0`
  - Senha: `portalaluno` (ou mudar no `.env`)

## Como o projeto funciona (visão geral)

- Autenticação e sessão
  - Registro e login de aluno com validação (`class-validator`) e hashing de senha (`bcryptjs`).
  - Geração de JWT (HS256) contendo identificador do usuário. O tempo de expiração padrão é de 3 horas.
  - Logout grava o identificador do token na blacklist do Redis até a expiração, bloqueando seu reuso.
  - Guards (`AuthGuard`, `RolesGuard`) e decorator `Role` para restringir o acesso a determinados papéis.

- Domínios principais
  - Alunos: lista pública, atualização de dados do próprio usuário, dashboard, remoção da própria conta.
  - Admin: atualização e dashboard do administrador autenticado, além de listagem e criação de admin.
  - Rematrícula: entidades e endpoints para cursos, disciplinas, turmas, pré‑requisitos e matrículas.

- E‑mail e redefinição de senha
  - `smtp4dev` captura os e‑mails em ambiente de desenvolvimento.
  - O endpoint `/mail/request-reset` gera um token simples em memória para demonstração e envia por e‑mail.
  - `/mail/reset-password` valida o token e atualiza a senha do aluno com hashing. Em produção, recomenda‑se persistir tokens com expiração (ex.: Redis/DB) e enviar links com página de reset.

- Infraestrutura
  - Docker Compose orquestra API, Postgres, Redis, RedisInsight e smtp4dev.
  - TypeORM com `synchronize` controlado por `RUN_MIGRATIONS`.

Qualquer dúvida sobre endpoints, schemas e exemplos, consulte o Swagger.
