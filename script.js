let currId = 0;

function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.id = currId;
}

Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
}

Book.prototype.update = function({title, author, pages}) {
  if (title) this.title = title;
  if (author) this.author = author;
  if (pages) this.pages = pages;
}

function Library() {
  this.library = [];
}

Library.prototype.addBook = function({title, author, pages, isRead}) {
  const newBook = new Book(title, author, pages, isRead ?? false);
  ++currId;

  this.library.push(newBook);
}

Library.prototype.deleteBook = function(id) {
  if (!id) {
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

Library.prototype.updateBook = function({id, title, author, pages}) {
  if (!id) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      book.update({title, author, pages});
    }
  }
}

Library.prototype.toggleRead = function(id) {
  if (!id) {
    throw new Error('please provide Book ID');
  }

  for (let i = 0; i < this.library.length; i++) {
    const book = this.library[i];

    if (book.id === id) {
      book.toggleRead();
    }
  }
}
