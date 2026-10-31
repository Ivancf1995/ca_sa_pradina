(() => {
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-mobile");
  if (toggle && panel) {
    const setOpen = (open) => {
      panel.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = toggle.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = open ? "close" : "menu";
    };

    toggle.addEventListener("click", () => {
      setOpen(panel.classList.contains("hidden"));
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  const bindLangMenu = (root) => {
    const btn =
      root.querySelector("#lang-toggle") || root.querySelector(".lang-toggle");
    const list =
      root.querySelector("#lang-list") ||
      root.querySelector("#lang-list-mobile") ||
      root.querySelector('[role="listbox"]');
    if (!btn || !list) return;

    const setOpen = (open) => {
      list.classList.toggle("hidden", !open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon && (icon.textContent === "expand_more" || icon.textContent === "expand_less")) {
        icon.textContent = open ? "expand_less" : "expand_more";
      }
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(list.classList.contains("hidden"));
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  };

  const desktop = document.getElementById("lang-menu");
  if (desktop) bindLangMenu(desktop);
  document.querySelectorAll("[data-lang-menu]").forEach(bindLangMenu);
})();
