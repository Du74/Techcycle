# Guia de Deploy na Render com Aiven

Este documento descreve como fazer o deploy do TechCycle na Render usando Aiven para o banco de dados MySQL.

## 📋 Pré-requisitos

1. Conta na [Render](https://render.com)
2. Conta na [Aiven](https://aiven.io)
3. Repositório Git com o código do TechCycle
4. Banco de dados MySQL criado no Aiven

## 🗄️ Configurar Banco de Dados no Aiven

### 1. Criar Serviço MySQL no Aiven

1. Acesse [console.aiven.io](https://console.aiven.io)
2. Clique em "Create Service"
3. Selecione "MySQL"
4. Configure:
   - **Service name**: `techcycle-db` (ou outro nome)
   - **Cloud provider**: Escolha a região desejada
   - **Plan**: Selecione o plano (ex: Startup-4)
5. Clique em "Create Service"

### 2. Obter a String de Conexão

1. Após o serviço estar pronto, acesse a aba "Connection"
2. Copie a **Connection String** (formato: `mysql://...`)
3. Você pode encontrá-la também em "Connection info" > "JDBC"

### 3. Criar o Banco de Dados

1. Na aba "Databases", clique em "Create Database"
2. Digite: `techcycle`
3. Clique em "Create"

### 4. Importar o Schema

1. Acesse a aba "Users" e crie um usuário (ou use o padrão `avnadmin`)
2. Use uma ferramenta como MySQL Workbench ou CLI para conectar:
   ```bash
   mysql -h seu-host.aivencloud.com -P 3306 -u avnadmin -p techcycle < banco.sql
   ```

## 🚀 Deploy na Render

### 1. Preparar o Repositório

1. Certifique-se de que o `.env` não está no Git (verifique `.gitignore`)
2. Faça commit de todas as alterações:
   ```bash
   git add .
   git commit -m "Preparar para deploy na Render"
   git push
   ```

### 2. Criar Web Service na Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em "New +" > "Web Service"
3. Conecte seu repositório Git
4. Configure:
   - **Name**: `techcycle`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Escolha o plano desejado

### 3. Adicionar Variáveis de Ambiente

1. Na página do serviço, vá para "Environment"
2. Adicione as seguintes variáveis:

```
PORT=3000
NODE_ENV=production
DATABASE_URL=mysql://usuario:senha@seu-host.aivencloud.com:3306/techcycle
```

**Importante**: Substitua `usuario`, `senha` e `seu-host` pelos valores do Aiven.

### 4. Deploy

1. Clique em "Create Web Service"
2. A Render iniciará o build automaticamente
3. Aguarde até que o status seja "Live"

## ✅ Verificar o Deploy

1. Acesse a URL fornecida pela Render (ex: `https://techcycle.onrender.com`)
2. Teste a funcionalidade:
   - Registre um novo usuário
   - Faça login
   - Teste o tema claro/escuro
   - Crie um chamado

## 🔧 Solução de Problemas

### Erro de Conexão com Banco de Dados

**Sintoma**: Erro 500 ao tentar registrar ou fazer login

**Solução**:
1. Verifique se `DATABASE_URL` está corretamente configurada
2. Certifique-se de que o banco de dados `techcycle` foi criado no Aiven
3. Verifique se o schema foi importado: `mysql -h ... -u ... -p techcycle < banco.sql`

### Tema Claro/Escuro Não Funciona

**Sintoma**: Botão de tema não alterna entre claro e escuro

**Solução**:
- Este problema foi corrigido na V2.0
- Certifique-se de que está usando a versão mais recente do código

### SSL Error

**Sintoma**: Erro `PROTOCOL_CONNECTION_LOST` ou `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

**Solução**:
- A configuração de SSL foi melhorada na V2.0
- Certifique-se de que `NODE_ENV=production` está definido

## 📊 Monitoramento

1. Na página do serviço Render, acesse "Logs" para ver os logs da aplicação
2. Verifique se há erros de conexão ou outros problemas
3. Use o console do navegador (F12) para verificar erros do frontend

## 🔄 Atualizações Futuras

Para fazer deploy de novas versões:

1. Faça as alterações no código
2. Commit e push para o repositório:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push
   ```
3. A Render detectará as alterações e fará o redeploy automaticamente

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs da Render
- Consulte a documentação do Aiven
- Abra uma issue no repositório
