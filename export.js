// ============================================================
// Bookly Mini — PDF Export
// ============================================================

window.BooklyExport = (() => {

  function safeFileName(name) {
    return String(name || "bookly-kitob")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "bookly-kitob";
  }

  function showMessage(text) {
    alert(text);
  }

  async function exportPDF(bookId) {

    const book = BooklyStorage.getBook(bookId);

    if (!book) {
      showMessage("Kitob topilmadi.");
      return;
    }

    if (typeof window.html2pdf === "undefined") {
      showMessage(
        "PDF moduli yuklanmagan. Internetni tekshirib sahifani yangilang."
      );
      return;
    }

    const root =
      document.getElementById("preview-root");

    if (!root) {
      showMessage("Preview oynasi topilmadi.");
      return;
    }

    // MUHIM:
    // PDF bosilganda preview ochilmagan bo‘lsa ham,
    // kitobni preview ichiga render qilamiz.
    if (
      window.BooklyPreview &&
      typeof BooklyPreview.renderBook === "function"
    ) {
      BooklyPreview.renderBook(book);
    }

    // DOM yangilanishini kutamiz
    await new Promise(resolve => {
      setTimeout(resolve, 300);
    });

    if (!root.innerHTML.trim()) {
      showMessage(
        "Kitob mazmuni topilmadi. Avval kitobni ochib ko‘ring."
      );
      return;
    }

    // PDF uchun alohida container
    const container =
      document.createElement("div");

    container.innerHTML =
      root.innerHTML;

    container.className =
      "bookly-pdf-container";

    // html2canvas ko‘ra oladigan joyda turadi
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top =
      window.scrollY + "px";

    container.style.width = "794px";
    container.style.minHeight = "1123px";

    container.style.padding = "40px";
    container.style.boxSizing = "border-box";

    container.style.background = "#ffffff";
    container.style.color = "#111111";

    container.style.zIndex = "-9999";

    container.style.fontFamily =
      "Arial, Helvetica, sans-serif";

    document.body.appendChild(container);

    // Audio PDF ichiga kirmaydi
    container
      .querySelectorAll("audio")
      .forEach(audio => {
        const parent =
          audio.closest(".reader-audio");

        if (parent) {
          parent.remove();
        } else {
          audio.remove();
        }
      });

    // Rasmlar yuklanishini kutamiz
    const images =
      container.querySelectorAll("img");

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

    try {

      await window.html2pdf()
        .set({

          margin: 10,

          filename:
            safeFileName(book.title) +
            ".pdf",

          image: {
            type: "jpeg",
            quality: 0.98
          },

          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",

            logging: false
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

        })
        .from(container)
        .save();

      console.log(
        "✅ PDF muvaffaqiyatli yaratildi."
      );

    } catch (error) {

      console.error(
        "❌ PDF yaratishda xatolik:",
        error
      );

      showMessage(
        "PDF yaratishda xatolik yuz berdi."
      );

    } finally {

      container.remove();

    }
  }

  function exportCurrentBook() {

    let bookId = null;

    // Avval editor
    if (
      window.BooklyEditor &&
      typeof BooklyEditor.getCurrentBookId ===
        "function"
    ) {
      bookId =
        BooklyEditor.getCurrentBookId();
    }

    // Keyin preview
    if (
      !bookId &&
      window.BooklyPreview &&
      typeof BooklyPreview.getCurrentBookId ===
        "function"
    ) {
      bookId =
        BooklyPreview.getCurrentBookId();
    }

    if (!bookId) {
      showMessage(
        "Avval kitobni tanlang."
      );
      return;
    }

    exportPDF(bookId);
  }

  function setup() {

    const editorButton =
      document.getElementById(
        "editor-export-btn"
      );

    if (editorButton) {
      editorButton.onclick =
        exportCurrentBook;
    }

    const previewButton =
      document.getElementById(
        "preview-export-btn"
      );

    if (previewButton) {
      previewButton.onclick =
        exportCurrentBook;
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

console.log(
  "📄 Bookly PDF Export tayyor."
); 
