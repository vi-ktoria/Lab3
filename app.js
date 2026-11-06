const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const postsList = document.querySelector('#posts-list');
const loadButton = document.querySelector('#load-button');
const postForm = document.querySelector('#post-form');
const createButton = document.querySelector('#create-button');
const titleInput = document.querySelector('#post-title');
const bodyInput = document.querySelector('#post-body');
const message = document.querySelector('#message');

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function renderPost(post) {
  const article = document.createElement('article');
  article.className = 'post-card';

  const title = document.createElement('h3');
  title.textContent = post.title;

  const body = document.createElement('p');
  body.textContent = post.body;

  article.append(title, body);

  if (post.id !== undefined) {
    const id = document.createElement('span');
    id.className = 'post-id';
    id.textContent = `ID: ${post.id}`;
    article.append(id);
  }

  return article;
}

async function loadPosts() {
  loadButton.disabled = true;
  showMessage('Загрузка публикаций…', 'info');

  try {
    const response = await fetch(`${API_URL}?_limit=5`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const posts = await response.json();
    postsList.replaceChildren();

    posts.forEach((post) => postsList.append(renderPost(post)));

    if (posts.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'Публикации не найдены.';
      postsList.append(empty);
    }

    showMessage(`Загружено публикаций: ${posts.length}.`, 'success');
  } catch (error) {
    showMessage(`Не удалось загрузить публикации: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener('click', loadPosts);

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    showMessage('Заполните заголовок и текст публикации.', 'error');
    return;
  }

  createButton.disabled = true;
  showMessage('Отправка публикации…', 'info');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const createdPost = await response.json();
    postsList.prepend(renderPost(createdPost));
    showMessage(`Публикация «${createdPost.title}» успешно создана. ID: ${createdPost.id}. HTTP : 201 (Created)`, 'success');
    postForm.reset();
  } catch (error) {
    showMessage(`Не удалось создать публикацию: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    createButton.disabled = false;
  }
});
