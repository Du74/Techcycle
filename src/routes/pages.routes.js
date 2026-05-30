const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');

// Rotas de páginas
router.get('/', pagesController.home);
router.get('/login', pagesController.login);
router.get('/login.html', pagesController.login);
router.get('/register', pagesController.register);
router.get('/register.html', pagesController.register);
router.get('/dashboard', pagesController.dashboard);
router.get('/dashboard.html', pagesController.dashboard);
router.get('/novo-chamado', pagesController.novoChamado);
router.get('/novo-chamado.html', pagesController.novoChamado);
router.get('/relatorios', pagesController.relatorios);
router.get('/relatorios.html', pagesController.relatorios);
router.get('/configuracoes', pagesController.configuracoes);
router.get('/configuracoes.html', pagesController.configuracoes);
router.get('/about', pagesController.about);
router.get('/about.html', pagesController.about);
router.get('/introducao_techcycle.html', pagesController.home);

module.exports = router;
