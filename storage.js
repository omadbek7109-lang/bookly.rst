/* ==========================================================================
   Bookly Mini — Local Storage
   ========================================================================== */

const STORAGE_KEY = "bookly-mini-books-v1";

function generateId() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 9)
  );
}

function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const books = JSON.parse(raw);

    return Array.isArray(books) ? books : [];
  } catch (error) {
    console.error("Kitoblarni yuklashda xato:", error);
    return [];
  }
}

function saveBooks(books) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(books)
    );

    return true;
  } catch (error) {
    console.error("Kitoblarni saqlashda xato:", error);
    return false;
  }
}

function createBook(data = {}) {
  const books = loadBooks();

  const now = new Date().toISOString();

  const book = {
    id: generateId(),

    title: data.title || "Yangi kitob",

    author: data.author || "",

    description: data.description || "",

    cover: data.cover || "",

    theme: data.theme || "classic",

    audio: data.audio || null,

    createdAt: now,

    updatedAt: now,

    chapters: [
      {
        id: generateId(),

        title: "1-bob",

        blocks: [
          {
            id: generateId(),
            type: "text",
            content: ""
          }
        ]
      }
    ]
  };

  books.push(book);

  saveBooks(books);

  return book;
}

function getBook(bookId) {
  const books = loadBooks();

  return books.find(
    book => book.id === bookId
  ) || null;
}

function updateBook(bookId, changes = {}) {
  const books = loadBooks();

  const index = books.findIndex(
    book => book.id === bookId
  );

  if (index === -1) {
    return null;
  }

  books[index] = {
    ...books[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };

  saveBooks(books);

  return books[index];
}

function deleteBook(bookId) {
  const books = loadBooks();

  const filtered = books.filter(
    book => book.id !== bookId
  );

  saveBooks(filtered);

  return true;
}

function duplicateBook(bookId) {
  const original = getBook(bookId);

  if (!original) {
    return null;
  }

  const copy = JSON.parse(
    JSON.stringify(original)
  );

  copy.id = generateId();

  copy.title =
    `${original.title} — nusxa`;

  copy.createdAt =
    new Date().toISOString();

  copy.updatedAt =
    new Date().toISOString();

  copy.chapters = copy.chapters.map(chapter => {
    return {
      ...chapter,
      id: generateId(),

      blocks: (chapter.blocks || []).map(block => ({
        ...block,
        id: generateId()
      }))
    };
  });

  const books = loadBooks();

  books.push(copy);

  saveBooks(books);

  return copy;
}

function addChapter(bookId, title = "Yangi bob") {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapter = {
    id: generateId(),

    title,

    blocks: [
      {
        id: generateId(),
        type: "text",
        content: ""
      }
    ]
  };

  book.chapters.push(chapter);

  updateBook(bookId, {
    chapters: book.chapters
  });

  return chapter;
}

function updateChapter(
  bookId,
  chapterId,
  changes = {}
) {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapter = book.chapters.find(
    item => item.id === chapterId
  );

  if (!chapter) {
    return null;
  }

  Object.assign(chapter, changes);

  updateBook(bookId, {
    chapters: book.chapters
  });

  return chapter;
}

function deleteChapter(
  bookId,
  chapterId
) {
  const book = getBook(bookId);

  if (!book) {
    return false;
  }

  if (book.chapters.length <= 1) {
    return false;
  }

  book.chapters =
    book.chapters.filter(
      chapter => chapter.id !== chapterId
    );

  updateBook(bookId, {
    chapters: book.chapters
  });

  return true;
}

function addBlock(
  bookId,
  chapterId,
  type = "text",
  content = ""
) {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapter = book.chapters.find(
    item => item.id === chapterId
  );

  if (!chapter) {
    return null;
  }

  const block = {
    id: generateId(),

    type,

    content
  };

  chapter.blocks.push(block);

  updateBook(bookId, {
    chapters: book.chapters
  });

  return block;
}

function updateBlock(
  bookId,
  chapterId,
  blockId,
  changes = {}
) {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapter = book.chapters.find(
    item => item.id === chapterId
  );

  if (!chapter) {
    return null;
  }

  const block = chapter.blocks.find(
    item => item.id === blockId
  );

  if (!block) {
    return null;
  }

  Object.assign(block, changes);

  updateBook(bookId, {
    chapters: book.chapters
  });

  return block;
}

function deleteBlock(
  bookId,
  chapterId,
  blockId
) {
  const book = getBook(bookId);

  if (!book) {
    return false;
  }

  const chapter = book.chapters.find(
    item => item.id === chapterId
  );

  if (!chapter) {
    return false;
  }

  chapter.blocks =
    chapter.blocks.filter(
      block => block.id !== blockId
    );

  updateBook(bookId, {
    chapters: book.chapters
  });

  return true;
}

function moveBlock(
  bookId,
  chapterId,
  blockId,
  direction
) {
  const book = getBook(bookId);

  if (!book) {
    return false;
  }

  const chapter = book.chapters.find(
    item => item.id === chapterId
  );

  if (!chapter) {
    return false;
  }

  const index =
    chapter.blocks.findIndex(
      block => block.id === blockId
    );

  if (index === -1) {
    return false;
  }

  const newIndex =
    direction === "up"
      ? index - 1
      : index + 1;

  if (
    newIndex < 0 ||
    newIndex >= chapter.blocks.length
  ) {
    return false;
  }

  const temp =
    chapter.blocks[index];

  chapter.blocks[index] =
    chapter.blocks[newIndex];

  chapter.blocks[newIndex] =
    temp;

  updateBook(bookId, {
    chapters: book.chapters
  });

  return true;
}

function clearAllBooks() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

window.BooklyStorage = {
  generateId,
  loadBooks,
  saveBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
  duplicateBook,
  addChapter,
  updateChapter,
  deleteChapter,
  addBlock,
  updateBlock,
  deleteBlock,
  moveBlock,
  clearAllBooks
};
