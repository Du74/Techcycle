const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');

// Rotas de chamados
router.get('/chamados', chamadosController.listarChamados);
router.post('/chamados', chamadosController.criarChamado);
router.get('/estatisticas', chamadosController.obterEstatisticas);
router.delete('/chamados/:id', chamadosController.deletarChamado);
router.delete('/chamados', chamadosController.deletarTodosChamados);

module.exports = router;
