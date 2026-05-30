const mysql = require('mysql2');
require('dotenv').config();

// Diagnóstico de ambiente inicial
console.log('\n🔍 --- DIAGNÓSTICO DE AMBIENTE ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL detectada:', process.env.DATABASE_URL ? 'SIM (Inicia com ' + process.env.DATABASE_URL.substring(0, 10) + '...)' : 'NÃO');
console.log('DB_HOST:', process.env.DB_HOST || 'não definido');
console.log('----------------------------------\n');

let dbConfig;

if (process.env.DATABASE_URL) {
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
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    console.log('📡 Configurando Pool para produção (Aiven/SSL)');
  } catch (e) {
    console.error('❌ Erro ao processar DATABASE_URL:', e.message);
    dbConfig = process.env.DATABASE_URL;
  }
} else {
  dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root", 
    password: process.env.DB_PASS || "1608",
    database: process.env.DB_NAME || "techcycle",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  console.log('🏠 Configurando Pool para ambiente local');
}

// Criar Pool em vez de Connection única (mais resiliente para nuvem)
const pool = mysql.createPool(dbConfig);

// Testar conexão inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ ERRO AO OBTER CONEXÃO DO POOL:', err.message);
    console.log('📋 Detalhes técnicos:', {
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState,
      address: err.address,
      port: err.port
    });
  } else {
    console.log('✅ Pool de conexões estabelecido com sucesso!');
    
    connection.query("SHOW TABLES LIKE 'usuarios'", (err, results) => {
      if (err) console.log('❌ Erro ao verificar tabelas:', err.message);
      else if (results.length === 0) console.log('⚠️ AVISO: Tabela "usuarios" NÃO ENCONTRADA no banco.');
      else console.log('✅ Tabela "usuarios" confirmada.');
      
      connection.release(); // Importante: liberar a conexão de volta para o pool
    });
  }
});

// Exportar o pool (mysql2 permite usar .query() direto no pool)
module.exports = pool;
