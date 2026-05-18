// server.js - TechCycle com recuperação de senha (SEM coluna nome)
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Log todas as requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ==================== DIAGNÓSTICO ====================
console.log("🔍 DIAGNÓSTICO DO SERVIDOR:");
console.log("📁 Diretório atual:", __dirname);

// Verificar se as pastas existem
const folders = [
  'public',
  'public/html', 
  'public/css',
  'public/js'
];

folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (fs.existsSync(folderPath)) {
    console.log(`✅ ${folder} - EXISTE`);
    try {
      const files = fs.readdirSync(folderPath);
      console.log(`   📄 Arquivos: ${files.join(', ')}`);
    } catch (e) {
      console.log(`   📄 (sem arquivos)`);
    }
  } else {
    console.log(`❌ ${folder} - NÃO EXISTE`);
  }
});

// ==================== FUNÇÃO PARA ENVIAR HTML ====================
function sendHTML(res, filename) {
  const filePath = path.join(__dirname, 'public/html', filename);
  console.log(`📄 Tentando enviar: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ Arquivo encontrado!`);
    res.sendFile(filePath);
  } else {
    console.log(`❌ Arquivo NÃO encontrado!`);
    res.status(404).json({ 
      error: 'Página não encontrada',
      file: filename,
      fullPath: filePath
    });
  }
}

// ==================== ROTAS DE PÁGINAS ====================
app.get("/", (req, res) => {
  console.log("🏠 Rota / solicitada");
  sendHTML(res, 'introducao_techcycle.html');
});

app.get("/login", (req, res) => {
  console.log("🔐 Rota /login solicitada");
  sendHTML(res, 'login.html');
});

app.get("/register", (req, res) => {
  console.log("📝 Rota /register solicitada");
  sendHTML(res, 'register.html');
});

app.get("/dashboard", (req, res) => {
  console.log("📊 Rota /dashboard solicitada");
  sendHTML(res, 'dashboard.html');
});

app.get("/novo-chamado", (req, res) => {
  console.log("➕ Rota /novo-chamado solicitada");
  sendHTML(res, 'novo-chamado.html');
});

app.get("/relatorios", (req, res) => {
  console.log("📈 Rota /relatorios solicitada");
  sendHTML(res, 'relatorios.html');
});

app.get("/configuracoes", (req, res) => {
  console.log("⚙️ Rota /configuracoes solicitada");
  sendHTML(res, 'configuracoes.html');
});

app.get("/about", (req, res) => {
  console.log("ℹ️ Rota /about solicitada");
  sendHTML(res, 'about.html');
});

app.get("/about.html", (req, res) => { sendHTML(res, 'about.html'); });
app.get("/configuracoes.html", (req, res) => { sendHTML(res, 'configuracoes.html'); });
app.get("/dashboard.html", (req, res) => { sendHTML(res, 'dashboard.html'); });
app.get("/introducao_techcycle.html", (req, res) => { sendHTML(res, 'introducao_techcycle.html'); });
app.get("/login.html", (req, res) => { sendHTML(res, 'login.html'); });
app.get("/novo-chamado.html", (req, res) => { sendHTML(res, 'novo-chamado.html'); });
app.get("/register.html", (req, res) => { sendHTML(res, 'register.html'); });
app.get("/relatorios.html", (req, res) => { sendHTML(res, 'relatorios.html'); });

// ==================== ROTAS API - CHAMADOS ====================
app.get("/chamados", (req, res) => {
  const sql = `SELECT * FROM chamados ORDER BY criado_em DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/chamados", (req, res) => {
  const { nome_chamado, tipo, marca, data_abertura, dashboard, problema } = req.body;
  const sql = `INSERT INTO chamados (nome_chamado, tipo, marca, data_abertura, dashboard, problema) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [nome_chamado, tipo, marca, data_abertura, dashboard, problema], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId, message: "Chamado criado com sucesso" });
  });
});

