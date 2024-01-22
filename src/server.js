const express = require("express");
const { nanoid } = require("nanoid"); // impor modul nanoid
const app = express();
const port = 9000;

app.use(express.json());
const books = [];

app.post("/books", (req, res) => {
  const book = req.body;

  if (!book.name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
  }

  if (book.readPage > book.pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  book.id = nanoid();
  book.finished = book.pageCount === book.readPage;
  book.insertedAt = new Date().toISOString();
  book.updatedAt = book.insertedAt;

  books.push(book);

  res.status(201).json({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: book.id,
    },
  });
});

app.get("/books", (req, res) => {
  const filter = req.query;

  // const filter = {
  //   reading: reading === undefined ? undefined : reading == 1 ? true : false,
  //   finished: finished === undefined ? undefined : finished == 1 ? true : false,
  //   name: name.toLowerCase(),
  // };

  const filteredBooks = books.filter((book) => {
    for (const key in filter) {
      if (book[key] != filter[key] && filter[key] !== undefined) {
        if (
          key === "name" &&
          book[key].toLowerCase().includes(filter[key].toLowerCase())
        ) {
          return true;
        }
        return false;
      }
    }
    return true;
  });

  console.log(filteredBooks);

  const newBooks = filteredBooks.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  res.status(200).json({
    status: "success",
    data: {
      books: newBooks,
    },
  });
});

app.get("/books/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

app.put("/books/:bookId", (req, res) => {
  const bookId = req.params.bookId;
  const newBook = req.body;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
  }

  if (!newBook.name) {
    return res.status(400).json({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
  }

  if (newBook.readPage > newBook.pageCount) {
    return res.status(400).json({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...newBook,
    finished: newBook.pageCount === newBook.readPage,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
});

app.delete("/books/:bookId", (req, res) => {
  const bookId = req.params.bookId;

  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
  }

  books.splice(bookIndex, 1);

  res.status(200).json({
    status: "success",
    message: "Buku berhasil dihapus",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
