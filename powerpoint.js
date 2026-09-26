window.BooklyPowerPoint = (() => {

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

  function background(slide, theme) {
    if (theme === "dark") {
      slide.background = { color: "111827" };
    } else if (theme === "modern") {
      slide.background = { color: "F5F7FB" };
    } else {
      slide.background = { color: "FFFDF8" };
    }
  }

  function textColor(book) {
    return book.theme === "dark" ? "FFFFFF" : "202124";
  }

  function bodyColor(book) {
    return book.theme === "dark" ? "F3F4F6" : "222222";
  }

  function footer(slide, book, page) {
    slide.addText(
      `${book.title || "Bookly"}  •  ${page}`,
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

  function addTitle(pptx, book) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

    slide.addText(book.title || "Nomsiz kitob", {
      x: 1,
      y: 2.1,
      w: 11.3,
      h: 1.2,
      fontFace: "Aptos Display",
      fontSize: 34,
      bold: true,
      align: "center",
      color: textColor(book),
      margin: 0,
      fit: "shrink"
    });

    if (book.author) {
      slide.addText(`Muallif: ${book.author}`, {
        x: 1.5,
        y: 3.5,
        w: 10.3,
        h: 0.5,
        fontFace: "Aptos",
        fontSize: 18,
        align: "center",
        color: book.theme === "dark" ? "D1D5DB" : "555555",
        margin: 0
      });
    }

    if (book.description) {
      slide.addText(cleanText(book.description), {
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
      });
    }
  }

  function addChapter(pptx, book, chapter, number) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

    slide.addText(`BOB ${number}`, {
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
    });

    slide.addText(chapter.title || `Bob ${number}`, {
      x: 1,
      y: 2.8,
      w: 11.3,
      h: 1.2,
      fontFace: "Aptos Display",
      fontSize: 30,
      bold: true,
      align: "center",
      color: textColor(book),
      margin: 0,
      fit: "shrink"
    });
  }

  function addText(pptx, book, text, page) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

    slide.addText(text || "", {
      x: 0.85,
      y: 0.8,
      w: 11.65,
      h: 5.9,
      fontFace: "Aptos",
      fontSize: 20,
      color: bodyColor(book),
      valign: "top",
      margin: 0.12,
      fit: "shrink",
      paraSpaceAfterPt: 10
    });

    footer(slide, book, page);
  }

  function addHeading(pptx, book, text, page) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

    slide.addText(text || "Sarlavha", {
      x: 0.9,
      y: 2.5,
      w: 11.5,
      h: 1.5,
      fontFace: "Aptos Display",
      fontSize: 30,
      bold: true,
      align: "center",
      valign: "mid",
      color: textColor(book),
      margin: 0.1,
      fit: "shrink"
    });

    footer(slide, book, page);
  }

  function addQuote(pptx, book, text, page) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

    slide.addText("❝", {
      x: 1,
      y: 1.25,
      w: 1,
      h: 1,
      fontSize: 42,
      color: book.theme === "dark" ? "93C5FD" : "2563EB",
      margin: 0
    });

    slide.addText(text || "", {
      x: 1.5,
      y: 2,
      w: 10.3,
      h: 2.8,
      fontFace: "Aptos",
      fontSize: 24,
      italic: true,
      align: "center",
      valign: "mid",
      color: bodyColor(book),
      margin: 0.15,
      fit: "shrink"
    });

    footer(slide, book, page);
  }

  function addDivider(pptx, book, page) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

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

    footer(slide, book, page);
  }

  function addImage(pptx, book, block, page) {
    const slide = pptx.addSlide();

    background(slide, book.theme);

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
        console.error("Rasm xatosi:", error);

        slide.addText("Rasmni qo'shib bo'lmadi", {
          x: 1,
          y: 3,
          w: 11.3,
          h: 0.6,
          align: "center",
          fontSize: 14,
          color: "CC0000"
        });
      }
    }

    if (block.caption) {
      slide.addText(cleanText(block.caption), {
        x: 1,
        y: 6.55,
        w: 11.3,
        h: 0.4,
        fontSize: 12,
        align: "center",
        color: book.theme === "dark" ? "CBD5E1" : "666666",
        margin: 0
      });
    }

    footer(slide, book, page);
  }
