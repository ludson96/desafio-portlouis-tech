const { Router } = require('express');
const { PedidosController } = require('../controllers');

const router = Router();

const pedidosController = new PedidosController();

router.get('/', pedidosController.getAllPedidos);

module.exports = router;