const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/api/esqueci-senha', authController.solicitarRecuperacao);
router.get('/resetar-senha', authController.verificarToken);
router.post('/api/resetar-senha', authController.resetarSenha);

module.exports = router;
