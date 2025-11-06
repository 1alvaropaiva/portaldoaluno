# Portal do Aluno

Este repositório contém uma API em NestJS para autenticação, gestão de alunos e fluxo de redefinição de senha por e‑mail. A aplicação usa PostgreSQL via TypeORM, documentação via Swagger e serviços auxiliares (pgAdmin e smtp4dev) por Docker Compose.

## Como executar

Pré-requisitos:
- Docker e Docker Compose instalados

Opção 1 — Executar com Docker (recomendado):
1. Na raiz do projeto, crie/ajuste o arquivo `.env` (raiz) conforme seção "Variáveis de ambiente" (os valores padrão já funcionam para desenvolvimento).
2. Suba os serviços:
    - `docker-compose up`
3. Acesse:
    - API (Swagger): http://localhost:8080/swagger
    - pgAdmin: http://localhost:16543 (login definido no `docker-compose.yml`)
    - smtp4dev (web): http://localhost:90

Observação: Portas padrão no Docker: o host expõe 8080 -> 3000 (API) e 5433 -> 5432 (Postgres). A interface do smtp4dev usa a porta 90 no host.

## Estrutura do projeto

- `app/` — Aplicação NestJS
    - `src/`
        - `main.ts` — Bootstrap do servidor, Swagger e ValidationPipe.
        - `app.module.ts` — Módulo raiz: TypeORM + módulos da aplicação.
        - `auth/` — Autenticação (login, registro, logout usando JWT)
            - `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`, `guard/auth.guard.ts`
        - `pessoas/` — Domínio "Pessoa"
            - `pessoas.controller.ts`, `pessoas.service.ts`, `pessoas.module.ts`
            - `entities/pessoa.entity.ts` — Entidade `pessoa` (id, nome, email, senha, matricula)
            - `dto/create-pessoa.dto.ts`, `dto/update-pessoa.dto.ts`
        - `mail/` — Fluxo de e‑mail para redefinição de senha
            - `mail.controller.ts`, `mail.service.ts`, `mail.module.ts`
    - `Dockerfile` — Build docker
    - `.env` — Variáveis específicas da aplicação
- `db/` — Recursos do Postgres
    - `pgdata/` — Dados persistidos (volume)
    - `init_scripts/create_db.sql` — Criação de tabela `pessoa` na primeira execução
- `docker-compose.yml` — API, Postgres, pgAdmin e smtp4dev
- `.env` (raiz) — Variáveis globais usadas pelo docker-compose

## Endpoints principais

Autenticação (`/auth`):
- `POST /auth/register` — Cria um usuário
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

- `POST /auth/login` — Autentica e retorna um token JWT
  Body:
  ```json
  {
    "email": "maria@exemplo.com",
    "senha": "minhaSenha123"
  }
  ```
  Resposta:
  ```json
  { "token": "<JWT>" }
  ```

- `POST /auth/logout` — Invalida o token atual (requer Bearer token)
  Header: `Authorization: Bearer <JWT>`
  Resposta: `{ "message": "Logout efetuado com sucesso!" }`

Pessoas (`/pessoas`):
- `GET /pessoas` — Lista todas as pessoas (público)
- `PUT /pessoas/update` — Atualiza os próprios dados (requer Bearer token)
  Body (campos opcionais; e‑mail e matrícula não podem ser alterados):
  ```json
  {
    "nome": "Novo Nome",
    "senhaAtual": "minhaSenha123",
    "novaSenha": "minhaNovaSenha456"
  }
  ```
- `GET /pessoas/dashboard` — Retorna um resumo do usuário autenticado
  Resposta (exemplo):
  ```json
  {
    "mensagem": "Bem-vindo, Maria da Silva!",
    "matricula": "20250001"
  }
  ```
- `DELETE /pessoas/:id` — Remove a própria conta (requer Bearer token e o `:id` deve ser o do usuário)

E‑mail/Redefinição de senha (`/mail`):
- `POST /mail/request-reset` — Solicita redefinição de senha
  Body:
  ```json
  { "email": "maria@exemplo.com" }
  ```
  Um e‑mail com um token de redefinição é enviado (ver interface do smtp4dev em http://localhost:90).

- `POST /mail/reset-password` — Redefine a senha usando o token recebido
  Body:
  ```json
  { "token": "<TOKEN_RECEBIDO>", "newPassword": "minhaNovaSenha456" }
  ```

A documentação completa e testável está no Swagger: `/swagger`.

## Autenticação

- JWT Bearer com expiração de 3 horas (algoritmo HS256). O Swagger já está configurado para enviar o token.
- Após fazer `POST /auth/login`, copie o token e use "Authorize" no Swagger, ou envie no header `Authorization: Bearer <JWT>`.

## Variáveis de ambiente

Arquivos `.env`:
- `.env` (raiz):
    - `APP_NAME` (padrão: `portal-api`)
    - `APP_PORT` (porta do host mapeada para a API; padrão: `8080`)
    - `SWAGGER_PATH` (padrão: `swagger`)
    - `SWAGGER_SERVER` (padrão: `/`)
    - `HTTP_LOGGER_DEV` (padrão: `true`)
    - `SMTP4DEV_WEB_INTERFACE_PORT` (padrão: `90`)
- `app/.env` (usado pela aplicação NestJS):
    - `NODE_ENV=development`
    - `PORT=3000` (porta interna do container/app)
    - `SWAGGER_PATH=swagger`, `SWAGGER_SERVER=/`
    - `POSTGRES_HOST=db`, `POSTGRES_PORT=5432`, `POSTGRES_USER=pguser`, `POSTGRES_PASSWORD=pgpassword`, `POSTGRES_DATABASE=basedados`
    - `RUN_MIGRATIONS=true` (habilita `synchronize` do TypeORM — use com cuidado em produção)
    - `SMTP_HOST=smtp4dev`, `SMTP_PORT=25`, `SMTP_FROM="no-reply@portaldoaluno.com"`

## Banco de Dados

- Postgres em container com `pguser`/`pgpassword` e base `basedados`.
- Porta do host: `5433` (mapeia para `5432` do container).
- Scripts de inicialização em `db/init_scripts` criam a tabela `pessoa` na primeira execução.
- Dados persistidos em `db/pgdata/`.

## Acesso rápido

- Swagger: http://localhost:8080/swagger
- pgAdmin: http://localhost:16543 — credenciais no `docker-compose.yml`
- smtp4dev (e‑mails capturados em dev): http://localhost:90
