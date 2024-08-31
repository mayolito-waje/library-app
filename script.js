function Book(id, title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.id = id;
}

Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
}

Book.prototype.update = function({title, author, pages, isRead}) {
  if (title) this.title = title;
  if (author) this.author = author;
  if (pages) this.pages = pages;
  this.isRead = isRead ? true : false;

  return this;
}

function Library() {
  this.currId = 0;
  this.library = [];
}

Library.prototype.addBook = function({id, title, author, pages, isRead}) {
  const newBook = new Book(id ?? this.currId, title, author, pages, isRead ?? false);
  if (!id) this.currId++;

  this.library.push(newBook);
  return {
    id: newBook.id,
    title: newBook.title,
    author: newBook.author,
    pages: newBook.pages,
    isRead: newBook.isRead
  };
}

Library.prototype.deleteBook = function(id) {
  if (!(String(id).match(/^[0-9]+$/))) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      this.library.splice(i, 1);
      break;
    }
  }
}

Library.prototype.updateBook = function({id, title, author, pages, isRead}) {
  if (!(String(id).match(/^[0-9]+$/))) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      return book.update({title, author, pages, isRead});
    }
  }
}

Library.prototype.toggleRead = function(id) {
  if (!(String(id).match(/^[0-9]+$/))) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      book.toggleRead();
    }
  }
}

Library.prototype.showEntry = function(id) {
  if (!(String(id).match(/^[0-9]+$/))) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      return book;
    }
  }

  return null;
}

const addBookDialog = document.querySelector(".add-book-form-dialog");
const addBookBtn = document.querySelector("button.add-book");
const closeBookDialog = document.querySelector(".add-book-form-dialog .close-dialog");
const addBookForm = document.querySelector("form.add-book-form");
const updateBookDialog = document.querySelector('.update-book-form-dialog');
const closeUpdateBookDialog = document.querySelector('.update-book-form-dialog .close-dialog');
const updateBookForm = document.querySelector("form.update-book-form");

