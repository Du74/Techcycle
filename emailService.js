// emailService.js - Versão de teste (mostra o link no console)
const crypto = require('crypto');

// Função para enviar email de recuperação (versão de teste)
async function enviarEmailRecuperacao(email, token, nome = 'usuário') {
    const linkRecuperacao = `http://localhost:3000/resetar-senha?token=${token}`;
    
    console.log('\n' + '='.repeat(60));
    console.log('📧 EMAIL DE RECUPERAÇÃO DE SENHA (TESTE)');
    console.log('='.repeat(60));
    console.log(`👤 Para: ${email}`);
    console.log(`🔗 LINK DE RECUPERAÇÃO:`);
    console.log(linkRecuperacao);
    console.log(`⏰ Válido por: 1 hora`);
    console.log('='.repeat(60) + '\n');
    
    // Retorna true simulando sucesso no envio
    return true;
}

module.exports = { enviarEmailRecuperacao };