async function downloadBlob(blob, filename) {

  const WORKER =
    "https://bookly-bot-omadbekrustamov67.workers.dev";

  try {

    // Telegram Mini App ma'lumotlari
    const initData =
      window.Telegram?.WebApp?.initData;


    if (!initData) {

      alert(
        "❌ Telegram ma'lumotlari topilmadi.\n\n" +
        "Bookly'ni Telegram ichidan oching."
      );

      return;
    }


    // FormData
    const form = new FormData();

    form.append(
      "initData",
      initData
    );

    form.append(
      "file",
      blob,
      filename
    );


    // Worker'ga yuboramiz
    const response = await fetch(
      WORKER + "/sendfile",
      {
        method: "POST",
        body: form
      }
    );


    const text =
      await response.text();


    if (!response.ok) {

      console.error(
        "Worker xatosi:",
        text
      );

      throw new Error(
        text || "Fayl yuborilmadi"
      );
    }


    // UI
    const oldBox =
      document.getElementById(
        "bookly-pptx-download"
      );

    if (oldBox) {
      oldBox.remove();
    }


    const box =
      document.createElement("div");

    box.id =
      "bookly-pptx-download";


    box.style.cssText = `
      position: fixed;
      left: 20px;
      right: 20px;
      bottom: 90px;
      z-index: 999999;
      background: #1f2937;
      padding: 20px;
      border-radius: 18px;
      box-shadow: 0 10px 40px rgba(0,0,0,.4);
      text-align: center;
      color: white;
    `;


    box.innerHTML = `

      <div style="
        font-size:18px;
        font-weight:600;
        margin-bottom:10px;
      ">
        ✅ PowerPoint Telegramga yuborildi!
      </div>

      <div style="
        color:#cbd5e1;
        font-size:14px;
        margin-bottom:15px;
      ">
        ${filename}
      </div>

      <button
        id="bookly-pptx-close"
        style="
          width:100%;
          border:0;
          background:#374151;
          color:white;
          padding:13px;
          border-radius:12px;
          font-size:16px;
        "
      >
        Yopish
      </button>

    `;


    document.body.appendChild(box);


    document
      .getElementById(
        "bookly-pptx-close"
      )
      .onclick = () => {

        box.remove();

      };


  } catch (error) {

    console.error(
      "PPTX yuborish xatosi:",
      error
    );


    alert(
      "❌ PowerPoint Telegramga yuborilmadi.\n\n" +
      (error?.message ||
        "Noma'lum xatolik")
    );

  }
}
      try {
        const file = new File(
          [blob],
          filename,
          {
            type:
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          }
        );

        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          await navigator.share({
            files: [file],
            title: filename,
            text: "Bookly Mini PowerPoint"
          });
        } else {
          alert(
            "Ushbu qurilmada fayl ulashish qo‘llab-quvvatlanmaydi. " +
            "«📥 Faylni saqlash» tugmasini bosing."
          );
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Share xatosi:", error);
        }
      }
    };
}

  async function exportPPTX(bookId) {

    // PptxGenJS global obyektini tekshirish
    const Pptx = window.PptxGenJS;

    if (typeof Pptx !== "function") {
      alert(
        "❌ PowerPoint moduli yuklanmagan.\n\n" +
        "PptxGenJS topilmadi."
      );

      console.error(
        "PptxGenJS mavjud emas:",
        window.PptxGenJS
      );

      return;
    }

    const book = BooklyStorage.getBook(bookId);

    if (!book) {
      alert("Kitob topilmadi.");
      return;
    }

    try {

      const pptx = new Pptx();

      pptx.layout = "LAYOUT_WIDE";

      pptx.author = book.author || "Bookly Mini";
      pptx.title = book.title || "Bookly Mini";
      pptx.subject = book.description || "";
      pptx.company = "Bookly Mini";
      pptx.lang = "uz-UZ";

      pptx.theme = {
        headFontFace: "Aptos Display",
        bodyFontFace: "Aptos",
        lang: "uz-UZ"
      };

      // Muqova
      addTitle(pptx, book);

      let page = 2;

      const chapters = Array.isArray(book.chapters)
        ? book.chapters
        : [];

      chapters.forEach((chapter, chapterIndex) => {

        // Bob
        addChapter(
          pptx,
          book,
          chapter,
          chapterIndex + 1
        );

        page++;

        const blocks = Array.isArray(chapter.blocks)
          ? chapter.blocks
          : [];

        blocks.forEach(block => {

          const text = cleanText(
            block.html ||
            block.text ||
            block.content ||
            ""
          );

          switch (block.type) {

            case "text":
              addText(
                pptx,
                book,
                text,
                page
              );
              page++;
              break;

            case "heading":
              addHeading(
                pptx,
                book,
                text,
                page
              );
              page++;
              break;

            case "quote":
              addQuote(
                pptx,
                book,
                text,
                page
              );
              page++;
              break;

            case "image":
              addImage(
                pptx,
                book,
                block,
                page
              );
              page++;
              break;

            case "divider":
              addDivider(
                pptx,
                book,
                page
              );
              page++;
              break;

          }

        });

      });

      if (chapters.length === 0) {

        addText(
          pptx,
          book,
          "Kitob hali mazmun bilan to'ldirilmagan.",
          page
        );

      }

      const filename =
        safeFileName(
          book.title || "bookly-book"
        ) + ".pptx";

      // PPTX yaratish
      const blob = await pptx.write({
        outputType: "blob"
      });

      if (!(blob instanceof Blob)) {
        throw new Error(
          "PPTX Blob yaratilmadi."
        );
      }

      // Yuklash
      downloadBlob(
        blob,
        filename
      );

      alert(
        "✅ PowerPoint tayyor!\n\n" +
        filename
      );

    } catch (error) {

      console.error(
        "PowerPoint export xatosi:",
        error
      );

      alert(
        "❌ PowerPoint yaratishda xatolik:\n\n" +
        (error?.message ||
          "Noma'lum xatolik")
      );
    }
  }

  function exportCurrentBook() {

    let bookId = null;

    if (
      window.BooklyEditor &&
      typeof BooklyEditor.getCurrentBookId === "function"
    ) {
      bookId =
        BooklyEditor.getCurrentBookId();
    }

    if (
      !bookId &&
      window.BooklyPreview &&
      typeof BooklyPreview.getCurrentBookId === "function"
    ) {
      bookId =
        BooklyPreview.getCurrentBookId();
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
