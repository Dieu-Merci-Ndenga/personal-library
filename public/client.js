'use strict';

const display = document.querySelector('#display');
const bookCount = document.querySelector('#bookCount');
const libraryMessage = document.querySelector('#libraryMessage');
const newBookForm = document.querySelector('#newBookForm');
const detailEmpty = document.querySelector('#detailEmpty');
const detailContent = document.querySelector('#detailContent');
const detailTitle = document.querySelector('#detailTitle');
const detailId = document.querySelector('#detailId');
const detailComments = document.querySelector('#detailComments');
const commentCount = document.querySelector('#commentCount');
const newCommentForm = document.querySelector('#newCommentForm');
const deleteBookButton = document.querySelector('#deleteBook');
const deleteAllButton = document.querySelector('#deleteAllBooks');

let books = [];
let selectedBook = null;

async function request(url, options) {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(typeof data === 'string' ? data : 'Something went wrong.');
  return data;
}

function setMessage(message) { libraryMessage.textContent = message; }

function renderBooks() {
  bookCount.textContent = `${books.length} ${books.length === 1 ? 'book' : 'books'}`;
  display.replaceChildren();
  if (!books.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Your collection is waiting for its first title.';
    display.append(empty);
    return;
  }
  books.forEach(book => {
    const item = document.createElement('div');
    item.className = 'book-item';
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.bookId = book._id;
    const title = document.createElement('span');
    title.className = 'book-title';
    title.textContent = book.title;
    const meta = document.createElement('span');
    meta.className = 'book-meta';
    meta.textContent = `${book.commentcount} ${book.commentcount === 1 ? 'note' : 'notes'}`;
    button.append(title, meta);
    item.append(button);
    display.append(item);
  });
}

function renderDetail(book) {
  selectedBook = book;
  detailEmpty.hidden = true;
  detailContent.hidden = false;
  detailTitle.textContent = book.title;
  detailId.textContent = `ID: ${book._id}`;
  commentCount.textContent = book.comments.length;
  detailComments.replaceChildren();
  if (!book.comments.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No notes yet. Add the first one.';
    detailComments.append(empty);
    return;
  }
  book.comments.forEach(comment => {
    const item = document.createElement('li');
    item.textContent = comment;
    detailComments.append(item);
  });
}

async function loadBooks() {
  try {
    books = await request('/api/books');
    renderBooks();
  } catch (error) {
    setMessage(error.message);
  }
}

display.addEventListener('click', async event => {
  const button = event.target.closest('[data-book-id]');
  if (!button) return;
  try {
    renderDetail(await request(`/api/books/${button.dataset.bookId}`));
  } catch (error) {
    setMessage(error.message);
  }
});

newBookForm.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    await request('/api/books', { method: 'POST', body: new FormData(newBookForm) });
    newBookForm.reset();
    setMessage('Book added to your collection.');
    await loadBooks();
  } catch (error) {
    setMessage(error.message);
  }
});

newCommentForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!selectedBook) return;
  try {
    const updatedBook = await request(`/api/books/${selectedBook._id}`, {
      method: 'POST',
      body: new FormData(newCommentForm)
    });
    newCommentForm.reset();
    renderDetail(updatedBook);
    books = books.map(book => book._id === updatedBook._id ? updatedBook : book);
    renderBooks();
  } catch (error) {
    setMessage(error.message);
  }
});

deleteBookButton.addEventListener('click', async () => {
  if (!selectedBook) return;
  try {
    await request(`/api/books/${selectedBook._id}`, { method: 'DELETE' });
    selectedBook = null;
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    await loadBooks();
  } catch (error) {
    setMessage(error.message);
  }
});

deleteAllButton.addEventListener('click', async () => {
  if (!books.length || !window.confirm('Clear your entire collection?')) return;
  try {
    await request('/api/books', { method: 'DELETE' });
    selectedBook = null;
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    setMessage('Collection cleared.');
    await loadBooks();
  } catch (error) {
    setMessage(error.message);
  }
});

loadBooks();