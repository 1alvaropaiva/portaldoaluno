# Trabalho de Desenvolvimento – Portal do Aluno

## Contexto
Neste trabalho, os alunos deverão implementar um **sistema de autenticação e gerenciamento de usuários** para um Portal de Aluno universitário. O objetivo é compreender os conceitos de **cadastro, autenticação, atualização de informações e controle de sessão**, aplicando boas práticas de segurança e organização de código.

---

## Requisitos Funcionais

### 1. Cadastro de Usuário
- Campos obrigatórios:
    - **Nome completo**
    - **E-mail (único, usado para login)**
    - **Senha (armazenada de forma segura, com hash)**
    - **Matrícula (única, vinculada ao aluno)**
- Não deve ser permitido cadastrar dois usuários com o mesmo e-mail ou matrícula.

### 2. Login
- O usuário deve realizar login informando **e-mail e senha**.
- O login deve retornar um **token de autenticação (JWT ou similar)** que será usado nas demais rotas protegidas.
- Caso o login seja feito via **banco de dados próprio** ou **Firebase**, deve haver uma política de **reset de senha** (por e-mail ou redefinição via link).
- Caso seja feito via **SSO institucional**, o reset de senha não será necessário, pois o controle será externo.

### 3. Logout
- Deve ser implementada uma rota de logout que invalide o token de sessão.
- No caso de JWT, pode-se simular a invalidação (lista negra de tokens) ou apenas deixar expirar.

### 4. Atualização de Usuário
- Apenas usuários **autenticados** podem atualizar seus dados.
- O usuário poderá atualizar:
    - Nome
    - Senha (com confirmação da senha atual)
- O e-mail e matrícula **não poderão ser alterados**.

### 5. Área Logada (Exemplo de Rota Protegida)
- Deve existir uma rota protegida (exemplo: `/aluno/dashboard`) que só pode ser acessada com um token válido.
- Essa rota deverá retornar uma mensagem de boas-vindas com o **nome e matrícula do aluno autenticado**.

---

## Requisitos Técnicos
- O sistema deve implementar autenticação baseada em token.
- Senhas devem ser armazenadas **com hash seguro (ex: bcrypt)**.
- O backend pode ser implementado em **Node.js (Express ou NestJS)**, ou outra tecnologia definida pelo professor.
- Caso utilize Firebase, deve-se documentar como o reset de senha é tratado.
- Caso utilize SSO, deve-se documentar o fluxo de autenticação.

---

## Exemplos de Rotas

### 1. Cadastro
```http
POST /auth/register
{
  "nome": "João Silva",
  "email": "joao@universidade.com",
  "senha": "123456",
  "matricula": "20250001"
}

POST /auth/login
{
  "email": "joao@universidade.com",
  "senha": "123456"
}

Resposta:
{
  "token": "jwt_token_aqui"
}

PUT /user/update
Headers: { Authorization: Bearer jwt_token_aqui }

{
  "nome": "João da Silva",
  "senhaAtual": "123456",
  "novaSenha": "novaSenha789"
}

GET /aluno/dashboard
Headers: { Authorization: Bearer jwt_token_aqui }

{
  "mensagem": "Bem-vindo, João da Silva!",
  "matricula": "20250001"
}
```

## Entregáveis


- Código-fonte funcional.
- Documentação mínima de rotas (pode ser Swagger ou README).
- Demonstração de login, atualização de usuário e acesso à rota logada.
- Relatório explicando se o login foi implementado via , ou , e como o reset de senha foi tratado (quando aplicável).