const sanitizeInput = (str) => {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  return String(str).replace(/[&<>"`=\/]/g, (s) => entityMap[s]);
}

window.addEventListener('DOMContentLoaded', () => {
  const library = new Library();

  const updateLibrary = function () {
    window.localStorage.setItem('book_list', JSON.stringify(library.library));
  };

  const createBookEntry = function ({id, title, author, pages, isRead}) {
    /* 
    <li class="book-card" data-book-id="{id}">
      <div class="title">"{title}"</div>
      <div class="author">{author}</div>
      <div class="pages">{pages} pages</div>
      <div class="book-entry_is-read">
        <label for="id-{id}_is-read">Read:</label>
        <input 
          type="checkbox" 
          name="book-list_is-read" 
          id="id-{id}_is-read" 
          value="id-{id}_is-read" 
          class="is-read_checkbox"
          data-bookId="{id}"
        >
      </div>
      <button class="update_btn" data-book-id="{id}">Update</button>
      <button class="delete_btn" data-book-id="{id}">Delete</button>
    </li>
    */
  
    const bookCard = document.createElement('li');
    bookCard.classList.add('book-card');
    bookCard.dataset.bookId = id;
  
    const titleEntry = document.createElement('div');
    titleEntry.classList.add('title');
    titleEntry.textContent = `"${title}"`;
    bookCard.appendChild(titleEntry);
  
    const authorEntry = document.createElement('div');
    authorEntry.classList.add('author');
    authorEntry.textContent = author;
    bookCard.appendChild(authorEntry);
  
    const pagesEntry = document.createElement('div');
    pagesEntry.classList.add('pages');
    pagesEntry.textContent = `${pages} pages`;
    bookCard.appendChild(pagesEntry);
  
    const isReadEntry = document.createElement('div');
    isReadEntry.classList.add('book-entry_is-read');
    const isReadCheckBoxLabel = document.createElement('label');
    isReadCheckBoxLabel.htmlFor = `id-${id}_is-read`;
    isReadCheckBoxLabel.textContent = 'Read:';
    isReadEntry.appendChild(isReadCheckBoxLabel);
    const isReadCheckBox = document.createElement('input');
    isReadCheckBox.type = 'checkbox';
    isReadCheckBox.name = 'book-list_is-read';
    isReadCheckBox.id = `id-${id}_is-read`;
    isReadCheckBox.value = `id-${id}_is-read`;
    isReadCheckBox.classList.add('is-read_checkbox');
    isReadCheckBox.checked = isRead;
    isReadCheckBox.dataset.bookId = id
    isReadEntry.appendChild(isReadCheckBox);
    bookCard.appendChild(isReadEntry);
  
    const updateBtn = document.createElement('button');
    updateBtn.classList.add('update_btn');
    updateBtn.textContent = 'Update';
    updateBtn.dataset.bookId = id;
    bookCard.appendChild(updateBtn);
  
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete_btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.bookId = id;
    bookCard.appendChild(deleteBtn);

    isReadCheckBox.addEventListener('click', (e) => {
      library.toggleRead(parseInt(e.currentTarget.dataset.bookId));
      updateLibrary();
    });

    updateBtn.addEventListener('click', (e) => {
      const bookToUpdate = library.showEntry(parseInt(e.currentTarget.dataset.bookId));

      document.querySelector('.update-book-form').dataset.updateBookId = bookToUpdate.id;
      document.querySelector('.update-book-form input#update_title').value = bookToUpdate.title;
      document.querySelector('.update-book-form input#update_author').value = bookToUpdate.author;
      document.querySelector('.update-book-form input#update_pages').value = bookToUpdate.pages;
      document.querySelector('.update-book-form input#update_is-read').checked = bookToUpdate.isRead;
      
      updateBookDialog.showModal();

      requestAnimationFrame(() => {
        updateBookDialog.classList.add('scale-up');
      });
    })

    deleteBtn.addEventListener('click', (e) => {
      library.deleteBook(parseInt(e.currentTarget.dataset.bookId));
      document.querySelector(`ol.book-list_data .book-card[data-book-id="${e.currentTarget.dataset.bookId}"]`)
        .remove();
      updateLibrary();
    });
  
    return bookCard;
  };

  if (window.localStorage.getItem('book_list')) {
    library.currId = parseInt(window.localStorage.getItem('library_curr_id'));
    const bookList = JSON.parse(window.localStorage.getItem('book_list'));

    let maxId = -Infinity;
    bookList.forEach((entry) => {
      const {id, title, author, pages, isRead} = entry;
      library.addBook({id, title, author, pages, isRead});
      const bookCard = createBookEntry({id, title, author, pages, isRead});
      document.querySelector('ol.book-list_data').appendChild(bookCard);
      if (id > maxId) maxId = id;
    });

    library.currId = maxId + 1;
  }

  addBookBtn.addEventListener('click', () => {
    addBookDialog.showModal();
    addBookForm.reset();

    requestAnimationFrame(() => {
      addBookDialog.classList.add('scale-up');
    });
  });

  closeBookDialog.addEventListener('click', (e) => {
    e.preventDefault();

    requestAnimationFrame(() => {
      addBookDialog.classList.remove('scale-up');
    });

    setTimeout(() => {
      addBookDialog.close();
    }, 0.25 * 1000);
  });

  addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.querySelector('.add-book-form input#title').value;
    const author = document.querySelector('.add-book-form input#author').value;
    const pages = document.querySelector('.add-book-form input#pages').value;
    const isRead = document.querySelector('.add-book-form input#is-read').checked;

    const entry = library.addBook({
      title: sanitizeInput(title),
      author: sanitizeInput(author),
      pages,
      isRead
    });

    updateLibrary();

    const bookCard = createBookEntry(entry, library);
    document.querySelector('ol.book-list_data').appendChild(bookCard);

    requestAnimationFrame(() => {
      addBookDialog.classList.remove('scale-up');
    });

    setTimeout(() => {
      addBookDialog.close();
    }, 0.25 * 1000);
  });

  closeUpdateBookDialog.addEventListener('click', (e) => {
    e.preventDefault();

    requestAnimationFrame(() => {
      updateBookDialog.classList.remove('scale-up');
    });

    setTimeout(() => {
      updateBookDialog.close();
    }, 0.25 * 1000);
  });

  updateBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const bookId = document.querySelector('.update-book-form').dataset.updateBookId;
    const title = document.querySelector('.update-book-form input#update_title').value;
    const author = document.querySelector('.update-book-form input#update_author').value;
    const pages = document.querySelector('.update-book-form input#update_pages').value;
    const isRead = document.querySelector('.update-book-form input#update_is-read').checked;

    const updatedBook = library.updateBook({id: parseInt(bookId), title, author, pages, isRead});

    const bookCardQuery = `.book-list_data .book-card[data-book-id="${updatedBook.id}"]`;
    document.querySelector(`${bookCardQuery} .title`).textContent = `"${updatedBook.title}"`;
    document.querySelector(`${bookCardQuery} .author`).textContent = updatedBook.author;
    document.querySelector(`${bookCardQuery} .pages`).textContent = `${pages} pages`;
    document.querySelector(`${bookCardQuery} .is-read_checkbox`).checked = updatedBook.isRead;

    updateLibrary();

    requestAnimationFrame(() => {
      updateBookDialog.classList.remove('scale-up');
    });

    setTimeout(() => {
      updateBookDialog.close();
    }, 0.25 * 1000);
  });
})
