const mysql = require('mysql');

// Configuração para suportar tanto conexão local quanto string de conexão de produção (Render/Railway)
let dbConfig;

if (process.env.DATABASE_URL) {
  // Se houver DATABASE_URL, usamos ela diretamente (o driver mysql suporta string de conexão)
  dbConfig = process.env.DATABASE_URL;
  
  // Adiciona suporte a SSL se for produção (necessário para Aiven)
  if (process.env.NODE_ENV === 'production') {
    // Para strings de conexão, o driver mysql pode precisar de ajustes ou usar um objeto
    const mysqlUrl = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: mysqlUrl.hostname,
      port: mysqlUrl.port,
      user: mysqlUrl.username,
      password: decodeURIComponent(mysqlUrl.password),
      database: mysqlUrl.pathname.substring(1),
      ssl: { rejectUnauthorized: false }
    };
  }
} else {
  // Configuração local
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root", 
    password: process.env.DB_PASS || "1608",
    database: process.env.DB_NAME || "techcycle"
  };
}

const db = mysql.createConnection(dbConfig);

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
