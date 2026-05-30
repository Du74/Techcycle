const path = require('path');
const fs = require('fs');

// Função auxiliar para enviar HTML
function sendHTML(res, filename) {
  const filePath = path.join(__dirname, '../../views', filename);
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

// Página inicial
exports.home = (req, res) => {
  console.log("🏠 Rota / solicitada");
  sendHTML(res, 'introducao_techcycle.html');
};

// Página de login
exports.login = (req, res) => {
  console.log("🔐 Rota /login solicitada");
  sendHTML(res, 'login.html');
};

// Página de registro
exports.register = (req, res) => {
  console.log("📝 Rota /register solicitada");
  sendHTML(res, 'register.html');
};

// Página de dashboard
exports.dashboard = (req, res) => {
  console.log("📊 Rota /dashboard solicitada");
  sendHTML(res, 'dashboard.html');
};

// Página de novo chamado
exports.novoChamado = (req, res) => {
  console.log("➕ Rota /novo-chamado solicitada");
  sendHTML(res, 'novo-chamado.html');
};

// Página de relatórios
exports.relatorios = (req, res) => {
  console.log("📈 Rota /relatorios solicitada");
  sendHTML(res, 'relatorios.html');
};

// Página de configurações
exports.configuracoes = (req, res) => {
  console.log("⚙️ Rota /configuracoes solicitada");
  sendHTML(res, 'configuracoes.html');
};

// Página sobre
exports.about = (req, res) => {
  console.log("ℹ️ Rota /about solicitada");
  sendHTML(res, 'about.html');
};
