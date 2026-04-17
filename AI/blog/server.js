const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { initDb, getDb, saveDb } = require('./database');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'blog-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

function queryAll(sql, params = []) {
  const stmt = getDb().prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function runSql(sql, params = []) {
  getDb().run(sql, params);
  saveDb();
  return { lastInsertRowid: getDb().exec("SELECT last_insert_rowid()")[0]?.values[0][0] || 0, changes: getDb().getRowsModified() };
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: '請先登入' });
  }
  next();
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '請填寫帳號和密碼' });
  }
  if (username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: '帳號至少3字元，密碼至少6字元' });
  }
  const existing = queryOne('SELECT id FROM users WHERE username = ?', [username]);
  if (existing) {
    return res.status(400).json({ error: '帳號已被註冊' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = runSql('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  req.session.userId = result.lastInsertRowid;
  req.session.username = username;
  res.json({ id: result.lastInsertRowid, username });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = queryOne('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ id: user.id, username: user.username });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: '已登出' });
});

app.get('/api/me', (req, res) => {
  if (req.session.userId) {
    res.json({ id: req.session.userId, username: req.session.username });
  } else {
    res.json(null);
  }
});

app.get('/api/users', requireAuth, (req, res) => {
  const users = queryAll('SELECT id, username, created_at FROM users ORDER BY created_at DESC');
  res.json(users);
});

app.get('/api/posts', (req, res) => {
  const posts = queryAll(`
    SELECT posts.*, users.username as author 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.id 
    ORDER BY posts.created_at DESC
  `);
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = queryOne(`
    SELECT posts.*, users.username as author 
    FROM posts 
    LEFT JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?
  `, [req.params.id]);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts', requireAuth, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '標題和內容為必填' });
  }
  const result = runSql('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.session.userId]);
  res.json({ id: result.lastInsertRowid, title, content, user_id: req.session.userId });
});

app.put('/api/posts/:id', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const existing = queryOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!existing) {
    return res.status(404).json({ error: '文章不存在' });
  }
  if (existing.user_id && existing.user_id !== req.session.userId) {
    return res.status(403).json({ error: '無權限編輯此文章' });
  }
  runSql('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
  res.json({ id: req.params.id, title, content });
});

app.delete('/api/posts/:id', requireAuth, (req, res) => {
  const existing = queryOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (!existing) {
    return res.status(404).json({ error: '文章不存在' });
  }
  if (existing.user_id && existing.user_id !== req.session.userId) {
    return res.status(403).json({ error: '無權限刪除此文章' });
  }
  runSql('DELETE FROM posts WHERE id = ?', [req.params.id]);
  res.json({ message: '已刪除' });
});

app.get('/api/posts/:id/comments', (req, res) => {
  const comments = queryAll(`
    SELECT comments.*, users.username as author
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
  `, [req.params.id]);
  res.json(comments);
});

app.post('/api/posts/:id/comments', requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '請輸入留言內容' });
  }
  const post = queryOne('SELECT id FROM posts WHERE id = ?', [req.params.id]);
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }
  const result = runSql(
    'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
    [req.params.id, req.session.userId, content.trim()]
  );
  res.json({
    id: result.lastInsertRowid,
    post_id: parseInt(req.params.id),
    user_id: req.session.userId,
    content: content.trim(),
    author: req.session.username,
    created_at: new Date().toISOString()
  });
});

app.delete('/api/comments/:id', requireAuth, (req, res) => {
  const comment = queryOne('SELECT * FROM comments WHERE id = ?', [req.params.id]);
  if (!comment) {
    return res.status(404).json({ error: '留言不存在' });
  }
  if (comment.user_id !== req.session.userId) {
    return res.status(403).json({ error: '無權限刪除此留言' });
  }
  runSql('DELETE FROM comments WHERE id = ?', [req.params.id]);
  res.json({ message: '已刪除' });
});

app.get('/api/posts/:id/likes', (req, res) => {
  const count = queryOne('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [req.params.id]);
  const liked = req.session.userId 
    ? queryOne('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.userId])
    : null;
  res.json({ count: count?.count || 0, liked: !!liked });
});

app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const post = queryOne('SELECT id FROM posts WHERE id = ?', [req.params.id]);
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }
  const existing = queryOne('SELECT id FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.userId]);
  if (existing) {
    runSql('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [req.params.id, req.session.userId]);
    res.json({ liked: false });
  } else {
    runSql('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [req.params.id, req.session.userId]);
    res.json({ liked: true });
  }
});

app.get('/api/posts/:id', (req, res) => {
  const post = queryOne(`
    SELECT posts.*, users.username as author,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    WHERE posts.id = ?
  `, [req.params.id]);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.get('/api/posts', (req, res) => {
  const posts = queryAll(`
    SELECT posts.*, users.username as author,
    (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count
    FROM posts
    LEFT JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  res.json(posts);
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog server running at http://localhost:${PORT}`);
  });
});
