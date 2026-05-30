require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const chamadosRoutes = require('./routes/chamados.routes');
const pagesRoutes = require('./routes/pages.routes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Log de requisições (apenas em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
  });
}

// ==================== DIAGNÓSTICO ====================
console.log("🔍 DIAGNÓSTICO DO SERVIDOR:");
console.log("📁 Diretório atual:", __dirname);

// Verificar se as pastas existem
const folders = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../public/css'),
  path.join(__dirname, '../public/js'),
  path.join(__dirname, '../views')
];

folders.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`✅ ${folder} - EXISTE`);
    try {
      const files = fs.readdirSync(folder);
      console.log(`   📄 Arquivos: ${files.join(', ')}`);
    } catch (e) {
      console.log(`   📄 (sem arquivos)`);
    }
  } else {
    console.log(`❌ ${folder} - NÃO EXISTE`);
  }
});

// ==================== ROTAS ====================
// Rotas de autenticação
app.use('/', authRoutes);

// Rotas de chamados (API)
app.use('/', chamadosRoutes);

// Rotas de páginas (deve ser por último para não conflitar)
app.use('/', pagesRoutes);

// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
