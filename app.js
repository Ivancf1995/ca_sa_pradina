(() => {
  const toggle = document.getElementById("nav-toggle");
  const panel = document.getElementById("nav-mobile");
  if (!toggle || !panel) return;

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
})();
