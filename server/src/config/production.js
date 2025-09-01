/**
 * Configurações específicas para ambiente de produção
 */

const productionConfig = {
  // Configurações de segurança
  security: {
    // Configurações adicionais para o Helmet
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      xssFilter: true,
      noSniff: true,
      hsts: {
        maxAge: 15552000, // 180 dias em segundos
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      referrerPolicy: { policy: 'same-origin' },
    },
    // Configurações para rate limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // limite de 100 requisições por IP
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Muitas requisições deste IP, tente novamente após 15 minutos',
    },
  },

  // Configurações de banco de dados
  database: {
    // Opções adicionais para conexão com MongoDB em produção
    mongoOptions: {
      maxPoolSize: 50, // Aumentar o tamanho do pool para produção
      socketTimeoutMS: 30000, // Timeout de 30 segundos
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutos
      retryWrites: true,
      retryReads: true,
    },
  },

  // Configurações de logging
  logging: {
    // Configurações para o Morgan em produção
    morgan: {
      format: 'combined', // Formato mais detalhado para produção
      options: {
        // Opção para salvar logs em arquivo em produção
        // Requer configuração adicional com winston ou similar
        stream: process.stdout,
      },
    },
  },

  // Configurações de cache
  cache: {
    // Tempo de expiração do cache em segundos
    ttl: 60 * 60, // 1 hora
    // Tamanho máximo do cache em bytes
    maxSize: 1000 * 1024 * 1024, // 1000 MB
  },

  // Configurações de compressão
  compression: {
    // Nível de compressão (0-9)
    level: 6,
    // Threshold em bytes (não comprimir respostas menores que este valor)
    threshold: 1024, // 1KB
  },

  // Configurações de CORS para produção
  cors: {
    // Origens permitidas em produção
    origin: process.env.CORS_ORIGIN || 'https://filamentstashbuddy.com',
    // Métodos permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    // Cabeçalhos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Tempo de cache para preflight requests em segundos
    maxAge: 86400, // 24 horas
  },
};

module.exports = productionConfig;