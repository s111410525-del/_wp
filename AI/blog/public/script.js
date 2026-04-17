let currentUser = null;

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
const detailActions = document.getElementById('detail-actions');

const authSection = document.getElementById('auth-section-page');
const authForm = document.getElementById('auth-form');
const authFormTitle = document.getElementById('auth-form-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitchLink = document.getElementById('auth-switch-link');
const authCloseBtn = document.getElementById('auth-close-btn');
const welcomeText = document.getElementById('welcome-text');

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const switchBtn = document.getElementById('switch-btn');

const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentSubmitBtn = document.getElementById('comment-submit-btn');
const commentLoginHint = document.getElementById('comment-login-hint');

const likeBtn = document.getElementById('like-btn');
const likeIcon = document.getElementById('like-icon');
const likeCount = document.getElementById('like-count');
const shareBtn = document.getElementById('share-btn');

let quill;
let currentPostId = null;
let isLoginMode = true;
let currentPostUserId = null;
let currentPostLiked = false;
let currentPostLikes = 0;

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
  detailActions.style.display = 'none';
  
  if (section === 'form') {
    postFormSection.style.display = 'block';
    if (currentUser) newPostBtn.style.display = 'block';
  } else if (section === 'detail') {
    postDetailSection.style.display = 'block';
    backBtn.style.display = 'inline-block';
    if (currentUser && currentPostUserId === currentUser.id) {
      detailActions.style.display = 'block';
    }
    if (currentUser) newPostBtn.style.display = 'block';
  } else if (section === 'list') {
    postsSection.style.display = 'block';
    if (currentUser) newPostBtn.style.display = 'block';
    backBtn.style.display = 'none';
  }
}

function updateAuthUI() {
  if (currentUser) {
    welcomeText.textContent = `歡迎，${currentUser.username}`;
    welcomeText.style.display = 'inline';
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    switchBtn.style.display = 'inline-block';
    newPostBtn.style.display = 'block';
  } else {
    welcomeText.style.display = 'none';
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    switchBtn.style.display = 'none';
    newPostBtn.style.display = 'none';
  }
}

async function checkAuth() {
  const res = await fetch('/api/me');
  currentUser = await res.json();
  updateAuthUI();
}

