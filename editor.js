/* ==========================================================================
   Bookly Mini — Editor
   ========================================================================== */

(function () {
  "use strict";

  let currentBookId = null;
  let currentChapterId = null;

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));

  function getBook() {
    if (!currentBookId) return null;

    return BooklyStorage.getBook(
      currentBookId
    );
  }

  function getChapter() {
    const book = getBook();

    if (!book) return null;

    return book.chapters.find(
      chapter =>
        chapter.id === currentChapterId
    ) || null;
  }

  function openEditor(bookId) {
    const book =
      BooklyStorage.getBook(bookId);

    if (!book) return;

    currentBookId = bookId;

    if (!book.chapters.length) {
      BooklyStorage.addChapter(
        bookId,
        "1-bob"
      );
    }

    const updatedBook =
      BooklyStorage.getBook(bookId);

    currentChapterId =
      updatedBook.chapters[0].id;

    renderEditor();

    window.dispatchEvent(
      new CustomEvent("bookly:openEditor", {
        detail: {
          bookId
        }
      })
    );
  }

  function renderEditor() {
    const book = getBook();

    if (!book) return;

    const titleInput =
      $("#editor-book-title");

    if (titleInput) {
      titleInput.value =
        book.title || "";
    }

    renderChapterList();

    renderChapter();

    renderAudio();

    updateThemeButtons();
  }

  function renderChapterList() {
    const list =
      $("#editor-chapter-list");

    const book = getBook();

    if (!list || !book) return;

    list.innerHTML = "";

    book.chapters.forEach(
      (chapter, index) => {

        const li =
          document.createElement("li");

        li.className =
          "chapter-item" +
          (
            chapter.id ===
            currentChapterId
              ? " active"
              : ""
          );

        const number =
          document.createElement("span");

        number.className =
          "chapter-item-num";

        number.textContent =
          `${index + 1}.`;

        const title =
          document.createElement("span");

        title.className =
          "chapter-item-title";

        title.textContent =
          chapter.title ||
          "Nomsiz bob";

        const del =
          document.createElement("button");

        del.className =
          "chapter-item-del";

        del.type = "button";

        del.textContent = "✕";

        del.title =
          "Bobni o‘chirish";

        li.appendChild(number);
        li.appendChild(title);
        li.appendChild(del);

        li.addEventListener(
          "click",
          event => {

            if (
              event.target === del
            ) {
              deleteChapter(
                chapter.id
              );

              return;
            }

            currentChapterId =
              chapter.id;

            renderEditor();
          }
        );

        list.appendChild(li);
      }
    );
  }

  function renderChapter() {
    const chapter =
      getChapter();

    if (!chapter) return;

    const titleInput =
      $("#editor-chapter-title");

    if (titleInput) {
      titleInput.value =
        chapter.title || "";
    }

    const container =
      $("#editor-blocks");

    if (!container) return;

    container.innerHTML = "";

    if (
      !chapter.blocks ||
      !chapter.blocks.length
    ) {
      const hint =
        document.createElement("div");

      hint.className =
        "editor-empty-hint";

      hint.textContent =
        "Hali blok yo‘q. Pastdagi tugmalardan birini tanlang.";

      container.appendChild(hint);

      return;
    }

    chapter.blocks.forEach(
      (block, index) => {

        const wrapper =
          createBlockElement(
            block,
            index
          );

        container.appendChild(
          wrapper
        );
      }
    );
  }

  function createBlockElement(
    block,
    index
  ) {
    const wrapper =
      document.createElement("div");

    wrapper.className =
      "block-wrap";

    wrapper.dataset.blockId =
      block.id;

    let content;

    if (block.type === "heading") {

      const input =
        document.createElement("input");

      input.className =
        "block-heading-input";

      input.placeholder =
        "Sarlavha";

      input.value =
        block.content || "";

      input.addEventListener(
        "input",
        () => {
          updateBlock(
            block.id,
            {
              content: input.value
            }
          );
        }
      );

      content = input;

    } else if (
      block.type === "text"
    ) {

      const toolbar =
        createTextToolbar();

      const editable =
        document.createElement("div");

      editable.className =
        "block-text-input";

      editable.contentEditable =
        "true";

      editable.innerHTML =
        block.content || "";

      editable.addEventListener(
        "input",
        () => {
          updateBlock(
            block.id,
            {
              content:
                editable.innerHTML
            }
          );
        }
      );

      content =
        document.createElement("div");

      content.appendChild(
        toolbar
      );

      content.appendChild(
        editable
      );

    } else if (
      block.type === "quote"
    ) {

      const editable =
        document.createElement("div");

      editable.className =
        "block-quote-input";

      editable.contentEditable =
        "true";

      editable.innerHTML =
        block.content || "";

      editable.addEventListener(
        "input",
        () => {
          updateBlock(
            block.id,
            {
              content:
                editable.innerHTML
            }
          );
        }
      );

      content = editable;

    } else if (
      block.type === "image"
    ) {

      content =
        createImageBlock(
          block
        );

    } else if (
      block.type === "divider"
    ) {

      const divider =
        document.createElement("hr");

      divider.className =
        "block-divider-preview";

      content = divider;

    } else {

      const editable =
        document.createElement("div");

      editable.contentEditable =
        "true";

      editable.className =
        "block-text-input";

      editable.innerHTML =
        block.content || "";

      editable.addEventListener(
        "input",
        () => {
          updateBlock(
            block.id,
            {
              content:
                editable.innerHTML
            }
          );
        }
      );

      content = editable;
    }

    wrapper.appendChild(content);

    const actions =
      document.createElement("div");

    actions.className =
      "block-actions";

    const up =
      createActionButton(
        "↑",
        "Yuqoriga",
        () =>
          moveBlock(
            block.id,
            "up"
          )
      );

    const down =
      createActionButton(
        "↓",
        "Pastga",
        () =>
          moveBlock(
            block.id,
            "down"
          )
      );

    const duplicate =
      createActionButton(
        "⧉",
        "Nusxalash",
        () =>
          duplicateBlock(
            block.id
          )
      );

    const remove =
      createActionButton(
        "🗑",
        "O‘chirish",
        () =>
          removeBlock(
            block.id
          )
      );

    actions.appendChild(up);
    actions.appendChild(down);
    actions.appendChild(duplicate);
    actions.appendChild(remove);

    wrapper.appendChild(actions);

    return wrapper;
  }

  function createActionButton(
    text,
    title,
    handler
  ) {
    const button =
      document.createElement("button");

    button.type = "button";

    button.textContent = text;

    button.title = title;

    button.addEventListener(
      "click",
      handler
    );

    return button;
  }

  function createTextToolbar() {
    const toolbar =
      document.createElement("div");

    toolbar.className =
      "block-text-toolbar";

    const commands = [
      ["B", "bold"],
      ["I", "italic"],
      ["U", "underline"],
      ["•", "insertUnorderedList"],
      ["1.", "insertOrderedList"]
    ];

    commands.forEach(
      ([label, command]) => {

        const button =
          document.createElement("button");

        button.type = "button";

        button.textContent =
          label;

        button.addEventListener(
          "mousedown",
          event => {

            event.preventDefault();

            document.execCommand(
              command,
              false,
              null
            );
          }
        );

        toolbar.appendChild(
          button
        );
      }
    );

    return toolbar;
  }

  function createImageBlock(block) {
    const wrapper =
      document.createElement("div");

    if (block.content) {

      const img =
        document.createElement("img");

      img.className =
        "block-image-preview";

      img.src =
        block.content;

      img.alt =
        "Kitob rasmi";

      wrapper.appendChild(
        img
      );

    } else {

      const label =
        document.createElement("label");

      label.className =
        "block-image-upload";

      label.textContent =
        "🖼️ Rasm tanlash";

      const input =
        document.createElement("input");

      input.type = "file";

      input.accept =
        "image/*";

      input.hidden = true;

      input.addEventListener(
        "change",
        () => {

          const file =
            input.files?.[0];

          if (!file) return;

          readFileAsDataURL(
            file,
            dataUrl => {

              updateBlock(
                block.id,
                {
                  content: dataUrl
                }
              );

              renderChapter();
            }
          );
        }
      );

      label.appendChild(
        input
      );

      wrapper.appendChild(
        label
      );
    }

    return wrapper;
  }

  function readFileAsDataURL(
    file,
    callback
  ) {
    const reader =
      new FileReader();

    reader.onload =
      () => callback(
        reader.result
      );

    reader.readAsDataURL(file);
  }

  function updateBlock(
    blockId,
    changes
  ) {
    if (
      !currentBookId ||
      !currentChapterId
    ) {
      return;
    }

    BooklyStorage.updateBlock(
      currentBookId,
      currentChapterId,
      blockId,
      changes
    );
  }

  function moveBlock(
    blockId,
    direction
  ) {
    BooklyStorage.moveBlock(
      currentBookId,
      currentChapterId,
      blockId,
      direction
    );

    renderChapter();
  }

  function removeBlock(blockId) {
    BooklyStorage.deleteBlock(
      currentBookId,
      currentChapterId,
      blockId
    );

    renderChapter();
  }

  function duplicateBlock(blockId) {
    const book = getBook();

    const chapter = getChapter();

    if (!book || !chapter) {
      return;
    }

    const index =
      chapter.blocks.findIndex(
        block =>
          block.id === blockId
      );

    if (index === -1) {
      return;
    }

    const original =
      chapter.blocks[index];

    const copy = {
      ...JSON.parse(
        JSON.stringify(original)
      ),
      id:
        BooklyStorage.generateId()
    };

    chapter.blocks.splice(
      index + 1,
      0,
      copy
    );

    BooklyStorage.updateChapter(
      currentBookId,
      currentChapterId,
      {
        blocks:
          chapter.blocks
      }
    );

    renderChapter();
  }

  function addBlock(type) {
    if (
      !currentBookId ||
      !currentChapterId
    ) {
      return;
    }

    BooklyStorage.addBlock(
      currentBookId,
      currentChapterId,
      type,
      ""
    );

    renderChapter();
  }

  function addChapter() {
    if (!currentBookId) {
      return;
    }

    const chapter =
      BooklyStorage.addChapter(
        currentBookId,
        `Yangi bob`
      );

    if (!chapter) {
      return;
    }

    currentChapterId =
      chapter.id;

    renderEditor();
  }

  function deleteChapter(
    chapterId
  ) {
    const book = getBook();

    if (!book) return;

    if (book.chapters.length <= 1) {

      if (
        window.BooklyTelegram
      ) {
        BooklyTelegram.showAlert(
          "Kitobda kamida bitta bob bo‘lishi kerak."
        );
      } else {
        alert(
          "Kitobda kamida bitta bob bo‘lishi kerak."
        );
      }

      return;
    }

    const remove =
      () => {

        BooklyStorage.deleteChapter(
          currentBookId,
          chapterId
        );

        if (
          currentChapterId ===
          chapterId
        ) {
          const updated =
            getBook();

          currentChapterId =
            updated.chapters[0].id;
        }

        renderEditor();
      };

    if (
      window.BooklyTelegram
    ) {
      BooklyTelegram.showConfirm(
        "Bu bobni o‘chirishni xohlaysizmi?",
        confirmed => {
          if (confirmed) {
            remove();
          }
        }
      );
    } else if (
      confirm(
        "Bu bobni o‘chirishni xohlaysizmi?"
      )
    ) {
      remove();
    }
  }

  function updateTitle(value) {
    if (!currentBookId) return;

    BooklyStorage.updateBook(
      currentBookId,
      {
        title: value
      }
    );
  }

  function updateChapterTitle(value) {
    if (
      !currentBookId ||
      !currentChapterId
    ) {
      return;
    }

    BooklyStorage.updateChapter(
      currentBookId,
      currentChapterId,
      {
        title: value
      }
    );

    renderChapterList();
  }

  function updateTheme(theme) {
    if (!currentBookId) {
      return;
    }

    BooklyStorage.updateBook(
      currentBookId,
      {
        theme
      }
    );

    updateThemeButtons();
  }

  function updateThemeButtons() {
    const book = getBook();

    if (!book) return;

    $$("[data-theme-choice]")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.themeChoice ===
            book.theme
        );
      });
  }

  function renderAudio() {
    const book = getBook();

    if (!book) return;

    const name =
      $("#editor-audio-name");

    const preview =
      $("#editor-audio-preview");

    if (name) {
      name.textContent =
        book.audio?.name ||
        "Audio biriktirilmagan";
    }

    if (!preview) return;

    preview.innerHTML = "";

    if (
      book.audio?.data
    ) {

      const audio =
        document.createElement(
          "audio"
        );

      audio.controls = true;

      audio.src =
        book.audio.data;

      audio.style.width =
        "100%";

      preview.appendChild(
        audio
      );
    }
  }

  function addAudio(file) {
    if (!currentBookId || !file) {
      return;
    }

    readFileAsDataURL(
      file,
      dataUrl => {

        BooklyStorage.updateBook(
          currentBookId,
          {
            audio: {
              name: file.name,
              type: file.type,
              data: dataUrl
            }
          }
        );

        renderAudio();
      }
    );
  }

  function removeAudio() {
    if (!currentBookId) return;

    BooklyStorage.updateBook(
      currentBookId,
      {
        audio: null
      }
    );

    renderAudio();
  }

  function setupEvents() {

    const titleInput =
      $("#editor-book-title");

    if (titleInput) {

      titleInput.addEventListener(
        "input",
        () => {
          updateTitle(
            titleInput.value
          );
        }
      );
    }

    const chapterTitle =
      $("#editor-chapter-title");

    if (chapterTitle) {

      chapterTitle.addEventListener(
        "input",
        () => {
          updateChapterTitle(
            chapterTitle.value
          );
        }
      );
    }

    const addChapterButton =
      $("#editor-add-chapter");

    if (addChapterButton) {

      addChapterButton.addEventListener(
        "click",
        addChapter
      );
    }

    $$("[data-add-block]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            addBlock(
              button.dataset.addBlock
            );
          }
        );
      });

    $$("[data-theme-choice]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            updateTheme(
              button.dataset.themeChoice
            );
          }
        );
      });

    const audioInput =
      $("#editor-audio-input");

    if (audioInput) {

      audioInput.addEventListener(
        "change",
        () => {

          const file =
            audioInput.files?.[0];

          if (file) {
            addAudio(file);
          }

          audioInput.value = "";
        }
      );
    }

    const removeAudioButton =
      $("#editor-audio-remove");

    if (removeAudioButton) {

      removeAudioButton.addEventListener(
        "click",
        removeAudio
      );
    }
  }

  setupEvents();

  window.BooklyEditor = {
    openEditor,

    getCurrentBook() {
      return getBook();
    },

    getCurrentChapter() {
      return getChapter();
    },

    getCurrentBookId() {
      return currentBookId;
    },

    getCurrentChapterId() {
      return currentChapterId;
    },

    render() {
      renderEditor();
    }
  };

})();
