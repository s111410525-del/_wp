const express = require('express');
const path = require('path');
const { initDb, getDb, saveDb } = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
  return { lastInsertRowid: getDb().exec("SELECT last_insert_rowid()")[0]?.values[0][0] || 0 };
}

app.get('/api/posts', (req, res) => {
  const posts = queryAll('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
  const post = queryOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const result = runSql('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content]);
  res.json({ id: result.lastInsertRowid, title, content });
});

app.put('/api/posts/:id', (req, res) => {
  const { title, content } = req.body;
  const existing = queryOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (existing) {
    runSql('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
    res.json({ id: req.params.id, title, content });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const existing = queryOne('SELECT * FROM posts WHERE id = ?', [req.params.id]);
  if (existing) {
    runSql('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog server running at http://localhost:${PORT}`);
  });
});
