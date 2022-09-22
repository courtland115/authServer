const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlelwares/validar-campos');
const { validarJWT } = require('../middlelwares/validar-jwt');

const router = Router();

//CREAR UN NUEVO USUARIO
router.post('/new', [
    check('name', 'El name es Obligatorio').not().isEmpty(),
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es obligatoria').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

//login de usuario
router.post('/', [
    check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es obligatoria').isLength({ min: 6 }),
    validarCampos
] ,loginUsuario);

//Validar y re validar token
router.get('/renew', validarJWT, revalidarToken);



module.exports = router;