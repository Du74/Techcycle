// Testes de integração - API

const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mockDb = { query: jest.fn() };

// Rotas
app.get('/chamados', (req, res) => {
    mockDb.query('SELECT * FROM chamados', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results || []);
    });
});

app.post('/chamados', (req, res) => {
    const { nome_chamado, tipo, marca, data_abertura, dashboard, problema } = req.body;
    
    if (!nome_chamado || !tipo || !marca || !data_abertura || !problema) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    
    mockDb.query('INSERT INTO chamados VALUES (?,?,?,?,?,?)', 
        [nome_chamado, tipo, marca, data_abertura, dashboard, problema], 
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: results?.insertId || 1, message: "Chamado criado com sucesso" });
        });
});

app.get('/estatisticas', (req, res) => {
    mockDb.query("SELECT COUNT(*) as total FROM chamados", (err, totalResult) => {
        if (err) return res.status(500).json(err);
        const total = totalResult?.[0]?.total || 0;
        res.json({ total, pendentes: 0, concluidos: 0, taxaSucesso: 0 });
    });
});

app.delete('/chamados/:id', (req, res) => {
    mockDb.query("DELETE FROM chamados WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results?.affectedRows === 0) {
            return res.status(404).json({ message: "Chamado não encontrado" });
        }
        res.json({ message: "Chamado deletado com sucesso" });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    res.json({ message: "Login bem-sucedido!" });
});

app.post('/register', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }
    if (senha.length < 6) {
        return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
    }
    res.json({ message: "Usuário registrado com sucesso!" });
});

describe('Testes de Integração - API', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /chamados', () => {
        test('deve retornar status 200 e array de chamados', async () => {
            mockDb.query.mockImplementation((sql, callback) => {
                callback(null, [{ id: 1, nome_chamado: 'Impressora' }]);
            });
            const res = await request(app).get('/chamados');
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        test('deve retornar 500 se houver erro no banco', async () => {
            mockDb.query.mockImplementation((sql, callback) => {
                callback(new Error('Erro no banco'), null);
            });
            const res = await request(app).get('/chamados');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /chamados', () => {
        test('deve criar um novo chamado com dados válidos', async () => {
            const novoChamado = {
                nome_chamado: 'Notebook Teste',
                tipo: 'Notebook',
                marca: 'Dell',
                data_abertura: '2024-01-01',
                dashboard: 'Sala 101',
                problema: 'Não liga'
            };
            mockDb.query.mockImplementation((sql, params, callback) => {
                callback(null, { insertId: 99 });
            });
            const res = await request(app).post('/chamados').send(novoChamado);
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Chamado criado com sucesso');
        });

        test('deve retornar 400 se faltar campos obrigatórios', async () => {
            const res = await request(app).post('/chamados').send({ nome_chamado: 'Teste' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /login', () => {
        test('deve fazer login com credenciais válidas', async () => {
            const res = await request(app).post('/login').send({
                email: 'teste@email.com',
                senha: '123456'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Login bem-sucedido!');
        });
    });

    describe('POST /register', () => {
        test('deve registrar um novo usuário', async () => {
            const res = await request(app).post('/register').send({
                email: 'novo@email.com',
                senha: '123456'
            });
            expect(res.statusCode).toBe(200);
        });

        test('deve retornar 400 se senha for muito curta', async () => {
            const res = await request(app).post('/register').send({
                email: 'teste@email.com',
                senha: '123'
            });
            expect(res.statusCode).toBe(400);
        });
    });
});
