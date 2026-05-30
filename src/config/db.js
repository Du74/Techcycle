const mysql = require('mysql2');

// Configuração para suportar tanto conexão local quanto string de conexão de produção (Render/Railway)
let dbConfig;

if (process.env.DATABASE_URL) {
  // Se houver DATABASE_URL, usamos ela diretamente (o driver mysql suporta string de conexão)
  dbConfig = process.env.DATABASE_URL;
  
  // Para Aiven e outros serviços gerenciados, o SSL é obrigatório
  try {
    const mysqlUrl = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: mysqlUrl.hostname,
      port: mysqlUrl.port || 3306,
      user: mysqlUrl.username,
      password: decodeURIComponent(mysqlUrl.password),
      database: mysqlUrl.pathname.substring(1),
      ssl: { 
        rejectUnauthorized: false 
      },
      connectTimeout: 10000
    };
  } catch (e) {
    dbConfig = process.env.DATABASE_URL;
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

console.log('🔌 Tentando conectar ao banco de dados...');
if (process.env.DATABASE_URL) {
  console.log('📡 Usando DATABASE_URL (Produção/Aiven)');
} else {
  console.log('🏠 Usando configurações locais');
}

db.connect(err => {
  if (err) {
    console.error('❌ ERRO CRÍTICO DE CONEXÃO MYSQL:', err);
    console.log('📋 Detalhes técnicos do erro:');
    console.log('- Código:', err.code);
    console.log('- Estado SQL:', err.sqlState);
    console.log('- Fatal:', err.fatal);
    console.log('- Mensagem:', err.message);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('🔑 Erro de autenticação: Verifique usuário e senha.');
    } else if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.log('🌐 Erro de rede: Verifique o host e se o banco está acessível.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.log('📂 Banco de dados não encontrado: Verifique se o database "techcycle" foi criado.');
    }
  } else {
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar se as tabelas existem
    db.query("SHOW TABLES LIKE 'usuarios'", (err, results) => {
      if (err) {
        console.log('❌ Erro ao verificar tabelas:', err.message);
      } else if (results.length === 0) {
        console.log('⚠️ AVISO: A tabela "usuarios" não foi encontrada. Você importou o arquivo banco.sql?');
      } else {
        console.log('✅ Tabela "usuarios" detectada.');
      }
    });
    
    db.query("SELECT 1", (err) => {
      if (err) {
        console.log('❌ Erro na query de teste SELECT 1:', err.message);
      } else {
        console.log('✅ Query de teste (SELECT 1) concluída com sucesso.');
      }
    });
  }
});

module.exports = db;