async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  postsContainer.innerHTML = posts.map(post => `
    <div class="post" onclick="viewPost(${post.id})">
      <h3>${escapeHtml(post.title)}</h3>
      <div class="meta">
        ${post.author ? '作者: ' + escapeHtml(post.author) : '匿名'} | 
        ${new Date(post.created_at).toLocaleString('zh-TW')}
      </div>
      <div class="post-preview">${stripHtml(post.content).substring(0, 150)}${stripHtml(post.content).length > 150 ? '...' : ''}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

window.viewPost = async function(id) {
  currentPostId = id;
  const res = await fetch(`/api/posts/${id}`);
  const post = await res.json();
  currentPostUserId = post.user_id;
  currentPostLikes = post.like_count || 0;
  postDetailContent.innerHTML = `
    <h1>${escapeHtml(post.title)}</h1>
    <div class="meta">
      ${post.author ? '作者: ' + escapeHtml(post.author) : '匿名'} | 
      ${new Date(post.created_at).toLocaleString('zh-TW')}
    </div>
    <div class="post-body">${post.content}</div>
  `;
  showSection('detail');
  loadComments(id);
  await loadLikes(id);
};

async function loadLikes(postId) {
  const res = await fetch(`/api/posts/${postId}/likes`);
  const data = await res.json();
  currentPostLiked = data.liked;
  currentPostLikes = data.count;
  updateLikeUI();
}

function updateLikeUI() {
  likeCount.textContent = currentPostLikes;
  likeIcon.textContent = currentPostLiked ? '♥' : '♡';
  likeBtn.classList.toggle('liked', currentPostLiked);
}

likeBtn.addEventListener('click', async () => {
  if (!currentUser) {
    loginBtn.click();
    return;
  }
  const res = await fetch(`/api/posts/${currentPostId}/like`, { method: 'POST' });
  const data = await res.json();
  currentPostLiked = data.liked;
  currentPostLikes += data.liked ? 1 : -1;
  updateLikeUI();
});

shareBtn.addEventListener('click', async () => {
  const url = window.location.href.split('#')[0] + '#post=' + currentPostId;
  const title = postDetailContent.querySelector('h1')?.textContent || '文章';
  
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch (e) {}
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    alert('連結已複製到剪貼簿！');
  } else {
    prompt('複製連結:', url);
  }
});

async function loadComments(postId) {
  const res = await fetch(`/api/posts/${postId}/comments`);
  const comments = await res.json();
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<p class="no-comments">尚無留言</p>';
  } else {
    commentsList.innerHTML = comments.map(c => `
      <div class="comment" id="comment-${c.id}">
        <div class="comment-header">
          <span class="comment-author">${escapeHtml(c.author || '匿名')}</span>
          <span class="comment-time">${new Date(c.created_at).toLocaleString('zh-TW')}</span>
          ${currentUser && currentUser.id === c.user_id ? `<button class="comment-delete-btn" onclick="deleteComment(${c.id})">刪除</button>` : ''}
        </div>
        <div class="comment-content">${escapeHtml(c.content)}</div>
      </div>
    `).join('');
  }
  
  if (currentUser) {
    commentForm.style.display = 'block';
    commentLoginHint.style.display = 'none';
  } else {
    commentForm.style.display = 'none';
    commentLoginHint.style.display = 'block';
  }
}

window.deleteComment = async function(id) {
  if (confirm('確定要刪除此留言嗎？')) {
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadComments(currentPostId);
    }
  }
};

commentSubmitBtn.addEventListener('click', async () => {
  const content = commentInput.value.trim();
  if (!content) {
    alert('請輸入留言內容');
    return;
  }
  
  const res = await fetch(`/api/posts/${currentPostId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  
  if (res.ok) {
    commentInput.value = '';
    loadComments(currentPostId);
  } else {
    const err = await res.json();
    alert(err.error);
  }
});

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
  } else {
    const err = await res.json();
    alert(err.error);
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
    const res = await fetch(`/api/posts/${currentPostId}`, { method: 'DELETE' });
    if (res.ok) {
      loadPosts();
      showSection('list');
    } else {
      const err = await res.json();
      alert(err.error);
    }
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
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadPosts();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  }
};

loginBtn.addEventListener('click', () => {
  isLoginMode = true;
  authFormTitle.textContent = '登入';
  authSubmitBtn.textContent = '登入';
  authSwitchLink.textContent = '還沒有帳號？註冊';
  document.getElementById('auth-username').value = '';
  document.getElementById('auth-password').value = '';
  authSection.style.display = 'flex';
});

registerBtn.addEventListener('click', () => {
  isLoginMode = false;
  authFormTitle.textContent = '註冊';
  authSubmitBtn.textContent = '註冊';
  authSwitchLink.textContent = '已有帳號？登入';
  document.getElementById('auth-username').value = '';
  document.getElementById('auth-password').value = '';
  authSection.style.display = 'flex';
});

authSwitchLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  authFormTitle.textContent = isLoginMode ? '登入' : '註冊';
  authSubmitBtn.textContent = isLoginMode ? '登入' : '註冊';
  authSwitchLink.textContent = isLoginMode ? '還沒有帳號？註冊' : '已有帳號？登入';
});

authCloseBtn.addEventListener('click', () => {
  authSection.style.display = 'none';
});

authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('auth-username').value;
  const password = document.getElementById('auth-password').value;
  
  const endpoint = isLoginMode ? '/api/login' : '/api/register';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  if (res.ok) {
    currentUser = await res.json();
    updateAuthUI();
    authSection.style.display = 'none';
    loadPosts();
    showSection('list');
  } else {
    const err = await res.json();
    alert(err.error);
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  currentUser = null;
  updateAuthUI();
  showSection('list');
});

switchBtn.addEventListener('click', () => {
  loginBtn.click();
});

authSection.addEventListener('click', (e) => {
  if (e.target === authSection) {
    authSection.style.display = 'none';
  }
});

initEditor();
checkAuth().then(() => {
  showSection('list');
  loadPosts();
});