app.get("/estatisticas", (req, res) => {
  const queries = {
    total: "SELECT COUNT(*) as total FROM chamados",
    pendentes: "SELECT COUNT(*) as pendentes FROM chamados WHERE status = 'Aberto' OR status = 'Pendente' OR status IS NULL",
    concluidos: "SELECT COUNT(*) as concluidos FROM chamados WHERE status = 'Concluído'"
  };

  db.query(queries.total, (err, totalResult) => {
    if (err) return res.status(500).json(err);
    db.query(queries.pendentes, (err, pendentesResult) => {
      if (err) return res.status(500).json(err);
      db.query(queries.concluidos, (err, concluidosResult) => {
        if (err) return res.status(500).json(err);
        
        const total = totalResult[0].total || 0;
        const pendentes = pendentesResult[0].pendentes || 0;
        const concluidos = concluidosResult[0].concluidos || 0;
        const taxaSucesso = total > 0 ? Math.round((concluidos / total) * 100) : 0;
        
        res.json({ total, pendentes, concluidos, taxaSucesso });
      });
    });
  });
});

app.delete("/chamados", (req, res) => {
  const sql = "DELETE FROM chamados";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Todos os chamados deletados!", deletedCount: results.affectedRows });
  });
});

app.delete("/chamados/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM chamados WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Chamado não encontrado" });
    res.json({ message: "Chamado deletado com sucesso", deletedId: id });
  });
});

