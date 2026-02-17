require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;  // Render сам задаст PORT (обычно 10000)

// Middleware
app.use(cors({ origin: '*' }));  // ← для продакшена лучше указать конкретный домен фронта
app.use(express.json());

// Логирование всех запросов (полезно в Render Logs)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Отключаем кэширование API-ответов
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Подключение к PostgreSQL (Render-стиль)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // обязательно на Render, иначе SSL ошибка
  },
  // Полезные настройки пула
  max: 20,                       // максимум соединений (подбери под тариф БД)
  idleTimeoutMillis: 30000,      // закрывать idle через 30 сек
  connectionTimeoutMillis: 5000, // таймаут подключения
});

// События пула для отладки
pool.on('connect', () => {
  console.log('→ PostgreSQL: новое подключение установлено');
});

pool.on('error', (err, client) => {
  console.error('Ошибка в пуле PostgreSQL:', err.stack);
});

// Проверка подключения к БД при запуске (очень важно!)
(async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('PostgreSQL → успешно подключено и готово к работе');
    // Опционально: тестовый запрос
    // await client.query('SELECT NOW()');
  } catch (err) {
    console.error('!!! КРИТИЧЕСКАЯ ОШИБКА: НЕ УДАЛОСЬ ПОДКЛЮЧИТЬСЯ К БАЗЕ ДАННЫХ !!!');
    console.error(err.message);
    process.exit(1);  // Завершаем процесс, Render покажет failed deploy
  } finally {
    if (client) client.release();
  }

  // Запускаем сервер ТОЛЬКО после успешной проверки БД
  app.listen(PORT, '0.0.0.0', () => {  // ← 0.0.0.0 обязательно для Render!
    console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
    console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
    console.log(`DATABASE_URL используется: ${!!process.env.DATABASE_URL}`);
  });
})();

// ------------------ Эндпоинты ------------------

app.get('/api/electronics', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name_detail, description, images
      FROM electronic_components
      ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка /api/electronics:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/electronics/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`→ Запрос детали /api/electronics/${id}`);

  try {
    const compRes = await pool.query(
      'SELECT id, name_detail, description, images FROM electronic_components WHERE id = $1',
      [id]
    );

    if (compRes.rows.length === 0) {
      return res.status(404).json({ error: 'Компонент не найден' });
    }

    const component = compRes.rows[0];

    const devicesRes = await pool.query(
      'SELECT id, name_device, parameters, price, images, url_ozon ' +
      'FROM electronic_devices WHERE parent_id = $1 ORDER BY id ASC',
      [id]
    );

    res.json({
      component,
      devices: devicesRes.rows
    });
  } catch (err) {
    console.error(`Ошибка в /api/electronics/${id}:`, err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/mechanics', async (req, res) => {
  console.log('→ Запрос /api/mechanics');
  try {
    const result = await pool.query(`
      SELECT id, name_detail, description, photo, stl, m3d
      FROM mechanical_details
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка /api/mechanics:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Опционально: health-check эндпоинт (Render иногда использует для проверки)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// 404 для неизвестных путей (API-only)
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Запуск сервера уже внутри async-блока выше