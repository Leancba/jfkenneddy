const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers

const notices = require('./Notices');
const login = require('./Login')

// Ejemplo: router.use('/auth', authRouter);

router.use('/notices', notices);
router.use('/login', login);





module.exports = router;
