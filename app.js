// ============================================================
// Bookly Mini — Main App
// ============================================================

(() => {
  "use strict";

  let currentView = "dashboard";
  let selectedCoverData = "";
  let selectedTheme = "classic";

  const $ = (selector) =>
    document.querySelector(selector);

  const $$ = (selector) =>
    [...document.querySelectorAll(selector)];

  // ----------------------------------------------------------
  // Views
  // ----------------------------------------------------------

  function showView(viewName) {
    const views = {
      dashboard: "view-dashboard",
      editor: "view-editor",
      preview: "view-preview",
      settings: "view-settings"
    };

    Object.entries(views).forEach(([name, id]) => {
      const element = document.getElementById(id);

      if (!element) return;

      if (name === viewName) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    });

    currentView = viewName;

    updateBottomNavigation();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function updateBottomNavigation() {
    $$(".nav-btn").forEach(button => {
      const target = button.dataset.nav;

      button.classList.toggle(
        "active",
        target === currentView ||
        (
          currentView === "editor" &&
          target === "dashboard"
        ) ||
        (
          currentView === "preview" &&
          target === "dashboard"
        )
      );
    });
  }

  // ----------------------------------------------------------
  // Dashboard
  // ----------------------------------------------------------

  function renderDashboard() {
    const books =
      BooklyStorage.loadBooks();

    const grid =
      $("#book-grid");

    const empty =
      $("#dashboard-empty");

    if (!grid) return;

    grid.innerHTML = "";

    if (!books.length) {
      empty?.classList.remove("hidden");
      return;
    }

    empty?.classList.add("hidden");

    books.forEach(book => {
      grid.appendChild(
        createBookCard(book)
      );
    });
  }

  function createBookCard(book) {
    const card =
      document.createElement("article");

    card.className = "book-card";

    const cover = book.cover
      ? `
        <img
          class="book-card-cover"
          src="${book.cover}"
          alt="${escapeHtml(book.title)}"
        />
      `
      : `
        <div class="book-card-cover book-card-placeholder">
          📖
        </div>
      `;

    const chapterCount =
      Array.isArray(book.chapters)
        ? book.chapters.length
        : 0;

    card.innerHTML = `
      <div class="book-card-cover-wrap">
        ${cover}
      </div>

      <div class="book-card-body">
        <h3 class="book-card-title">
          ${escapeHtml(book.title || "Nomsiz kitob")}
        </h3>

        ${
          book.author
            ? `
              <p class="book-card-author">
                ${escapeHtml(book.author)}
              </p>
            `
            : ""
        }

        <p class="book-card-meta">
          ${chapterCount} ta bob
        </p>

        <div class="book-card-actions">
          <button
            class="btn btn-primary btn-small"
            data-action="open"
          >
            ✏️ Ochish
          </button>

          <button
            class="btn btn-ghost btn-small"
            data-action="preview"
          >
            👀
          </button>

          <button
            class="btn btn-ghost btn-small"
            data-action="duplicate"
          >
            📑
          </button>

          <button
            class="btn btn-ghost btn-small"
            data-action="delete"
          >
            🗑️
          </button>
        </div>
      </div>
    `;

    card
      .querySelector('[data-action="open"]')
      ?.addEventListener("click", () => {
        openEditor(book.id);
      });

    card
      .querySelector('[data-action="preview"]')
      ?.addEventListener("click", () => {
        openPreview(book.id);
      });

    card
      .querySelector('[data-action="duplicate"]')
      ?.addEventListener("click", () => {
        duplicateBook(book.id);
      });

    card
      .querySelector('[data-action="delete"]')
      ?.addEventListener("click", () => {
        deleteBook(book.id);
      });

    return card;
  }

  // ----------------------------------------------------------
  // New Book Modal
  // ----------------------------------------------------------

  function openNewBookModal() {
    const modal =
      $("#new-book-modal");

    if (!modal) return;

    selectedCoverData = "";
    selectedTheme = "classic";

    const titleInput =
      $("#new-book-title");

    const authorInput =
      $("#new-book-author");

    const descInput =
      $("#new-book-desc");

    const coverPreview =
      $("#new-book-cover-preview");

    if (titleInput) titleInput.value = "";
    if (authorInput) authorInput.value = "";
    if (descInput) descInput.value = "";

    if (coverPreview) {
      coverPreview.innerHTML = "";
    }

    $$(".theme-swatch[data-theme-pick]")
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.themePick === "classic"
        );
      });

    modal.classList.remove("hidden");

    setTimeout(() => {
      titleInput?.focus();
    }, 100);
  }

  function closeNewBookModal() {
    $("#new-book-modal")
      ?.classList.add("hidden");
  }

  function handleCoverSelection(event) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Iltimos, rasm faylini tanlang.");
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      selectedCoverData =
        reader.result;

      const preview =
        $("#new-book-cover-preview");

      if (!preview) return;

      preview.innerHTML = `
        <img
          src="${selectedCoverData}"
          alt="Muqova"
        />
      `;
    };

    reader.readAsDataURL(file);
  }

  function createNewBook(event) {
    event.preventDefault();

    const title =
      $("#new-book-title")?.value.trim();

    const author =
      $("#new-book-author")?.value.trim();

    const description =
      $("#new-book-desc")?.value.trim();

    if (!title) {
      alert("Kitob nomini kiriting.");
      return;
    }

    const book =
      BooklyStorage.createBook({
        title,
        author,
        description,
        cover: selectedCoverData,
        theme: selectedTheme
      });

    closeNewBookModal();

    renderDashboard();

    openEditor(book.id);
  }

  // ----------------------------------------------------------
  // Editor
  // ----------------------------------------------------------

  function openEditor(bookId) {
    if (
      !window.BooklyEditor ||
      typeof BooklyEditor.openEditor !== "function"
    ) {
      console.error("BooklyEditor topilmadi.");
      return;
    }

    showView("editor");

    BooklyEditor.openEditor(bookId);
  }

  // ----------------------------------------------------------
  // Preview
  // ----------------------------------------------------------

  function openPreview(bookId) {
    if (
      !window.BooklyPreview ||
      typeof BooklyPreview.open !== "function"
    ) {
      console.error("BooklyPreview topilmadi.");
      return;
    }

    showView("preview");

    BooklyPreview.open(bookId);
  }

  // ----------------------------------------------------------
  // Duplicate
  // ----------------------------------------------------------

  function duplicateBook(bookId) {
    const book =
      BooklyStorage.getBook(bookId);

    if (!book) return;

    const duplicate =
      BooklyStorage.duplicateBook(bookId);

    if (!duplicate) return;

    renderDashboard();

    if (
      window.BooklyTelegram &&
      typeof BooklyTelegram.haptic === "function"
    ) {
      BooklyTelegram.haptic("success");
    }
  }

  // ----------------------------------------------------------
  // Delete
  // ----------------------------------------------------------

