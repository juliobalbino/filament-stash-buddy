const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definição do schema para filamentos
const filamentSchema = new Schema({
  marca: {
    type: String,
    required: [true, 'A marca do filamento é obrigatória'],
    trim: true
  },
  material: {
    type: String,
    required: [true, 'O material do filamento é obrigatório'],
    enum: {
      values: ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon', 'ASA', 'HIPS', 'Wood', 'Carbon Fiber'],
      message: '{VALUE} não é um material válido'
    },
    trim: true
  },
  cor: {
    type: String,
    required: [true, 'A cor do filamento é obrigatória'],
    trim: true
  },
  corRgb: {
    type: String,
    required: [true, 'O código RGB da cor é obrigatório'],
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Formato de cor RGB inválido (ex: #RRGGBB)']
  },
  quantidade: {
    type: Number,
    required: [true, 'A quantidade de rolos é obrigatória'],
    min: [0, 'A quantidade não pode ser negativa'],
    default: 0
  },
  pesoCarretel: {
    type: Number,
    min: [0, 'O peso do carretel não pode ser negativo']
  },
  pesoFilamento: {
    type: Number,
    min: [0, 'O peso do filamento não pode ser negativo']
  },
  pesoRolo: {
    type: Number,
    min: [0, 'O peso total do rolo não pode ser negativo']
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { 
    createdAt: 'dataCriacao', 
    updatedAt: 'dataAtualizacao' 
  },
  versionKey: false,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

// Middleware para atualizar a data de atualização antes de salvar
filamentSchema.pre('save', function(next) {
  this.dataAtualizacao = Date.now();
  next();
});

// Método para calcular o peso restante do filamento
filamentSchema.methods.calcularPesoRestante = function() {
  if (this.pesoRolo && this.pesoCarretel) {
    return this.pesoRolo - this.pesoCarretel;
  }
  return this.pesoFilamento;
};

// Método estático para encontrar filamentos com estoque baixo
filamentSchema.statics.encontrarEstoqueBaixo = function(limite = 1) {
  return this.find({ quantidade: { $lte: limite } });
};

// Método estático para encontrar filamentos por material
filamentSchema.statics.encontrarPorMaterial = function(material) {
  return this.find({ material });
};

// Método estático para encontrar filamentos por marca
filamentSchema.statics.encontrarPorMarca = function(marca) {
  return this.find({ marca });
};

// Índices para melhorar a performance das consultas
filamentSchema.index({ marca: 1 });
filamentSchema.index({ material: 1 });
filamentSchema.index({ quantidade: 1 });

const Filament = mongoose.model('Filament', filamentSchema);

module.exports = Filament;