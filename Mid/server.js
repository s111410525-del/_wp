const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3000;

async function translateText(text, targetLang = 'zh-TW') {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text.substring(0, 500),
        langpair: 'en|' + targetLang
      },
      timeout: 10000
    });
    if (response.data && response.data.responseData) {
      return response.data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error.message);
    return text;
  }
}

let db;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function fetchNewsFromSource(name, url, limit = 8) {
  try {
    const response = await axios.get(url, { timeout: 15000 });
    const xml = response.data;
    const items = [];
    const itemRegex = /<item>([\s\S?]*?)<\/item>/g;
    let match;
    let count = 0;
    while ((match = itemRegex.exec(xml)) !== null && count < limit) {
      const item = match[1];
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      if (titleMatch) {
        let link = linkMatch ? linkMatch[1] : '';
        link = link.replace(/^http:\/\//, 'https://');
        items.push({
          title: titleMatch[1].replace(/<[^>]+>/g, '').trim(),
          description: descMatch ? descMatch[1].replace(/<[^>]+>/g, '').substring(0, 300).trim() : '',
          link: link,
          pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
          source: name
        });
        count++;
      }
    }
    return items;
  } catch (error) {
    console.error(`Fetch news from ${name} error:`, error.message);
    return [];
  }
}

async function fetchNews() {
  const sources = [
    { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
    { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss' },
    { name: 'Reuters', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best' },
    { name: ' NPR', url: 'https://feeds.npr.org/1001/rss.xml' },
    { name: 'ABC News', url: 'https://abcnews.go.com/abcnews/topstories.rss' }
  ];
  
  const allNews = [];
  for (const source of sources) {
    const news = await fetchNewsFromSource(source.name, source.url, 6);
    allNews.push(...news);
    await new Promise(r => setTimeout(r, 500));
  }
  return allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

async function refreshNews() {
  const newsArticles = await fetchNews();
  newsArticles.forEach(news => {
    const existing = db.exec("SELECT id FROM posts WHERE title = ? AND is_news = 1", [news.title]);
    if (!existing[0] || existing[0].values.length === 0) {
      db.run('INSERT INTO posts (title, content, is_news, news_link, created_at, news_source) VALUES (?, ?, 1, ?, ?, ?)', 
        [news.title, news.description, news.link, news.pubDate, news.source]);
    }
  });
  const newsPosts = db.exec("SELECT id, created_at FROM posts WHERE is_news = 1 ORDER BY created_at DESC");
  if (newsPosts[0] && newsPosts[0].values.length > 30) {
    const postsToDelete = newsPosts[0].values.slice(30).map(r => r[0]);
    postsToDelete.forEach(id => {
      db.run('DELETE FROM posts WHERE id = ?', [id]);
    });
  }
  saveDB();
}

setInterval(refreshNews, 5 * 60 * 1000);

async function initDB() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'blog.db');
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
    try { db.run('ALTER TABLE users ADD COLUMN warnings INTEGER DEFAULT 0'); } catch(e) {}
    try { db.run('ALTER TABLE users ADD COLUMN suspended_until DATETIME DEFAULT NULL'); } catch(e) {}
    try { db.run('ALTER TABLE posts ADD COLUMN user_id INTEGER'); } catch(e) {}
    try { db.run('ALTER TABLE posts ADD COLUMN is_news INTEGER DEFAULT 0'); } catch(e) {}
    try { db.run('ALTER TABLE posts ADD COLUMN news_link TEXT'); } catch(e) {}
    try { db.run('ALTER TABLE posts ADD COLUMN news_source TEXT'); } catch(e) {}
    if (!db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='likes'")[0]) {
      db.run('CREATE TABLE likes (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, user_id INTEGER, UNIQUE(post_id, user_id))');
    }
    if (!db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='comments'")[0]) {
      db.run('CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, user_id INTEGER, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
    }
    if (!db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='reports'")[0]) {
      db.run('CREATE TABLE reports (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, reporter_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
    }
    if (!db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='favorites'")[0]) {
      db.run('CREATE TABLE favorites (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER, user_id INTEGER, UNIQUE(post_id, user_id))');
    }
    saveDB();
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        warnings INTEGER DEFAULT 0,
        suspended_until DATETIME DEFAULT NULL
      );
      CREATE TABLE posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_news INTEGER DEFAULT 0,
        news_link TEXT,
        news_source TEXT
      );
      CREATE TABLE likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        UNIQUE(post_id, user_id)
      );
      CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        reporter_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        user_id INTEGER,
        UNIQUE(post_id, user_id)
      );
    `);
    const hash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hash]);
    saveDB();
  }
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(path.join(__dirname, 'blog.db'), buffer);
}

app.get('/', async (req, res) => {
  const posts = db.exec('SELECT p.*, u.username, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
  const data = posts[0] ? posts[0].values.map(row => ({
    id: row[0], user_id: row[1], title: row[2], content: row[3], created_at: row[4], username: row[5], like_count: row[6], is_news: row[7], news_link: row[8], news_source: row[9]
  })) : [];
  const userLikes = req.session.user ? db.exec('SELECT post_id FROM likes WHERE user_id = ?', [req.session.user.id]) : null;
  const likedPosts = userLikes && userLikes[0] ? userLikes[0].values.map(r => r[0]) : [];
  const userFavorites = req.session.user ? db.exec('SELECT post_id FROM favorites WHERE user_id = ?', [req.session.user.id]) : null;
  const favoritePosts = userFavorites && userFavorites[0] ? userFavorites[0].values.map(r => r[0]) : [];
  
  await refreshNews();
  
  const allPosts = db.exec('SELECT p.*, u.username, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC');
  const allData = allPosts[0] ? allPosts[0].values.map(row => ({
    id: row[0], user_id: row[1], title: row[2], content: row[3], created_at: row[4], username: row[5], like_count: row[6], is_news: row[7], news_link: row[8], news_source: row[9]
  })) : [];
  
  res.render('index', { posts: allData, user: req.session.user, likedPosts, favoritePosts });
});

app.get('/post/:id', async (req, res) => {
  const post = db.exec('SELECT p.*, u.username, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?', [req.params.id]);
  if (post[0] && post[0].values.length > 0) {
    const row = post[0].values[0];
    const comments = db.exec('SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC', [req.params.id]);
    const commentData = comments[0] ? comments[0].values.map(r => ({
      id: r[0], user_id: r[2], content: r[3], created_at: r[4], username: r[5]
    })) : [];
    const likeCount = db.exec('SELECT COUNT(*) FROM likes WHERE post_id = ?', [req.params.id]);
const isLiked = req.session.user ? db.exec('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]) : null;
    const isFavorited = req.session.user ? db.exec('SELECT * FROM favorites WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]) : null;
    
    if (req.query.lang === 'zh') {
      translatedTitle = await translateText(row[2], 'zh-TW');
      translatedContent = await translateText(row[3], 'zh-TW');
      isTranslated = true;
    }
    
    res.render('post', { 
      post: { id: row[0], user_id: row[1], title: translatedTitle, content: translatedContent, created_at: row[4], username: row[5], like_count: row[6], is_news: row[7], news_link: row[8], news_source: row[9], original_title: row[2], original_content: row[3] }, 
      user: req.session.user, 
      comments: commentData,
      likeCount: likeCount[0] ? likeCount[0].values[0][0] : 0,
      isLiked: isLiked && isLiked[0] && isLiked[0].values.length > 0,
      isFavorited: isFavorited && isFavorited[0] && isFavorited[0].values.length > 0,
      isTranslated
    });
  } else {
    res.redirect('/');
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.exec('SELECT * FROM users WHERE username = ?', [username]);
  if (user[0] && user[0].values.length > 0) {
    const row = user[0].values[0];
    if (bcrypt.compareSync(password, row[2])) {
      if (row[4] && new Date(row[4]) > new Date()) {
        return res.render('login', { error: '此帳號已被停用至 ' + new Date(row[4]).toLocaleString('zh-TW') });
      }
      req.session.user = { id: row[0], username: row[1] };
      return res.redirect('/');
    }
  }
  res.render('login', { error: '帳號或密碼錯誤' });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
  
  if (password.length <= 8) {
    return res.render('register', { error: '密碼必須大於8個字' });
  }
  
  if (!passwordRegex.test(password)) {
    return res.render('register', { error: '密碼只能包含英文和符號' });
  }
  
  if (password !== confirmPassword) {
    return res.render('register', { error: '兩次密碼輸入不一致' });
  }
  
  const existingUser = db.exec('SELECT * FROM users WHERE username = ?', [username]);
  if (existingUser[0] && existingUser[0].values.length > 0) {
    return res.render('register', { error: '帳號已存在' });
  }
  
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
  saveDB();
  res.redirect('/login');
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/new', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('new', { user: req.session.user });
});

app.post('/new', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const userStatus = db.exec('SELECT suspended_until FROM users WHERE id = ?', [req.session.user.id]);
  if (userStatus[0] && userStatus[0].values[0][0]) {
    const until = new Date(userStatus[0].values[0][0]);
    if (until > new Date()) {
      return res.redirect('/?error=suspended');
    }
  }
  const { title, content } = req.body;
  db.run('INSERT INTO posts (user_id, title, content, is_news) VALUES (?, ?, ?, 0)', [req.session.user.id, title, content]);
  saveDB();
  res.redirect('/');
});

app.post('/like/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const userStatus = db.exec('SELECT suspended_until FROM users WHERE id = ?', [req.session.user.id]);
  if (userStatus[0] && userStatus[0].values[0][0]) {
    const until = new Date(userStatus[0].values[0][0]);
    if (until > new Date()) {
      return res.redirect('/post/' + req.params.id);
    }
  }
  const existing = db.exec('SELECT * FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
  if (existing[0] && existing[0].values.length > 0) {
    db.run('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
  } else {
    db.run('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [req.params.id, req.session.user.id]);
  }
  saveDB();
  res.redirect('/post/' + req.params.id);
});

app.post('/favorite/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const userStatus = db.exec('SELECT suspended_until FROM users WHERE id = ?', [req.session.user.id]);
  if (userStatus[0] && userStatus[0].values[0][0]) {
    const until = new Date(userStatus[0].values[0][0]);
    if (until > new Date()) {
      return res.redirect('/post/' + req.params.id);
    }
  }
  const existing = db.exec('SELECT * FROM favorites WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
  if (existing[0] && existing[0].values.length > 0) {
    db.run('DELETE FROM favorites WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.user.id]);
  } else {
    db.run('INSERT INTO favorites (post_id, user_id) VALUES (?, ?)', [req.params.id, req.session.user.id]);
  }
  saveDB();
  res.redirect('/post/' + req.params.id);
});

app.get('/favorites', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const favorites = db.exec('SELECT p.*, u.username, (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count FROM posts p LEFT JOIN users u ON p.user_id = u.id INNER JOIN favorites f ON p.id = f.post_id WHERE f.user_id = ? ORDER BY f.id DESC', [req.session.user.id]);
  const data = favorites[0] ? favorites[0].values.map(row => ({
    id: row[0], user_id: row[1], title: row[2], content: row[3], created_at: row[4], username: row[5], like_count: row[6], is_news: row[7], news_link: row[8], news_source: row[9]
  })) : [];
  const userLikes = db.exec('SELECT post_id FROM likes WHERE user_id = ?', [req.session.user.id]);
  const likedPosts = userLikes && userLikes[0] ? userLikes[0].values.map(r => r[0]) : [];
  const userFavorites = db.exec('SELECT post_id FROM favorites WHERE user_id = ?', [req.session.user.id]);
  const favoritePosts = userFavorites && userFavorites[0] ? userFavorites[0].values.map(r => r[0]) : [];
  res.render('favorites', { posts: data, user: req.session.user, likedPosts, favoritePosts });
});

app.post('/comment/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const userStatus = db.exec('SELECT suspended_until FROM users WHERE id = ?', [req.session.user.id]);
  if (userStatus[0] && userStatus[0].values[0][0]) {
    const until = new Date(userStatus[0].values[0][0]);
    if (until > new Date()) {
      return res.redirect('/post/' + req.params.id);
    }
  }
  const { content } = req.body;
  if (content.trim()) {
    db.run('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)', [req.params.id, req.session.user.id, content]);
    saveDB();
  }
  res.redirect('/post/' + req.params.id);
});

app.post('/report/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const post = db.exec('SELECT user_id FROM posts WHERE id = ?', [req.params.id]);
  if (post[0] && post[0].values.length > 0) {
    const postUserId = post[0].values[0][0];
    if (postUserId) {
      db.run('INSERT INTO reports (post_id, reporter_id) VALUES (?, ?)', [req.params.id, req.session.user.id]);
      const reportCount = db.exec('SELECT COUNT(DISTINCT reporter_id) FROM reports WHERE post_id = ?', [req.params.id]);
      if (reportCount[0] && reportCount[0].values[0][0] >= 10) {
        const suspendedUntil = new Date(Date.now() + 30 * 60 * 1000);
        db.run('UPDATE users SET warnings = warnings + 1, suspended_until = ? WHERE id = ?', [suspendedUntil.toISOString(), postUserId]);
        db.run('DELETE FROM reports WHERE post_id = ?', [req.params.id]);
      }
      saveDB();
    }
  }
  res.redirect('/post/' + req.params.id);
});

app.post('/delete/:id', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
  saveDB();
  res.redirect('/');
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog running at http://localhost:${PORT}`);
  });
});