window.BooklyPowerPoint = (() => {

  const PPTX_W = 13.333;
  const PPTX_H = 7.5;

  function safeFileName(name) {
    return String(name || "book")
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "book";
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .trim();
  }

  function addBackground(slide, theme) {
    if (theme === "dark") {
      slide.background = { color: "111827" };
    } else if (theme === "modern") {
      slide.background = { color: "F5F7FB" };
    } else {
      slide.background = { color: "FFFDF8" };
    }
  }

  function addFooter(slide, book, pageNumber) {
    slide.addText(
      `${book.title || "Bookly"}  •  ${pageNumber}`,
      {
        x: 0.6,
        y: 7.05,
        w: 12.1,
        h: 0.25,
        fontFace: "Aptos",
        fontSize: 8,
        color: "888888",
        align: "right",
        margin: 0
      }
    );
  }

  function addTitleSlide(pptx, book) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addText(
      book.title || "Nomsiz kitob",
      {
        x: 1,
        y: 2.1,
        w: 11.3,
        h: 1.2,
        fontFace: "Aptos Display",
        fontSize: 34,
        bold: true,
        align: "center",
        color: book.theme === "dark" ? "FFFFFF" : "202124",
        margin: 0,
        fit: "shrink"
      }
    );

    if (book.author) {
      slide.addText(
        `Muallif: ${book.author}`,
        {
          x: 1.5,
          y: 3.5,
          w: 10.3,
          h: 0.5,
          fontFace: "Aptos",
          fontSize: 18,
          align: "center",
          color: book.theme === "dark" ? "D1D5DB" : "555555",
          margin: 0
        }
      );
    }

    if (book.description) {
      slide.addText(
        cleanText(book.description),
        {
          x: 2,
          y: 4.2,
          w: 9.3,
          h: 1.2,
          fontFace: "Aptos",
          fontSize: 14,
          align: "center",
          color: book.theme === "dark" ? "CBD5E1" : "666666",
          margin: 0.08,
          fit: "shrink"
        }
      );
    }

    return slide;
  }

  function addChapterSlide(pptx, book, chapter, chapterNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addText(
      `BOB ${chapterNumber}`,
      {
        x: 1,
        y: 2.1,
        w: 11.3,
        h: 0.5,
        fontFace: "Aptos",
        fontSize: 15,
        bold: true,
        align: "center",
        color: book.theme === "dark" ? "93C5FD" : "2563EB",
        margin: 0
      }
    );

    slide.addText(
      chapter.title || `Bob ${chapterNumber}`,
      {
        x: 1,
        y: 2.8,
        w: 11.3,
        h: 1.2,
        fontFace: "Aptos Display",
        fontSize: 30,
        bold: true,
        align: "center",
        color: book.theme === "dark" ? "FFFFFF" : "202124",
        margin: 0,
        fit: "shrink"
      }
    );

    return slide;
  }

  function addTextSlide(pptx, book, text, pageNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addText(
      text || "",
      {
        x: 0.85,
        y: 0.8,
        w: 11.65,
        h: 5.9,
        fontFace: "Aptos",
        fontSize: 20,
        color: book.theme === "dark" ? "F3F4F6" : "222222",
        breakLine: false,
        valign: "top",
        margin: 0.12,
        fit: "shrink",
        paraSpaceAfterPt: 10
      }
    );

    addFooter(slide, book, pageNumber);
  }

  function addHeadingSlide(pptx, book, text, pageNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addText(
      text || "Sarlavha",
      {
        x: 0.9,
        y: 2.5,
        w: 11.5,
        h: 1.5,
        fontFace: "Aptos Display",
        fontSize: 30,
        bold: true,
        align: "center",
        valign: "mid",
        color: book.theme === "dark" ? "FFFFFF" : "202124",
        margin: 0.1,
        fit: "shrink"
      }
    );

    addFooter(slide, book, pageNumber);
  }

  function addQuoteSlide(pptx, book, text, pageNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addText(
      "❝",
      {
        x: 1,
        y: 1.25,
        w: 1,
        h: 1,
        fontSize: 42,
        color: book.theme === "dark" ? "93C5FD" : "2563EB",
        margin: 0
      }
    );

    slide.addText(
      text || "",
      {
        x: 1.5,
        y: 2,
        w: 10.3,
        h: 2.8,
        fontFace: "Aptos",
        fontSize: 24,
        italic: true,
        align: "center",
        valign: "mid",
        color: book.theme === "dark" ? "F3F4F6" : "333333",
        margin: 0.15,
        fit: "shrink"
      }
    );

    addFooter(slide, book, pageNumber);
  }

  function addDividerSlide(pptx, book, pageNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    slide.addShape(pptx.ShapeType.line, {
      x: 2,
      y: 3.7,
      w: 9.3,
      h: 0,
      line: {
        color: book.theme === "dark" ? "64748B" : "CBD5E1",
        width: 2
      }
    });

    addFooter(slide, book, pageNumber);
  }

  function addImageSlide(pptx, book, block, pageNumber) {
    const slide = pptx.addSlide();
    addBackground(slide, book.theme);

    const imageData = block.content || block.src;

    if (imageData) {
      try {
        slide.addImage({
          data: imageData,
          x: 1,
          y: 0.7,
          w: 11.3,
          h: 5.8,
          sizingContain: true
        });
      } catch (error) {
        console.error("Rasm qo'shishda xato:", error, block);

        slide.addText(
          "Rasmni PowerPoint'ga qo'shib bo'lmadi: " +
          (error?.message || "noma'lum xato"),
          {
            x: 1,
            y: 3,
            w: 11.3,
            h: 0.6,
            align: "center",
            fontSize: 14,
            color: "CC0000"
          }
        );
      }
    }

    if (block.caption) {
      slide.addText(
        cleanText(block.caption),
        {
          x: 1,
          y: 6.55,
          w: 11.3,
          h: 0.4,
          fontSize: 12,
          align: "center",
          color: book.theme === "dark" ? "CBD5E1" : "666666",
          margin: 0
        }
      );
    }

    addFooter(slide, book, pageNumber);
  }

  // --------------------------------------------------------
  // Custom success modal (alert o'rniga)
  // --------------------------------------------------------
  function showSuccessModal(fileName, blobUrl) {
    const old = document.getElementById("bookly-pptx-modal");
    if (old) old.remove();

    const modal = document.createElement("div");
    modal.id = "bookly-pptx-modal";

    modal.innerHTML = `
      <div class="pptx-modal-overlay">
        <div class="pptx-modal-box">

          <div class="pptx-modal-icon">✅</div>

          <h3 class="pptx-modal-title">
            PowerPoint tayyor!
          </h3>

          <p class="pptx-modal-subtitle">
            Fayl muvaffaqiyatli yaratildi
          </p>

          <div class="pptx-modal-filename">
            📄 ${fileName}
          </div>

          <div class="pptx-modal-actions">

            <button
              type="button"
              class="pptx-modal-btn pptx-modal-btn-primary"
              id="pptx-modal-open"
            >
              📂 Faylni ochish
            </button>

            <button
              type="button"
              class="pptx-modal-btn pptx-modal-btn-secondary"
              id="pptx-modal-download"
            >
              ⬇️ Qayta yuklash
            </button>

            <button
              type="button"
              class="pptx-modal-btn pptx-modal-btn-ghost"
              id="pptx-modal-close"
            >
              Yopish
            </button>

          </div>

        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();

    document
      .getElementById("pptx-modal-close")
      .addEventListener("click", close);

    document
      .getElementById("pptx-modal-open")
      .addEventListener("click", () => {
        if (blobUrl) {
          window.open(blobUrl, "_blank");
        } else {
          alert("Faylni qayta yuklab oling.");
        }
      });

    document
      .getElementById("pptx-modal-download")
      .addEventListener("click", () => {
        if (blobUrl) {
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      });

    modal
      .querySelector(".pptx-modal-overlay")
      .addEventListener("click", (event) => {
        if (event.target.classList.contains("pptx-modal-overlay")) {
          close();
        }
      });
  }

  async function exportPPTX(bookId) {

    if (typeof PptxGenJS === "undefined") {
      alert("PowerPoint moduli yuklanmagan. Internetni tekshiring.");
      return;
    }

    const book = BooklyStorage.getBook(bookId);

    if (!book) {
      alert("Kitob topilmadi.");
      return;
    }

    try {

      const pptx = new PptxGenJS();

      pptx.layout = "LAYOUT_WIDE";
      pptx.author = book.author || "Bookly Mini";
      pptx.subject = book.description || "";
      pptx.title = book.title || "Bookly Mini";
      pptx.company = "Bookly Mini";
      pptx.lang = "uz-UZ";
      pptx.theme = {
        headFontFace: "Aptos Display",
        bodyFontFace: "Aptos",
        lang: "uz-UZ"
      };

      addTitleSlide(pptx, book);

      let pageNumber = 2;

      const chapters = Array.isArray(book.chapters)
        ? book.chapters
        : [];

      chapters.forEach((chapter, chapterIndex) => {

        addChapterSlide(
          pptx,
          book,
          chapter,
          chapterIndex + 1
        );

        pageNumber++;

        const blocks = Array.isArray(chapter.blocks)
          ? chapter.blocks
          : [];

        blocks.forEach(block => {

          const text =
            cleanText(
              block.html ||
              block.text ||
              block.content ||
              ""
            );

          switch (block.type) {

            case "text":
              addTextSlide(pptx, book, text, pageNumber);
              pageNumber++;
              break;

            case "heading":
              addHeadingSlide(pptx, book, text, pageNumber);
              pageNumber++;
              break;

            case "quote":
              addQuoteSlide(pptx, book, text, pageNumber);
              pageNumber++;
              break;

            case "image":
              addImageSlide(pptx, book, block, pageNumber);
              pageNumber++;
              break;

            case "divider":
              addDividerSlide(pptx, book, pageNumber);
              pageNumber++;
              break;
          }

        });
      });

      if (chapters.length === 0) {
        addTextSlide(
          pptx,
          book,
          "Kitob hali mazmun bilan to'ldirilmagan.",
          pageNumber
        );
      }

      const filename =
        safeFileName(book.title || "bookly-book") +
        ".pptx";

      try {
        // Faylni Blob sifatida olamiz
        const blob = await pptx.write({
          outputType: "blob"
        });

        const blobUrl = URL.createObjectURL(blob);

        // Avtomatik yuklab olish
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Chiroyli modalni ko'rsatish
        showSuccessModal(filename, blobUrl);

      } catch (error) {
        console.error("PowerPoint writeFile xatosi:", error);

        alert(
          "❌ Faylni yuklab olishda xatolik:\n\n" +
          (error?.message || "Noma'lum xatolik")
        );
      }

    } catch (error) {

      console.error("PowerPoint export xatosi:", error);

      alert(
        "❌ PowerPoint yaratishda xatolik yuz berdi.\n\n" +
        (error?.message || "Noma'lum xatolik")
      );
    }
  }

  function exportCurrentBook() {

    let bookId = null;

    if (
      window.BooklyEditor &&
      typeof BooklyEditor.getCurrentBookId === "function"
    ) {
      bookId = BooklyEditor.getCurrentBookId();
    }

    if (
      !bookId &&
      window.BooklyPreview &&
      typeof BooklyPreview.getCurrentBookId === "function"
    ) {
      bookId = BooklyPreview.getCurrentBookId();
    }

    if (!bookId) {
      alert("Avval kitobni oching.");
      return;
    }

    exportPPTX(bookId);
  }

  return {
    exportPPTX,
    exportCurrentBook
  };

})();
