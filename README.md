# Projeto-de-extensão Techcycle
Projeto universitário
---

### 📄 README.md

```markdown
# 🔄 TechCycle - Sistema de Gestão de Descarte Eletrônico

Sistema web para gerenciar chamados de descarte de equipamentos eletrônicos, promovendo sustentabilidade e controle de ativos.

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com o Node.js)
- **MySQL** (versão 8.0 ou superior) - [Download](https://dev.mysql.com/downloads/)
- Um navegador web moderno (Chrome, Firefox, Edge)

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/Du74/Projeto-de-extens-o---Techcycle.git
cd Projeto-de-extens-o---Techcycle
```

### 2. Instale as dependências do servidor

O projeto utiliza um servidor backend em Node.js. Instale as dependências necessárias:

```bash
npm install express mysql2 cors
```

### 3. Configure o banco de dados MySQL

1. Acesse o MySQL:
   ```bash
   mysql -u root -p
   ```

2. Crie o banco de dados:
   ```sql
   CREATE DATABASE techcycle;
   USE techcycle;
   ```

3. Crie a tabela de chamados:
   ```sql
   CREATE TABLE chamados (
       id INT AUTO_INCREMENT PRIMARY KEY,
       nome_chamado VARCHAR(255) NOT NULL,
       tipo VARCHAR(100) NOT NULL,
       marca VARCHAR(100) NOT NULL,
       data_abertura DATE NOT NULL,
       dashboard VARCHAR(255),
       problema TEXT NOT NULL,
       status VARCHAR(50) DEFAULT 'Aberto',
       prioridade VARCHAR(50) DEFAULT 'Média',
       criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. (Opcional) Se desejar usar o sistema de autenticação, crie também a tabela de usuários:
   ```sql
   CREATE TABLE usuarios (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE NOT NULL,
       senha VARCHAR(255) NOT NULL
   );
   ```

### 4. Configure o servidor

Crie um arquivo `server.js` na raiz do projeto com o seguinte conteúdo (ajuste as credenciais do banco conforme sua configuração):

```javascript
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'techcycle'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('✅ Conectado ao MySQL');
});

// Rotas da API
app.get('/chamados', (req, res) => {
    db.query('SELECT * FROM chamados ORDER BY criado_em DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/chamados', (req, res) => {
    const { nome_chamado, tipo, marca, data_abertura, dashboard, problema } = req.body;
    const sql = 'INSERT INTO chamados (nome_chamado, tipo, marca, data_abertura, dashboard, problema) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome_chamado, tipo, marca, data_abertura, dashboard, problema], (err, result) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ id: result.insertId, message: 'Chamado criado com sucesso' });
    });
});

app.delete('/chamados/:id', (req, res) => {
    db.query('DELETE FROM chamados WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Chamado deletado com sucesso' });
    });
});

app.delete('/chamados', (req, res) => {
    db.query('DELETE FROM chamados', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Todos os chamados foram deletados', deletedCount: result.affectedRows });
    });
});

app.get('/estatisticas', (req, res) => {
    db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "Concluído" THEN 1 ELSE 0 END) as concluidos FROM chamados', (err, results) => {
        if (err) return res.status(500).json(err);
        const total = results[0].total;
        const concluidos = results[0].concluidos;
        const pendentes = total - concluidos;
        const taxaSucesso = total > 0 ? ((concluidos / total) * 100).toFixed(1) : 0;
        res.json({ total, pendentes, concluidos, taxaSucesso });
    });
});

// Rota de login (simplificada para demonstração)
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha], (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });
        res.json({ message: 'Login bem-sucedido' });
    });
});

app.post('/register', (req, res) => {
    const { email, senha } = req.body;
    db.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)', [email, senha], (err, result) => {
        if (err) return res.status(400).json({ error: 'Email já cadastrado' });
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

### 5. Estrutura de arquivos

Certifique-se de que sua pasta do projeto está organizada assim:

```
Projeto-de-extens-o---Techcycle/
│
├── server.js
├── package.json
├── css/
│   └── style.css
├── js/
│   └── script.js
├── pages/
│   ├── dashboard.html
│   ├── novo-chamado.html
│   ├── relatorios.html
│   ├── configuracoes.html
│   ├── login.html
│   ├── register.html
│   ├── about.html
│   └── introducao_techcycle.html
└── README.md
```

### 6. Iniciando o servidor

Execute o servidor com o comando:

```bash
node server.js
```

Você verá a mensagem:
```
✅ Conectado ao MySQL
🚀 Servidor rodando em http://localhost:3000
```

## 🌐 Acessando a aplicação

Abra o navegador e acesse:

- **Página inicial:** `http://localhost:3000/pages/introducao_techcycle.html`
- **Login:** `http://localhost:3000/pages/login.html`
- **Dashboard (após login):** `http://localhost:3000/pages/dashboard.html`

> ⚠️ **Nota:** Para testes, você pode usar diretamente o dashboard se ainda não tiver configurado o registro/login. O sistema de autenticação atual é básico e deve ser ajustado para produção (ex: hash de senha).

## 📌 Funcionalidades principais

- **Registro e login** de usuários
- **Criação de chamados** para descarte de equipamentos
- **Listagem de chamados** (recentes e todos)
- **Dashboard com estatísticas** (total, pendentes, concluídos, taxa de sucesso)
- **Relatórios** com gráficos e filtros
- **Configurações** do usuário e sistema
- **Gerenciamento de chamados** (exclusão individual ou em massa)

## 🛠️ Tecnologias utilizadas

- **Front-end:** HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js
- **Back-end:** Node.js, Express
- **Banco de dados:** MySQL
- **Estilização adicional:** CSS customizado com variáveis e efeitos modernos

## 📝 Possíveis melhorias futuras

- Implementar hash de senhas com bcrypt
- Adicionar autenticação com JWT
- Melhorar validação de entrada nos formulários
- Implementar upload de arquivos para anexos
- Criar paginação na listagem de chamados
- Adicionar recuperação de senha por email

## 👥 Equipe TechCycle

Desenvolvido por alunos do curso de extensão com foco em sustentabilidade e gestão de resíduos eletrônicos.

---

