const Filament = require('../models/filament.model');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

/**
 * @desc    Obter todos os filamentos
 * @route   GET /api/filaments
 * @access  Public
 */
exports.getFilaments = async (req, res, next) => {
  try {
    // Parâmetros de consulta para filtragem
    const { marca, material, cor, quantidade } = req.query;
    const queryObj = {};

    // Aplicar filtros se fornecidos
    if (marca) queryObj.marca = { $regex: marca, $options: 'i' };
    if (material) queryObj.material = material;
    if (cor) queryObj.cor = { $regex: cor, $options: 'i' };
    if (quantidade) queryObj.quantidade = { $gte: parseInt(quantidade) };

    const filaments = await Filament.find(queryObj).sort({ dataCriacao: -1 });

    res.status(200).json({
      success: true,
      count: filaments.length,
      data: filaments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter um filamento pelo ID
 * @route   GET /api/filaments/:id
 * @access  Public
 */
exports.getFilamentById = async (req, res, next) => {
  try {
    const filament = await Filament.findById(req.params.id);

    if (!filament) {
      return res.status(404).json({
        success: false,
        error: 'Filamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: filament
    });
  } catch (error) {
    // Verificar se o erro é devido a um ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }
    next(error);
  }
};

/**
 * @desc    Criar um novo filamento
 * @route   POST /api/filaments
 * @access  Public
 */
exports.createFilament = async (req, res, next) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const filament = await Filament.create(req.body);

    res.status(201).json({
      success: true,
      data: filament
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualizar um filamento
 * @route   PUT /api/filaments/:id
 * @access  Public
 */
exports.updateFilament = async (req, res, next) => {
  try {
    // Verificar erros de validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Garantir que o ID seja uma string válida do MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }

    const filament = await Filament.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!filament) {
      return res.status(404).json({
        success: false,
        error: 'Filamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: filament
    });
  } catch (error) {
    // Verificar se o erro é devido a um ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }
    next(error);
  }
};

/**
 * @desc    Excluir um filamento
 * @route   DELETE /api/filaments/:id
 * @access  Public
 */
exports.deleteFilament = async (req, res, next) => {
  try {
    // Garantir que o ID seja uma string válida do MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }

    const filament = await Filament.findByIdAndDelete(req.params.id);

    if (!filament) {
      return res.status(404).json({
        success: false,
        error: 'Filamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    // Verificar se o erro é devido a um ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }
    next(error);
  }
};

/**
 * @desc    Atualizar a quantidade de um filamento
 * @route   PATCH /api/filaments/:id/quantidade
 * @access  Public
 */
exports.updateQuantity = async (req, res, next) => {
  try {
    // Garantir que o ID seja uma string válida do MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }

    const { quantidade } = req.body;

    if (quantidade === undefined) {
      return res.status(400).json({
        success: false,
        error: 'A quantidade é obrigatória'
      });
    }

    const filament = await Filament.findByIdAndUpdate(
      req.params.id,
      { quantidade: Math.max(0, parseInt(quantidade)) },
      { new: true, runValidators: true }
    );

    if (!filament) {
      return res.status(404).json({
        success: false,
        error: 'Filamento não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: filament
    });
  } catch (error) {
    // Verificar se o erro é devido a um ID inválido
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID de filamento inválido'
      });
    }
    next(error);
  }
};

/**
 * @desc    Obter estatísticas de filamentos
 * @route   GET /api/filaments/stats
 * @access  Public
 */
exports.getFilamentStats = async (req, res, next) => {
  try {
    const total = await Filament.countDocuments();
    const lowStock = await Filament.countDocuments({ quantidade: { $lte: 1 } });
    const outOfStock = await Filament.countDocuments({ quantidade: 0 });
    const totalRolls = await Filament.aggregate([
      { $group: { _id: null, total: { $sum: '$quantidade' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        lowStock,
        outOfStock,
        totalRolls: totalRolls.length > 0 ? totalRolls[0].total : 0
      }
    });
  } catch (error) {
    next(error);
  }
};