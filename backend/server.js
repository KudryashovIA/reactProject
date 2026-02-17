require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Отключаем кэширование для API
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Подключение к PostgreSQL (для Render — используем DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // обязательно для Render
  },
  // Настройки пула (можно подстроить под нагрузку)
  max: 20,                    // максимум соединений
  idleTimeoutMillis: 30000,   // закрывать неактивные через 30 сек
  connectionTimeoutMillis: 5000, // ждать подключения не дольше 5 сек
});

// Логируем события пула
pool.on('connect', () => {
  console.log('→ Подключение к PostgreSQL установлено');
});

pool.on('error', (err, client) => {
  console.error('Ошибка в пуле PostgreSQL:', err.stack);
});

// Проверка подключения при запуске сервера
(async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('PostgreSQL → успешно подключено');
    // Можно выполнить тестовый запрос, если хочется
    // await client.query('SELECT NOW()');
  } catch (err) {
    console.error('!!! НЕ УДАЛОСЬ ПОДКЛЮЧИТЬСЯ К БАЗЕ ДАННЫХ !!!');
    console.error(err.message);
    process.exit(1); // завершаем процесс, если база недоступна
  } finally {
    if (client) client.release();
  }

  // Запускаем сервер только после успешной проверки
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
  });
})();

// Эндпоинты
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
  console.log(`→ Запрос к /api/electronics/${id}`);

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
  console.log('→ Запрос к /api/mechanics');
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

// Раздача фронтенда (Vite/React и т.п.)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// SPA fallback — все остальные пути отдаём index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), (err) => {
    if (err) {
      console.error('Ошибка отдачи index.html:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  });
});