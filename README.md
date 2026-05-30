# TechCycle - Sistema de Gestão de Chamados

Sistema moderno e organizado para gestão de chamados técnicos com autenticação, recuperação de senha e dashboard interativo.

## 📋 Estrutura do Projeto

```
techcycle/
├── src/                          # Código-fonte do back-end
│   ├── config/                   # Configurações (banco de dados)
│   │   └── db.js                 # Conexão MySQL
│   ├── controllers/              # Lógica de controle
│   │   ├── authController.js     # Autenticação e recuperação de senha
│   │   ├── chamadosController.js # Gestão de chamados
│   │   └── pagesController.js    # Entrega de páginas HTML
│   ├── routes/                   # Definição de rotas
│   │   ├── auth.routes.js        # Rotas de autenticação
│   │   ├── chamados.routes.js    # Rotas de chamados
│   │   └── pages.routes.js       # Rotas de páginas
│   ├── middlewares/              # Middlewares (para futuras implementações)
│   ├── services/                 # Serviços (para futuras implementações)
│   └── app.js                    # Configuração do Express
├── public/                       # Arquivos estáticos
│   ├── css/                      # Folhas de estilo
│   │   └── style.css             # CSS principal
│   ├── js/                       # Scripts do front-end
│   │   ├── modules/              # Módulos reutilizáveis
│   │   │   ├── api.js            # Centraliza chamadas fetch
│   │   │   └── utils.js          # Funções utilitárias
│   │   └── pages/                # Scripts específicos de páginas
│   │       ├── login.js          # Lógica da página de login
│   │       ├── register.js       # Lógica da página de registro
│   │       └── dashboard.js      # Lógica do dashboard
│   └── assets/                   # Imagens e ícones
├── views/                        # Arquivos HTML
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── novo-chamado.html
│   ├── relatorios.html
│   ├── configuracoes.html
│   ├── about.html
│   └── introducao_techcycle.html
├── server.js                     # Ponto de entrada
├── package.json                  # Dependências do projeto
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de variáveis
├── .gitignore                    # Arquivos ignorados pelo Git
├── banco.sql                     # Script de criação do banco
└── README.md                     # Este arquivo
```

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js >= 14.0.0
- MySQL 5.7 ou superior
- npm ou yarn

### Passos

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd techcycle
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   ```bash
   # Crie o banco de dados
   mysql -u root -p < banco.sql
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

5. **Inicie o servidor**
   ```bash
   # Modo produção
   npm start

   # Modo desenvolvimento (com auto-reload)
   npm run dev
   ```

O servidor estará disponível em `http://localhost:3000`

## 📚 Arquitetura

### Back-end (Node.js + Express)

#### Controllers
- **authController.js**: Gerencia registro, login e recuperação de senha
- **chamadosController.js**: Operações CRUD de chamados e estatísticas
- **pagesController.js**: Entrega de arquivos HTML

#### Routes
- **auth.routes.js**: POST `/register`, POST `/login`, POST `/api/esqueci-senha`, GET `/resetar-senha`
- **chamados.routes.js**: GET/POST `/chamados`, GET `/estatisticas`, DELETE `/chamados/:id`
- **pages.routes.js**: GET `/`, GET `/login`, GET `/dashboard`, etc.

#### Config
- **db.js**: Gerencia a conexão com MySQL usando variáveis de ambiente

### Front-end (Vanilla JavaScript)

#### Módulos
- **api.js**: Centraliza todas as chamadas fetch (login, registro, chamados, etc.)
- **utils.js**: Funções utilitárias (tema, autenticação, formatação, validação)

#### Scripts de Página
- **login.js**: Lógica do formulário de login e recuperação de senha
- **register.js**: Lógica do formulário de registro com validação
- **dashboard.js**: Gestão de chamados, estatísticas e modais

## 🔑 Principais Funcionalidades

- ✅ **Autenticação**: Registro e login com bcrypt
- ✅ **Recuperação de Senha**: Sistema de tokens com expiração
- ✅ **Gestão de Chamados**: CRUD completo
- ✅ **Dashboard**: Estatísticas em tempo real
- ✅ **Tema Claro/Escuro**: Persistência em localStorage
- ✅ **Responsivo**: Interface adaptável a diferentes tamanhos de tela

## 🛠️ Tecnologias Utilizadas

### Back-end
- **Express.js**: Framework web
- **MySQL**: Banco de dados
- **bcryptjs**: Criptografia de senhas
- **CORS**: Compartilhamento de recursos
- **dotenv**: Gerenciamento de variáveis de ambiente

### Front-end
- **Bootstrap 5**: Framework CSS
- **Font Awesome**: Ícones
- **Chart.js**: Gráficos (em relatorios.html)
- **Vanilla JavaScript**: Sem dependências desnecessárias

## 📝 Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=1608
DB_NAME=techcycle

# Email (opcional)
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

## 🔐 Segurança

- Senhas são criptografadas com bcrypt (10 rounds)
- Tokens de recuperação de senha expiram em 1 hora
- CORS configurado para aceitar requisições
- Validação de entrada em formulários

## 📊 Endpoints da API

### Autenticação
- `POST /register` - Registrar novo usuário
- `POST /login` - Fazer login
- `POST /api/esqueci-senha` - Solicitar recuperação de senha
- `GET /resetar-senha?token=...` - Verificar token e exibir formulário
- `POST /api/resetar-senha` - Redefinir senha

### Chamados
- `GET /chamados` - Listar todos os chamados
- `POST /chamados` - Criar novo chamado
- `DELETE /chamados/:id` - Deletar chamado específico
- `DELETE /chamados` - Deletar todos os chamados
- `GET /estatisticas` - Obter estatísticas

### Páginas
- `GET /` - Página inicial
- `GET /login` - Página de login
- `GET /register` - Página de registro
- `GET /dashboard` - Dashboard
- `GET /novo-chamado` - Criar chamado
- `GET /relatorios` - Relatórios
- `GET /configuracoes` - Configurações
- `GET /about` - Sobre

## 🧪 Testes

```bash
npm test
```

## 📄 Licença

MIT

## 👥 Contribuidores

TechCycle Team

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
