const form = document.getElementById('post-form');
const postsContainer = document.getElementById('posts-container');
const formTitle = document.getElementById('form-title');
const postIdInput = document.getElementById('post-id');
const titleInput = document.getElementById('title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const backBtn = document.getElementById('back-btn');
const newPostBtn = document.getElementById('new-post-btn');
const postFormSection = document.getElementById('post-form-section');
const postDetailSection = document.getElementById('post-detail-section');
const postsSection = document.getElementById('posts-section');
const postDetailContent = document.getElementById('post-detail-content');
const detailEditBtn = document.getElementById('detail-edit-btn');
const detailDeleteBtn = document.getElementById('detail-delete-btn');

let quill;
let currentPostId = null;

function initEditor() {
  quill = new Quill('#editor', {
    theme: 'snow',
    placeholder: '在此輸入內容...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });
}

function showSection(section) {
  postFormSection.style.display = 'none';
  postDetailSection.style.display = 'none';
  postsSection.style.display = 'none';
  backBtn.style.display = 'none';
  newPostBtn.style.display = 'none';
  
  if (section === 'form') {
    postFormSection.style.display = 'block';
    newPostBtn.style.display = 'block';
  } else if (section === 'detail') {
    postDetailSection.style.display = 'block';
    backBtn.style.display = 'block';
    newPostBtn.style.display = 'block';
  } else if (section === 'list') {
    postsSection.style.display = 'block';
    newPostBtn.style.display = 'block';
    backBtn.style.display = 'none';
  }
}

async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  postsContainer.innerHTML = posts.map(post => `
    <div class="post" onclick="viewPost(${post.id})">
      <h3>${escapeHtml(post.title)}</h3>
      <div class="meta">${new Date(post.created_at).toLocaleString('zh-TW')}</div>
      <div class="post-preview">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.viewPost = async function(id) {
  currentPostId = id;
  const res = await fetch(`/api/posts/${id}`);
  const post = await res.json();
  postDetailContent.innerHTML = `
    <h1>${escapeHtml(post.title)}</h1>
    <div class="meta">${new Date(post.created_at).toLocaleString('zh-TW')}</div>
    <div class="post-body">${post.content}</div>
  `;
  showSection('detail');
};

window.editPost = async function(id) {
  const res = await fetch(`/api/posts/${id}`);
  const post = await res.json();
  postIdInput.value = post.id;
  titleInput.value = post.title;
  quill.root.innerHTML = post.content;
  formTitle.textContent = '編輯文章';
  submitBtn.textContent = '更新';
  showSection('form');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = postIdInput.value;
  const content = quill.root.innerHTML;
  const data = { title: titleInput.value, content };
  
  const res = id 
    ? await fetch(`/api/posts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    : await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  
  if (res.ok) {
    resetForm();
    loadPosts();
    showSection('list');
  }
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  showSection('list');
});

backBtn.addEventListener('click', () => {
  showSection('list');
});

newPostBtn.addEventListener('click', () => {
  resetForm();
  showSection('form');
});

detailEditBtn.addEventListener('click', () => {
  editPost(currentPostId);
});

detailDeleteBtn.addEventListener('click', async () => {
  if (confirm('確定要刪除這篇文章嗎？')) {
    await fetch(`/api/posts/${currentPostId}`, { method: 'DELETE' });
    loadPosts();
    showSection('list');
  }
});

function resetForm() {
  form.reset();
  postIdInput.value = '';
  quill.root.innerHTML = '';
  formTitle.textContent = '新增文章';
  submitBtn.textContent = '發布';
}

window.deletePost = async function(id) {
  if (confirm('確定要刪除這篇文章嗎？')) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  }
};

initEditor();
showSection('list');
loadPosts();
