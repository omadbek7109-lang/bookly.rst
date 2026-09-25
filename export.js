// ============================================================
// Bookly Mini — PDF Export
// ============================================================

window.BooklyExport = (() => {

  function getBook(bookId) {
    if (!window.BooklyStorage) return null;
    return BooklyStorage.getBook(bookId);
  }

  function safeFileName(name) {
    return String(name || "bookly-kitob")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "bookly-kitob";
  }

  function showMessage(message) {
    if (
      window.BooklyTelegram &&
      typeof BooklyTelegram.showAlert === "function"
    ) {
      BooklyTelegram.showAlert(message);
    } else {
      alert(message);
    }
  }

  async function exportPDF(bookId) {
    const book = getBook(bookId);

    if (!book) {
      showMessage("Kitob topilmadi.");
      return;
    }

    if (typeof window.html2pdf === "undefined") {
      showMessage(
        "PDF moduli yuklanmadi. Internetni tekshirib qayta urinib ko‘ring."
      );
      return;
    }

    const previewRoot = document.getElementById("preview-root");

    if (!previewRoot) {
      showMessage("Kitob ko‘rish oynasi topilmadi.");
      return;
    }

    const oldButton = document.getElementById("preview-export-btn");

    if (oldButton) {
      oldButton.disabled = true;
      oldButton.textContent = "⏳";
    }

    try {
      const exportContainer = document.createElement("div");

      exportContainer.className = "bookly-pdf-export";

      exportContainer.innerHTML = previewRoot.innerHTML;

      exportContainer.style.position = "fixed";
      exportContainer.style.left = "-100000px";
      exportContainer.style.top = "0";
      exportContainer.style.width = "794px";
      exportContainer.style.background = "#ffffff";
      exportContainer.style.color = "#111111";
      exportContainer.style.padding = "40px";
      exportContainer.style.boxSizing = "border-box";
      exportContainer.style.fontFamily =
        "Arial, Helvetica, sans-serif";

      document.body.appendChild(exportContainer);

      // PDF uchun audio playerni olib tashlaymiz.
      exportContainer
        .querySelectorAll("audio")
        .forEach(audio => {
          const wrapper = audio.closest(".reader-audio");

          if (wrapper) {
            wrapper.remove();
          } else {
            audio.remove();
          }
        });

      const images = exportContainer.querySelectorAll("img");

      await Promise.all(
        [...images].map(image => {
          if (image.complete) {
            return Promise.resolve();
          }

          return new Promise(resolve => {
            image.onload = resolve;
            image.onerror = resolve;
          });
        })
      );

      const options = {
        margin: [12, 12, 12, 12],

        filename:
          safeFileName(book.title) + ".pdf",

        image: {
          type: "jpeg",
          quality: 0.95
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff"
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait"
        },

        pagebreak: {
          mode: [
            "css",
            "legacy"
          ]
        }
      };

      await window.html2pdf()
        .set(options)
        .from(exportContainer)
        .save();

      exportContainer.remove();

      if (oldButton) {
        oldButton.disabled = false;
        oldButton.textContent = "📄";
      }

      if (
        window.BooklyTelegram &&
        typeof BooklyTelegram.haptic === "function"
      ) {
        BooklyTelegram.haptic("success");
      }

    } catch (error) {

      console.error(
        "Bookly PDF export error:",
        error
      );

      const exportContainer =
        document.querySelector(".bookly-pdf-export");

      if (exportContainer) {
        exportContainer.remove();
      }

      if (oldButton) {
        oldButton.disabled = false;
        oldButton.textContent = "📄";
      }

      showMessage(
        "PDF yaratishda xatolik yuz berdi."
      );
    }
  }

  async function exportCurrentBook() {
    if (
      window.BooklyPreview &&
      typeof BooklyPreview.getCurrentBookId === "function"
    ) {
      const bookId =
        BooklyPreview.getCurrentBookId();

      if (bookId) {
        return exportPDF(bookId);
      }
    }

    if (
      window.BooklyEditor &&
      typeof BooklyEditor.getCurrentBookId === "function"
    ) {
      const bookId =
        BooklyEditor.getCurrentBookId();

      if (bookId) {
        return exportPDF(bookId);
      }
    }

    showMessage("Avval kitobni tanlang.");
  }

  function setup() {

    const editorExportButton =
      document.getElementById("editor-export-btn");

    if (editorExportButton) {
      editorExportButton.addEventListener(
        "click",
        exportCurrentBook
      );
    }

    const previewExportButton =
      document.getElementById("preview-export-btn");

    if (previewExportButton) {
      previewExportButton.addEventListener(
        "click",
        exportCurrentBook
      );
    }
  }

  return {
    exportPDF,
    exportCurrentBook,
    setup
  };

})();

document.addEventListener(
  "DOMContentLoaded",
  () => {
    BooklyExport.setup();
  }
);

console.log("Bookly Export tayyor.");
