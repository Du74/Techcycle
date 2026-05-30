const db = require('../config/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Registrar novo usuário
exports.register = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

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
};

// Fazer login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

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
};

// Solicitar recuperação de senha
exports.solicitarRecuperacao = async (req, res) => {
  const { email } = req.body;
  console.log('\n🔵 ===== RECUPERAÇÃO DE SENHA =====');
  console.log('📧 Email recebido:', email);
  
  if (!email) {
    return res.status(400).json({ error: "Email é obrigatório" });
  }
  
  try {
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
};

// Verificar token e exibir página de reset
exports.verificarToken = (req, res) => {
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
          .form-control { background: rgba(255,255,255,0.1); border: 1px solid #22D4FD; color: white; }
          .form-control::placeholder { color: rgba(255,255,255,0.5); }
          .btn-reset { background: #22D4FD; color: black; font-weight: bold; }
          .btn-reset:hover { background: #1aa8d4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="reset-card">
            <h3>🔐 Redefinir Senha</h3>
            <form id="resetForm">
              <div class="mb-3">
                <label for="novaSenha" class="form-label" style="color: white;">Nova Senha</label>
                <input type="password" class="form-control" id="novaSenha" required>
              </div>
              <div class="mb-3">
                <label for="confirmarSenha" class="form-label" style="color: white;">Confirmar Senha</label>
                <input type="password" class="form-control" id="confirmarSenha" required>
              </div>
              <button type="submit" class="btn btn-reset w-100">Redefinir Senha</button>
            </form>
          </div>
        </div>
        <script>
          document.getElementById('resetForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const novaSenha = document.getElementById('novaSenha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            if (novaSenha !== confirmarSenha) {
              alert('As senhas não coincidem!');
              return;
            }
            
            const response = await fetch('/api/resetar-senha', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: '${token}', novaSenha })
            });
            
            const data = await response.json();
            if (response.ok) {
              alert('Senha redefinida com sucesso!');
              window.location.href = '/login';
            } else {
              alert('Erro: ' + data.error);
            }
          });
        </script>
      </body>
      </html>
    `);
  });
};

// Resetar senha
exports.resetarSenha = async (req, res) => {
  const { token, novaSenha } = req.body;
  
  if (!token || !novaSenha) {
    return res.status(400).json({ error: "Token e nova senha são obrigatórios" });
  }
  
  try {
    const sql = `
      SELECT * FROM password_resets 
      WHERE token = ? AND usado = FALSE AND expira_em > NOW()
    `;
    
    db.query(sql, [token], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro no servidor" });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ error: "Token inválido ou expirado" });
      }
      
      const reset = results[0];
      const hashedPassword = await bcrypt.hash(novaSenha, 10);
      
      // Atualizar senha do usuário
      const updateSql = "UPDATE usuarios SET senha = ? WHERE email = ?";
      db.query(updateSql, [hashedPassword, reset.email], (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao atualizar senha" });
        }
        
        // Marcar token como usado
        const markUsedSql = "UPDATE password_resets SET usado = TRUE WHERE token = ?";
        db.query(markUsedSql, [token], (err) => {
          if (err) {
            console.error('Erro ao marcar token como usado:', err);
          }
          res.json({ message: "Senha redefinida com sucesso!" });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
