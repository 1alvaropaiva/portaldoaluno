# Projeto NestJS + Postgres (Docker)

Este repositório contém um exemplo de API construída com NestJS, documentada com Swagger, e executada em containers Docker junto a um banco de dados PostgreSQL e o pgAdmin.

Objetivos deste README:
- Explicar como executar o projeto (com docker-compose e localmente).
- Descrever a estrutura das pastas/arquivos mais importantes.
- Documentar variáveis de ambiente e endpoints principais.

## Como executar

Pré-requisitos:
- Docker e Docker Compose instalados
- Node.js 18+ (apenas se desejar executar fora do Docker)

Passos principais:
1. Na pasta `app`, instale as dependências:
   - `npm install`
2. Na raiz do projeto (pasta "nestjs"), suba os containers:
   - `docker-compose up`
3. Acesse a API e documentação:
   - API: http://localhost:8080
   - Swagger: http://localhost:8080/swagger

Observações:
- As portas podem ser alteradas via `.env` (raiz e app). Por padrão, a API expõe a porta 8080 do host para a 3000 do container.
- O Postgres expõe a porta 5432.
- O pgAdmin é acessível em http://localhost:16543 (login padrão definido em `docker-compose.yml`).

## Estrutura do projeto

- `app/` — Aplicação NestJS (código-fonte TypeScript, Dockerfile e .env da app)
  - `src/`
    - `main.ts` — Ponto de entrada da aplicação (inicializa servidor, Swagger e ValidationPipe).
    - `app.module.ts` — Módulo raiz: configura o TypeORM e registra módulos/serviços/controllers.
    - `app.controller.ts` — Controller raiz com uma rota GET simples.
    - `app.service.ts` — Serviço de exemplo (lista em memória).
    - `pessoas/` — Módulo de Pessoas (exemplo CRUD simplificado)
      - `pessoas.module.ts` — Módulo de Pessoas (Controller + Service + Repository).
      - `pessoas.controller.ts` — Endpoints: listar, buscar por id e cadastrar.
      - `pessoas.service.ts` — Regras de negócio e acesso ao banco via TypeORM.
      - `entities/pessoa.entity.ts` — Entidade mapeando a tabela `pessoa`.
      - `dtos/cadastrar-pessoa.dto.ts` — DTO para cadastro com validações e docs Swagger.
  - `Dockerfile` — Docker multi-stage: build e runtime da aplicação.
  - `.env` — Variáveis específicas da aplicação (JWT, Postgres, logs etc.).
- `db/` — Recursos do Postgres
  - `pgdata/` — Dados persistentes do banco (montados no container). NÃO versionar.
  - `init_scripts/` — Scripts executados na inicialização do container Postgres.
    - `create_db.sql` — Script que cria a tabela `pessoa`.
- `docker-compose.yml` — Orquestra API, Postgres e pgAdmin.
- `.env` (raiz) — Variáveis globais usadas no docker-compose (APP_NAME, portas etc.).
- `servers.json` — Pasta usada para mapear um arquivo de configuração do pgAdmin (volume montado). Se desejar usar um arquivo `servers.json`, coloque-o aqui.

## Endpoints principais

- `GET /` — Retorna a string "HELLO" (exemplo simples). 
- `GET /pessoas` — Lista todas as pessoas (dados do Postgres).
- `GET /pessoas/:id` — Retorna uma pessoa pelo id.
- `POST /pessoas` — Cadastra uma pessoa. Body (JSON):
  ```json
  {
    "nome": "João da Silva",
    "cpf": "12345678900",
    "dataNascimento": "1990-01-01"
  }
  ```

A documentação completa está no Swagger: `/swagger`.

## Variáveis de ambiente

Arquivos `.env`:
- `.env` (raiz): APP_NAME, APP_PORT, APP_PORT_DEBUG, SWAGGER_PATH, etc.
- `app/.env`: inclui configs específicas (JWT, Postgres, Redis opcional, logger, RUN_MIGRATIONS etc.).

Atenção em produção:
- Não publique segredos (como JWT_SECRET) no repositório.
- Ajuste `RUN_MIGRATIONS`/`synchronize` para não alterar schema automaticamente em produção.

## Banco de Dados

- Container Postgres com usuário `pguser`, senha `pgpassword` e base `basedados`.
- Script `db/init_scripts/create_db.sql` cria a tabela `pessoa` ao iniciar pela primeira vez.
- Os dados são persistidos em `db/pgdata/`.

## Desenvolvimento

- Rodar a API diretamente (sem Docker):
  - Dentro de `app`: `npm install && npm run start:dev`
  - Acessar: http://localhost:3000 (ou porta definida em `PORT`)
- Debug no Docker: porta 9229 mapeada conforme `.env`.

## Licença

Uso educacional/demonstrativo.