// ==================== ROTAS API - AUTENTICAÇÃO ====================
app.post("/register", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    const checkSql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      if (results.length > 0) return res.status(400).json({ error: "Usuário já existe" });
      
      const hashedPassword = await bcrypt.hash(senha, 10);
      const insertSql = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
      
      db.query(insertSql, [email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao criar usuário" });
        res.json({ message: "Usuário registrado com sucesso!", id: results.insertId });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Email e senha são obrigatórios" });

  try {
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado" });
      
      const usuario = results[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });
      
      res.json({ message: "Login bem-sucedido!", usuario: { id: usuario.id, email: usuario.email } });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ==================== ROTAS DE RECUPERAÇÃO DE SENHA ====================

// Rota para solicitar recuperação de senha (SEM a coluna nome)
app.post("/api/esqueci-senha", async (req, res) => {
    const { email } = req.body;
    console.log('\n🔵 ===== RECUPERAÇÃO DE SENHA =====');
    console.log('📧 Email recebido:', email);
    
    if (!email) {
        return res.status(400).json({ error: "Email é obrigatório" });
    }
    
    try {
        // Query SEM o campo 'nome'
        const userSql = "SELECT id, email FROM usuarios WHERE email = ?";
        db.query(userSql, [email], async (err, results) => {
            if (err) {
                console.error('❌ Erro no banco:', err);
                return res.status(500).json({ error: "Erro no servidor" });
            }
            
            if (results.length === 0) {
                console.log('⚠️ Email não encontrado:', email);
                return res.json({ 
                    message: "Se o email estiver cadastrado, você receberá as instruções de recuperação." 
                });
            }
            
            console.log('✅ Email encontrado!');
            
            // Gerar token único
            const token = crypto.randomBytes(32).toString('hex');
            
            // Definir expiração (1 hora)
            const expiraEm = new Date();
            expiraEm.setHours(expiraEm.getHours() + 1);
            const expiraEmMySQL = expiraEm.toISOString().slice(0, 19).replace('T', ' ');
            
            // Salvar token no banco
            const insertSql = `INSERT INTO password_resets (email, token, expira_em) VALUES (?, ?, ?)`;
            db.query(insertSql, [email, token, expiraEmMySQL], (err, result) => {
                if (err) {
                    console.error('❌ Erro ao salvar token:', err);
                    return res.status(500).json({ error: "Erro ao processar solicitação" });
                }
                
                console.log('✅ Token salvo! ID:', result.insertId);
                
                // Mostrar link no console
                const linkRecuperacao = `http://localhost:3000/resetar-senha?token=${token}`;
                console.log('\n' + '='.repeat(70));
                console.log('🔗 LINK DE RECUPERAÇÃO DE SENHA');
                console.log('='.repeat(70));
                console.log(`📧 Email: ${email}`);
                console.log(`🔗 Link: ${linkRecuperacao}`);
                console.log(`⏰ Válido até: ${expiraEm.toLocaleString()}`);
                console.log('='.repeat(70) + '\n');
                
                res.json({ 
                    message: "Link de recuperação gerado! Verifique o console do servidor." 
                });
            });
        });
    } catch (error) {
        console.error('❌ Erro:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para verificar token e exibir página de reset
app.get("/resetar-senha", (req, res) => {
    const { token } = req.query;
    console.log('🔗 Token recebido para reset:', token);
    
    if (!token) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Token Inválido</title></head>
            <body><h1>Token inválido</h1><a href="/login">Voltar</a></body>
            </html>
        `);
    }
    
    const sql = `
        SELECT * FROM password_resets 
        WHERE token = ? AND usado = FALSE AND expira_em > NOW()
    `;
    
    db.query(sql, [token], (err, results) => {
        if (err) {
            console.error('Erro ao verificar token:', err);
            return res.status(500).send("Erro interno");
        }
        
        if (results.length === 0) {
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Link Inválido - TechCycle</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                        body { background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
                        .card { background: rgba(50,50,50,0.9); border: 1px solid #22D4FD; border-radius: 15px; color: white; text-align: center; padding: 2rem; }
                        .btn { background: #22D4FD; color: black; padding: 0.5rem 1.5rem; border-radius: 8px; text-decoration: none; display: inline-block; margin-top: 1rem; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="card">
                            <h3>🔗 Link Inválido ou Expirado</h3>
                            <p>O link de recuperação é válido por apenas 1 hora.</p>
                            <a href="/login" class="btn">Voltar para o Login</a>
                        </div>
                    </div>
                </body>
                </html>
            `);
        }
        
        // Token válido, mostrar página de reset
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Redefinir Senha - TechCycle</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    body {
                        background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .reset-card {
                        background: rgba(50, 50, 50, 0.95);
                        border: 1px solid #22D4FD;
                        border-radius: 20px;
                        padding: 2rem;
                        width: 100%;
                        max-width: 450px;
                    }
                    .reset-card h3 { color: #22D4FD; text-align: center; margin-bottom: 1.5rem; }
                    .form-control {
                        background: rgba(70, 70, 70, 0.8);
                        border: 1px solid rgba(255,255,255,0.3);
                        border-radius: 10px;
                        color: white;
                        padding: 0.75rem;
                        width: 100%;
                    }
                    .form-control:focus { border-color: #22D4FD; outline: none; }
                    .btn-reset {
                        background: linear-gradient(135deg, #22D4FD 0%, #1e90ff 100%);
                        border: none;
                        border-radius: 10px;
                        padding: 0.75rem;
                        font-weight: 600;
                        color: black;
                        width: 100%;
                        margin-top: 1rem;
                    }
                    .form-label { color: #22D4FD; margin-bottom: 0.5rem; display: block; }
                    .alert { padding: 0.75rem; border-radius: 10px; margin-top: 1rem; }
                    .alert-danger { background: rgba(220,53,69,0.2); color: #ff6b6b; }
                    .alert-success { background: rgba(40,167,69,0.2); color: #90ee90; }
                </style>
            </head>
            <body>
                <div class="reset-card">
                    <h3><i class="fas fa-key me-2"></i>Criar Nova Senha</h3>
                    <form id="resetForm">
                        <input type="hidden" id="token" value="${token}">
                        <div class="mb-3">
                            <label class="form-label">Nova Senha</label>
                            <input type="password" class="form-control" id="novaSenha" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Confirmar Senha</label>
                            <input type="password" class="form-control" id="confirmarSenha" required>
                        </div>
                        <button type="submit" class="btn-reset">Redefinir Senha</button>
                        <div id="message" class="mt-3" style="display: none;"></div>
                    </form>
                    <div class="text-center mt-3">
                        <a href="/login" style="color: #22D4FD;">← Voltar para o login</a>
                    </div>
                </div>
                <script>
                    document.getElementById('resetForm').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const token = document.getElementById('token').value;
                        const senha = document.getElementById('novaSenha').value;
                        const confirmar = document.getElementById('confirmarSenha').value;
                        const messageDiv = document.getElementById('message');
                        
                        if (senha !== confirmar) {
                            messageDiv.style.display = 'block';
                            messageDiv.innerHTML = '<div class="alert alert-danger">As senhas não coincidem!</div>';
                            return;
                        }
                        
                        if (senha.length < 6) {
                            messageDiv.style.display = 'block';
                            messageDiv.innerHTML = '<div class="alert alert-danger">A senha deve ter pelo menos 6 caracteres!</div>';
                            return;
                        }
                        
                        const btn = e.target.querySelector('button');
                        const originalText = btn.innerHTML;
                        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redefinindo...';
                        btn.disabled = true;
                        
                        try {
                            const res = await fetch('/api/resetar-senha', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token, senha })
                            });
                            const data = await res.json();
                            
                            if (res.ok) {
                                messageDiv.style.display = 'block';
                                messageDiv.innerHTML = '<div class="alert alert-success">✓ Senha redefinida! Redirecionando...</div>';
                                setTimeout(() => { window.location.href = '/login'; }, 2000);
                            } else {
                                messageDiv.style.display = 'block';
                                messageDiv.innerHTML = '<div class="alert alert-danger">' + (data.error || 'Erro ao redefinir') + '</div>';
                                btn.innerHTML = originalText;
                                btn.disabled = false;
                            }
                        } catch (error) {
                            messageDiv.style.display = 'block';
                            messageDiv.innerHTML = '<div class="alert alert-danger">Erro na conexão com o servidor</div>';
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                        }
                    });
                </script>
            </body>
            </html>
        `);
    });
});

// Rota para processar a redefinição de senha
app.post("/api/resetar-senha", async (req, res) => {
    const { token, senha } = req.body;
    console.log('🔐 Processando redefinição de senha...');
    
    if (!token || !senha) {
        return res.status(400).json({ error: "Token e senha são obrigatórios" });
    }
    
    if (senha.length < 6) {
        return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres" });
    }
    
    try {
        const sql = `
            SELECT * FROM password_resets 
            WHERE token = ? AND usado = FALSE AND expira_em > NOW()
        `;
        
        db.query(sql, [token], async (err, results) => {
            if (err) {
                console.error('Erro na query:', err);
                return res.status(500).json({ error: "Erro no servidor" });
            }
            
            if (results.length === 0) {
                return res.status(400).json({ error: "Token inválido ou expirado" });
            }
            
            const reset = results[0];
            const email = reset.email;
            const hashedPassword = await bcrypt.hash(senha, 10);
            
            const updateSql = "UPDATE usuarios SET senha = ? WHERE email = ?";
            db.query(updateSql, [hashedPassword, email], (err) => {
                if (err) {
                    console.error('Erro ao atualizar:', err);
                    return res.status(500).json({ error: "Erro ao atualizar senha" });
                }
                
                const markUsedSql = "UPDATE password_resets SET usado = TRUE WHERE id = ?";
                db.query(markUsedSql, [reset.id]);
                
                console.log('✅ Senha redefinida com sucesso para:', email);
                res.json({ message: "Senha redefinida com sucesso!" });
            });
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`\n🚀 SERVIDOR INICIADO COM SUCESSO!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📁 Diretório: ${__dirname}`);
  console.log(`\n📌 Rotas de recuperação de senha:`);
  console.log(`   POST /api/esqueci-senha - Solicitar recuperação`);
  console.log(`   GET  /resetar-senha    - Página de reset`);
  console.log(`   POST /api/resetar-senha - Redefinir senha`);
  console.log(`\n🔍 Teste: http://localhost:${PORT}/login\n`);
});