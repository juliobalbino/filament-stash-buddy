const express = require('express');
const { check } = require('express-validator');
const filamentController = require('../controllers/filament.controller');

const router = express.Router();

// Validações para criação e atualização de filamentos
const filamentValidation = [
  check('marca')
    .notEmpty()
    .withMessage('A marca do filamento é obrigatória')
    .trim(),
  
  check('material')
    .notEmpty()
    .withMessage('O material do filamento é obrigatório')
    .isIn(['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'ASA', 'HIPS', 'Wood', 'Carbon Fiber'])
    .withMessage('Material inválido')
    .trim(),
  
  check('cor')
    .notEmpty()
    .withMessage('A cor do filamento é obrigatória')
    .trim(),
  
  check('corRgb')
    .notEmpty()
    .withMessage('O código RGB da cor é obrigatório')
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Formato de cor RGB inválido (ex: #RRGGBB)'),
  
  check('quantidade')
    .notEmpty()
    .withMessage('A quantidade de rolos é obrigatória')
    .isInt({ min: 0 })
    .withMessage('A quantidade deve ser um número inteiro não negativo'),
  
  check('pesoCarretel')
    .optional()
    .isInt({ min: 0 })
    .withMessage('O peso do carretel deve ser um número inteiro não negativo'),
  
  check('pesoFilamento')
    .optional()
    .isInt({ min: 0 })
    .withMessage('O peso do filamento deve ser um número inteiro não negativo'),
  
  check('pesoRolo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('O peso total do rolo deve ser um número inteiro não negativo')
];

// Rota para obter estatísticas
router.get('/stats', filamentController.getFilamentStats);

// Rotas para operações CRUD
router.route('/')
  .get(filamentController.getFilaments)
  .post(filamentValidation, filamentController.createFilament);

router.route('/:id')
  .get(filamentController.getFilamentById)
  .put(filamentValidation, filamentController.updateFilament)
  .delete(filamentController.deleteFilament);

// Rota para atualizar apenas a quantidade
router.patch('/:id/quantidade', [
  check('quantidade')
    .notEmpty()
    .withMessage('A quantidade é obrigatória')
    .isInt({ min: 0 })
    .withMessage('A quantidade deve ser um número inteiro não negativo')
], filamentController.updateQuantity);

module.exports = router;