// ============================================================
// Bookly Mini — Preview / Reader
// ============================================================

window.BooklyPreview = (() => {

  let currentBookId = null;

  function getRoot() {
    return document.getElementById("preview-root");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function sanitizeHtml(value) {

    const temp = document.createElement("div");

    temp.innerHTML = value || "";

    temp
      .querySelectorAll(
        "script, iframe, object, embed, style"
      )
      .forEach(el => el.remove());

    temp.querySelectorAll("*").forEach(el => {

      [...el.attributes].forEach(attr => {

        if (
          attr.name
            .toLowerCase()
            .startsWith("on")
          ||
          (
            attr.name.toLowerCase() === "href" &&
            attr.value
              .trim()
              .toLowerCase()
              .startsWith("javascript:")
          )
        ) {
          el.removeAttribute(attr.name);
        }

      });

    });

    return temp.innerHTML;
  }


  function renderBlock(block) {

    if (!block) return "";

    switch (block.type) {

      case "heading":

        return `
          <h2 class="reader-heading">
            ${escapeHtml(
              block.content || "Sarlavha"
            )}
          </h2>
        `;


      case "text":

        return `
          <div class="reader-text">
            ${sanitizeHtml(
              block.content || ""
            )}
          </div>
        `;


      case "quote":

        return `
          <blockquote class="reader-quote">
            ${sanitizeHtml(
              block.content || ""
            )}
          </blockquote>
        `;


      case "image":

        if (!block.content) return "";

        return `
          <figure class="reader-image">

            <img
              src="${block.content}"
              alt="${escapeHtml(
                block.alt || "Kitob rasmi"
              )}"
            />

            ${
              block.caption
                ? `
                  <figcaption>
                    ${escapeHtml(block.caption)}
                  </figcaption>
                `
                : ""
            }

          </figure>
        `;


      case "divider":

        return `
          <hr class="reader-divider" />
        `;


      default:

        return "";

    }

  }


  function renderChapter(chapter, index) {

    if (!chapter) return "";

    const blocks =
      Array.isArray(chapter.blocks)
        ? chapter.blocks
        : [];

    return `

      <article class="reader-chapter">

        <div class="reader-chapter-number">
          ${index + 1}-bob
        </div>

        <h1 class="reader-chapter-title">
          ${escapeHtml(
            chapter.title ||
            `Bob ${index + 1}`
          )}
        </h1>

        <div class="reader-chapter-content">

          ${blocks
            .map(renderBlock)
            .join("")}

        </div>

      </article>

    `;

  }


  function renderAudio(book) {

    if (
      !book ||
      !book.audio ||
      !book.audio.dataUrl
    ) {
      return "";
    }

    return `

      <div class="reader-audio">

        <div class="reader-audio-title">
          🎵 Kitob audiosi
        </div>

        <audio
          controls
          preload="metadata"
        >

          <source
            src="${book.audio.dataUrl}"
            type="${
              book.audio.type ||
              "audio/mpeg"
            }"
          />

          Brauzeringiz audio formatini
          qo‘llab-quvvatlamaydi.

        </audio>

      </div>

    `;

  }


  function renderBook(book) {

    const root = getRoot();

    if (!root || !book) return;

    currentBookId = book.id;

    const chapters =
      Array.isArray(book.chapters)
        ? book.chapters
        : [];

    root.className =
      `reader theme-${
        book.theme || "classic"
      }`;

    root.innerHTML = `

      <!-- COVER -->

      <div class="reader-cover">

        ${
          book.cover
            ? `
              <img
                class="reader-cover-image"
                src="${book.cover}"
                alt="${escapeHtml(
                  book.title
                )}"
              />
            `
            : `
              <div class="reader-cover-placeholder">
                📖
              </div>
            `
        }

        <div class="reader-cover-info">

          <h1 class="reader-book-title">
            ${escapeHtml(
              book.title ||
              "Nomsiz kitob"
            )}
          </h1>

          ${
            book.author
              ? `
                <p class="reader-book-author">
                  ${escapeHtml(
                    book.author
                  )}
                </p>
              `
              : ""
          }

          ${
            book.description
              ? `
                <p class="reader-book-description">
                  ${escapeHtml(
                    book.description
                  )}
                </p>
              `
              : ""
          }

        </div>

      </div>


      <!-- AUDIO -->

      ${renderAudio(book)}


      <!-- CHAPTERS -->

      ${
        chapters.length

          ? chapters
              .map(
                (chapter, index) =>
                  renderChapter(
                    chapter,
                    index
                  )
              )
              .join("")

          : `

            <div class="reader-empty">

              <div class="reader-empty-icon">
                📖
              </div>

              <p>
                Bu kitobda hali boblar mavjud emas.
              </p>

            </div>

          `
      }


      <!-- FOOTER -->

      <div class="reader-footer">

        <div>
          📚 Bookly Mini
        </div>

        <div>
          Elektron kitob
        </div>

      </div>

    `;

  }


  function open(bookId) {

    const book =
      BooklyStorage.getBook(bookId);

    if (!book) {

      console.warn(
        "Preview: kitob topilmadi:",
        bookId
      );

      return;

    }

    currentBookId = bookId;

    renderBook(book);

    const editorView =
      document.getElementById(
        "view-editor"
      );

    const previewView =
      document.getElementById(
        "view-preview"
      );

    if (editorView) {
      editorView.classList.add(
        "hidden"
      );
    }

    if (previewView) {
      previewView.classList.remove(
        "hidden"
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function refresh() {

    if (!currentBookId) return;

    const book =
      BooklyStorage.getBook(
        currentBookId
      );

    if (book) {
      renderBook(book);
    }

  }


  function close() {

    const previewView =
      document.getElementById(
        "view-preview"
      );

    if (previewView) {
      previewView.classList.add(
        "hidden"
      );
    }

  }


  function getCurrentBookId() {
    return currentBookId;
  }


  // ==========================================================
  // BUTTON SETUP
  // ==========================================================

  function setup() {

    // BACK BUTTON

    const backButton =
      document.getElementById(
        "preview-back"
      );

    if (backButton) {

      backButton.addEventListener(
        "click",
        () => {

          close();

          const editorView =
            document.getElementById(
              "view-editor"
            );

          if (editorView) {

            editorView.classList.remove(
              "hidden"
            );

          }

        }
      );

    }


    // POWERPOINT BUTTON

    const exportButton =
      document.getElementById(
        "preview-export-btn"
      );

    if (exportButton) {

      exportButton.addEventListener(
        "click",
        () => {

          if (
            window.BooklyPowerPoint &&
            typeof
              BooklyPowerPoint.exportPPTX ===
              "function"
          ) {

            BooklyPowerPoint.exportPPTX(
              currentBookId
            );

          } else {

            alert(
              "PowerPoint moduli yuklanmagan."
            );

          }

        }
      );

    }

  }


  return {

    open,

    close,

    refresh,

    renderBook,

    setup,

    getCurrentBookId

  };

})();


document.addEventListener(
  "DOMContentLoaded",
  () => {

    BooklyPreview.setup();

  }
);


console.log(
  "Bookly Preview tayyor."
); 
