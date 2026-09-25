/* ==========================================================================
   Bookly Mini — Telegram WebApp
   ========================================================================== */

(function () {
  "use strict";

  const tg = window.Telegram?.WebApp;

  if (!tg) {
    console.log("Telegram WebApp muhiti topilmadi.");
    return;
  }

  // Telegram Mini App'ni ishga tushirish
  tg.ready();

  // Ekranga maksimal moslashish
  tg.expand();

  // Telegram interfeys ranglarini olish
  document.documentElement.style.setProperty(
    "--tg-bg",
    tg.backgroundColor || "#ffffff"
  );

  document.documentElement.style.setProperty(
    "--tg-text",
    tg.themeParams?.text_color || "#111111"
  );

  document.documentElement.style.setProperty(
    "--tg-hint",
    tg.themeParams?.hint_color || "#777777"
  );

  document.documentElement.style.setProperty(
    "--tg-button",
    tg.themeParams?.button_color || "#2481cc"
  );

  document.documentElement.style.setProperty(
    "--tg-button-text",
    tg.themeParams?.button_text_color || "#ffffff"
  );

  // Telegram foydalanuvchisi
  const user = tg.initDataUnsafe?.user || null;

  window.BooklyTelegram = {
    tg,

    user,

    initData: tg.initData || "",

    getUser() {
      return user;
    },

    getUserName() {
      if (!user) return "Mehmon";

      if (user.first_name) {
        return user.first_name;
      }

      return user.username
        ? `@${user.username}`
        : "Foydalanuvchi";
    },

    showAlert(message) {
      if (tg.showAlert) {
        tg.showAlert(String(message));
      } else {
        alert(message);
      }
    },

    showConfirm(message, callback) {
      if (tg.showConfirm) {
        tg.showConfirm(
          String(message),
          callback
        );
      } else {
        callback(confirm(message));
      }
    },

    haptic(type = "light") {
      try {
        if (!tg.HapticFeedback) return;

        if (type === "success") {
          tg.HapticFeedback.notificationOccurred(
            "success"
          );
        } else if (type === "error") {
          tg.HapticFeedback.notificationOccurred(
            "error"
          );
        } else if (type === "warning") {
          tg.HapticFeedback.notificationOccurred(
            "warning"
          );
        } else {
          tg.HapticFeedback.impactOccurred(
            type
          );
        }
      } catch (error) {
        console.log(
          "Haptic ishlamadi:",
          error
        );
      }
    },

    close() {
      tg.close();
    },

    openTelegramLink(url) {
      if (tg.openTelegramLink) {
        tg.openTelegramLink(url);
      } else {
        window.open(url, "_blank");
      }
    },

    openLink(url) {
      if (tg.openLink) {
        tg.openLink(url);
      } else {
        window.open(url, "_blank");
      }
    },

    shareText(text) {
      const encoded =
        encodeURIComponent(text);

      const url =
        `https://t.me/share/url?url=&text=${encoded}`;

      this.openTelegramLink(url);
    }
  };

  // Telegram back button
  if (tg.BackButton) {
    window.BooklyTelegram.BackButton =
      tg.BackButton;

    tg.BackButton.hide();
  }

  // Orqaga tugmasini boshqarish
  if (tg.BackButton) {
    tg.BackButton.onClick(() => {
      window.dispatchEvent(
        new CustomEvent("telegramBackButton")
      );
    });
  }

  // Asosiy tugma
  if (tg.MainButton) {
    window.BooklyTelegram.MainButton =
      tg.MainButton;

    tg.MainButton.hide();
  }

  console.log(
    "Bookly Telegram WebApp tayyor.",
    user
  );
})();
