const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", 
  password: process.env.DB_PASS || "1608",
  database: process.env.DB_NAME || "techcycle"
});

db.connect(err => {
  if (err) {
    console.error('❌ ERRO DE CONEXÃO MYSQL:', err);
    console.log('📋 Detalhes do erro:');
    console.log('- Código:', err.code);
    console.log('- Mensagem:', err.message);
    console.log('🔧 Verifique:');
    console.log('1. MySQL está rodando?');
    console.log('2. Senha está correta?'); 
    console.log('3. Database "techcycle" existe?');
  } else {
    console.log('✅ Conectado ao MySQL - Database:', process.env.DB_NAME || "techcycle");
    
    // Testar a conexão
    db.query("SELECT 1", (err) => {
      if (err) {
        console.log('❌ Erro ao testar query:', err.message);
      } else {
        console.log('✅ Query de teste funcionando');
      }
    });
  }
});

module.exports = db;