async function deleteBook(bookId) {
  const book = BooklyStorage.getBook(bookId);

  if (!book) return;

  const title = book.title || "Nomsiz kitob";

  const confirmed = await showBooklyConfirm(
  title,
  "Bu amalni qaytarib bo‘lmaydi."
);

if (!confirmed) return;

  BooklyStorage.deleteBook(bookId);

  renderDashboard();

  if (
    currentView === "editor" ||
    currentView === "preview"
  ) {
    showView("dashboard");
  }

  if (
    window.BooklyTelegram &&
    typeof BooklyTelegram.haptic === "function"
  ) {
    BooklyTelegram.haptic("success");
  }
  }
function showBooklyConfirm(title, message) {
  return new Promise((resolve) => {
    const oldModal = document.getElementById("bookly-confirm-modal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");

    modal.id = "bookly-confirm-modal";

    modal.innerHTML = `
      <div class="bookly-confirm-overlay">
        <div class="bookly-confirm-box">

          <div class="bookly-confirm-icon">
            🗑️
          </div>

          <h3>Kitobni o‘chirish?</h3>

          <p class="bookly-confirm-title">
            “${escapeHtml(title)}”
          </p>

          <p class="bookly-confirm-message">
            ${escapeHtml(message)}
          </p>

          <div class="bookly-confirm-actions">
            <button
              type="button"
              class="bookly-confirm-cancel"
              id="bookly-confirm-cancel"
            >
              Bekor qilish
            </button>

            <button
              type="button"
              class="bookly-confirm-delete"
              id="bookly-confirm-delete"
            >
              🗑️ O‘chirish
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = (result) => {
      modal.remove();
      resolve(result);
    };

    document
      .getElementById("bookly-confirm-cancel")
      .addEventListener("click", () => close(false));

    document
      .getElementById("bookly-confirm-delete")
      .addEventListener("click", () => close(true));

    modal
      .querySelector(".bookly-confirm-overlay")
      .addEventListener("click", (event) => {
        if (event.target.classList.contains("bookly-confirm-overlay")) {
          close(false);
        }
      });
  });
}
  // ----------------------------------------------------------
  // Settings / Mode
  // ----------------------------------------------------------

  function setMode(mode) {
    if (
      mode !== "light" &&
      mode !== "dark"
    ) {
      mode = "light";
    }

    document.body.dataset.mode =
      mode;

    localStorage.setItem(
      "bookly-mini-mode",
      mode
    );

    $$(".mode-picker [data-mode-choice]")
      .forEach(button => {
        button.classList.toggle(
          "active",
          button.dataset.modeChoice === mode
        );
      });
  }

  function loadMode() {
    const saved =
      localStorage.getItem(
        "bookly-mini-mode"
      );

    setMode(
      saved === "dark"
        ? "dark"
        : "light"
    );
  }

  // ----------------------------------------------------------
  // Theme Selection
  // ----------------------------------------------------------

  function setupThemePicker() {
    $$("[data-theme-pick]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            selectedTheme =
              button.dataset.themePick;

            $$("[data-theme-pick]")
              .forEach(item => {
                item.classList.toggle(
                  "active",
                  item.dataset.themePick ===
                    selectedTheme
                );
              });
          }
        );
      });
  }

  // ----------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------

  function setupNavigation() {
    $$(".nav-btn")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            const target =
              button.dataset.nav;

            if (target === "dashboard") {
              renderDashboard();
              showView("dashboard");
            }

            if (target === "settings") {
              showView("settings");
            }
          }
        );
      });
  }

  // ----------------------------------------------------------
  // Global Buttons
  // ----------------------------------------------------------

  function setupButtons() {

    $("#btn-new-book")
      ?.addEventListener(
        "click",
        openNewBookModal
      );

    $("#btn-new-book-empty")
      ?.addEventListener(
        "click",
        openNewBookModal
      );

    $("#new-book-close")
      ?.addEventListener(
        "click",
        closeNewBookModal
      );

    $("#new-book-cancel")
      ?.addEventListener(
        "click",
        closeNewBookModal
      );

    $("#new-book-form")
      ?.addEventListener(
        "submit",
        createNewBook
      );

    $("#new-book-cover-input")
      ?.addEventListener(
        "change",
        handleCoverSelection
      );

    $$(".mode-picker [data-mode-choice]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            setMode(
              button.dataset.modeChoice
            );
          }
        );
      });

    $("#editor-back")
      ?.addEventListener(
        "click",
        () => {
          renderDashboard();
          showView("dashboard");
        }
      );

    $("#editor-preview-btn")
      ?.addEventListener(
        "click",
        () => {
          const bookId =
            BooklyEditor.getCurrentBookId();

          if (bookId) {
            openPreview(bookId);
          }
        }
      );
    // PowerPoint Export
    $("#editor-export-btn")
      ?.addEventListener(
        "click",
        () => {
          const bookId =
            BooklyEditor.getCurrentBookId();

          if (!bookId) {
            alert("Avval kitobni oching.");
            return;
          }

          if (
            !window.BooklyPowerPoint ||
            typeof BooklyPowerPoint.exportPPTX !== "function"
          ) {
            alert(
              "PowerPoint moduli yuklanmagan. Internetni tekshiring."
            );
            return;
          }

          BooklyPowerPoint.exportPPTX(bookId);
        }
      );
    // Modal tashqarisiga bosilganda yopish
    $("#new-book-modal")
      ?.addEventListener(
        "click",
        event => {
          if (
            event.target.id ===
            "new-book-modal"
          ) {
            closeNewBookModal();
          }
        }
      );
  }

  // ----------------------------------------------------------
  // Escape HTML
  // ----------------------------------------------------------

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ----------------------------------------------------------
  // Telegram Back Button
  // ----------------------------------------------------------

  function setupTelegramBack() {
    document.addEventListener(
      "telegramBackButton",
      () => {

        if (currentView === "preview") {
          showView("editor");
          return;
        }

        if (currentView === "editor") {
          renderDashboard();
          showView("dashboard");
          return;
        }

        if (currentView === "settings") {
          showView("dashboard");
        }
      }
    );
  }

  // ----------------------------------------------------------
  // Initialize
  // ----------------------------------------------------------

  function init() {

    console.log(
      "📚 Bookly Mini ishga tushmoqda..."
    );

    if (
      window.BooklyTelegram &&
      typeof BooklyTelegram.init === "function"
    ) {
      BooklyTelegram.init();
    }

    loadMode();

    setupNavigation();

    setupButtons();

    setupThemePicker();

    setupTelegramBack();

    renderDashboard();

    showView("dashboard");

    console.log(
      "📚 Bookly Mini tayyor!"
    );
  }

  // ----------------------------------------------------------
  // Start
  // ----------------------------------------------------------

  if (
    document.readyState === "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
