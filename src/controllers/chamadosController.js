const db = require('../config/db');

// Listar todos os chamados
exports.listarChamados = (req, res) => {
  const sql = `SELECT * FROM chamados ORDER BY criado_em DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Criar novo chamado
exports.criarChamado = (req, res) => {
  const { nome_chamado, tipo, marca, data_abertura, dashboard, problema } = req.body;
  const sql = `INSERT INTO chamados (nome_chamado, tipo, marca, data_abertura, dashboard, problema) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [nome_chamado, tipo, marca, data_abertura, dashboard, problema], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: results.insertId, message: "Chamado criado com sucesso" });
  });
};

// Obter estatísticas
exports.obterEstatisticas = (req, res) => {
  const queries = {
    total: "SELECT COUNT(*) as total FROM chamados",
    pendentes: "SELECT COUNT(*) as pendentes FROM chamados WHERE status = 'Aberto' OR status = 'Pendente' OR status IS NULL",
    concluidos: "SELECT COUNT(*) as concluidos FROM chamados WHERE status = 'Concluído'"
  };

  db.query(queries.total, (err, totalResult) => {
    if (err) return res.status(500).json(err);
    db.query(queries.pendentes, (err, pendentesResult) => {
      if (err) return res.status(500).json(err);
      db.query(queries.concluidos, (err, concluidosResult) => {
        if (err) return res.status(500).json(err);
        
        const total = totalResult[0].total || 0;
        const pendentes = pendentesResult[0].pendentes || 0;
        const concluidos = concluidosResult[0].concluidos || 0;
        const taxaSucesso = total > 0 ? Math.round((concluidos / total) * 100) : 0;
        
        res.json({ total, pendentes, concluidos, taxaSucesso });
      });
    });
  });
};

// Deletar um chamado
exports.deletarChamado = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM chamados WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Chamado não encontrado" });
    res.json({ message: "Chamado deletado com sucesso", deletedId: id });
  });
};

// Deletar todos os chamados
exports.deletarTodosChamados = (req, res) => {
  const sql = "DELETE FROM chamados";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Todos os chamados deletados!", deletedCount: results.affectedRows });
  });
};
