// Do your work here...
let books = [];
let isComplete;
const RENDER_BOOKS = "render-book";
const SAVED_BOOKS = "saved-books";
const STORAGE_KEY = "storage-key";

const incomplete = document.getElementById("incompleteBookList");
incomplete.innerHTML = "";
const complete = document.getElementById("completeBookList");
complete.innerHTML = "";

function saveLocalStorage() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}

function loadLocalStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("bookFormSubmit").addEventListener("click", function (event) {
    event.preventDefault();
    addBook();
  });
  loadLocalStorage();
});

function addBook() {
  const id = Number(new Date());
  const author = document.getElementById("bookFormAuthor").value;
  const title = document.getElementById("bookFormTitle").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const check = document.getElementById("bookFormIsComplete").checked;
  check ? (isComplete = true) : (isComplete = false);
  const book = { id, author, title, year, isComplete };
  if (author === "" || title === "" || year === "") {
    alert("Kolom Judul, Penulis dan Tahun tidak boleh kosong");
  } else {
    books.push(book);
    document.getElementById("bookFormAuthor").value = "";
    document.getElementById("bookFormTitle").value = "";
    document.getElementById("bookFormYear").value = "";
    document.getElementById("bookFormIsComplete").checked = false;
  }
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveLocalStorage();
}

document.addEventListener(RENDER_BOOKS, function () {
  const incompleteBook = document.getElementById("incompleteBookList");
  const completeBook = document.getElementById("completeBookList");
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
});

document.addEventListener(RENDER_BOOKS, function () {
  const incompleteBook = document.getElementById("incompleteBookList");
  const completeBook = document.getElementById("completeBookList");
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBook(book);
    if (!book.isComplete) {
      incompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
});

function makeBook(book) {
  const { id, author, title, year, isComplete } = book;
  const containerBook = document.createElement("div");
  containerBook.setAttribute("data-bookid", `${book.id}`);
  containerBook.setAttribute("data-testid", "bookItem");
  containerBook.setAttribute("class", "status");
  if (isComplete) {
    containerBook.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button class="button finishButton" data-testid="bookItemIsCompleteButton" onclick="moveBook(${book.id})">Belum selesai dibaca</button>
          <button class="button deleteButton" data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
          <button class="button editButton" data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
        </div>
    `;
  } else {
    containerBook.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button class="button finishButton" data-testid="bookItemIsCompleteButton" onclick="moveBook(${book.id})">Selesai dibaca</button>
        <button class="button deleteButton" data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
        <button class="button editButton" data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
      </div>
  `;
  }
  return containerBook;
}

function findIndex(id) {
  for (const index in books) {
    if (books[index].id === id) return index;
  }
  return -1;
}

function findBook(id) {
  for (const book of books) {
    if (book.id === id) return book;
  }
  return null;
}

function findTarget(status, id) {
  let item;
  [...status].forEach((element) => {
    if (parseInt(element.getAttribute("data-bookid")) === id) item = element;
  });
  return item;
}

function moveBook(id) {
  const targetBook = findBook(id);
  if (targetBook == null) return;
  targetBook.isComplete = !targetBook.isComplete;
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveLocalStorage();
}

function deleteBook(id) {
  const targetBook = findIndex(id);
  if (targetBook === -1) return;
  books.splice(targetBook, 1);
  document.dispatchEvent(new Event(RENDER_BOOKS));
  saveLocalStorage();
}

function editBook(id) {
  const targetBook = findIndex(id);
  if (targetBook === -1) return;

  const status = document.querySelectorAll(".status");
  const target = findTarget(status, id);

  const container = document.createElement("div");
  container.innerHTML = `&nbsp;
    <form id="bookForm" data-testid="bookForm">
      <div>
        <label>Judul</label>
        <input value="${books[targetBook].title}" id="editTitle" required/>
      </div>
      <div>
        <label>Penulis</label>
        <input value="${books[targetBook].author}" id="editAuthor" required/>
      </div>
      <div>
        <label>Tahun</label>
        <input value="${books[targetBook].year}" id="editYear" required />
      </div>
      <button id="editButton" type="submit">Save</button>
      <button id="cancelEdit" type="reset">Cancel</button>
    </form>
  `;
  target.append(container);
  document.getElementById("editButton").addEventListener("click", function (event) {
    event.preventDefault();
    books[targetBook].title = document.getElementById("editTitle").value;
    books[targetBook].author = document.getElementById("editAuthor").value;
    books[targetBook].year = parseInt(document.getElementById("editYear").value);
    document.dispatchEvent(new Event(RENDER_BOOKS));
    saveLocalStorage();
  });
  document.getElementById("cancelEdit").addEventListener("click", function () {
    container.innerHTML = "";
  });
}

document.getElementById("searchSubmit").addEventListener("click", function (event) {
  event.preventDefault();
  let result = [];
  const search = document.getElementById("searchBookTitle").value.toLowerCase();
  if (search === 0 || search === null || search === "") {
    document.dispatchEvent(new Event(RENDER_BOOKS));
    return;
  }
  for (const book of books) {
    if (book.title.toLowerCase().includes(search)) result.push(book);
  }
  bookComplete(result);
  bookIncomplete(result);
});

function bookComplete(result) {
  const incompleteBook = document.getElementById("incompleteBookList");
  const completeBook = document.getElementById("completeBookList");
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";
  for (const book of result) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
}

function bookIncomplete(result) {
  const incompleteBook = document.getElementById("incompleteBookList");
  const completeBook = document.getElementById("completeBookList");
  incompleteBook.innerHTML = "";
  completeBook.innerHTML = "";
  for (const book of result) {
    const bookElement = makeBook(book);
    if (!book.isComplete) {
      incompleteBook.append(bookElement);
    } else {
      completeBook.append(bookElement);
    }
  }
}
