/* TechhNova — Core Interactive Script */
document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  // Dynamic Year in Footer
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Directory Filter & Search (used on explore.html)
  const searchInput = document.getElementById("toolSearch");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const toolCards = document.querySelectorAll(".tool-card");
  const noResultsMsg = document.getElementById("noResults");
  const resultsCount = document.getElementById("resultsCount");

  let currentCategory = "all";
  let currentQuery = "";

  function filterTools() {
    if (!toolCards.length) return;
    let visibleCount = 0;

    toolCards.forEach(card => {
      const category = card.getAttribute("data-category") || "";
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      const desc = (card.getAttribute("data-description") || "").toLowerCase();
      const tags = (card.getAttribute("data-tags") || "").toLowerCase();

      const matchesCategory = (currentCategory === "all") || (category === currentCategory);
      const matchesSearch = !currentQuery || 
        name.includes(currentQuery) || 
        desc.includes(currentQuery) || 
        tags.includes(currentQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} tool${visibleCount === 1 ? '' : 's'}`;
    }

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? "block" : "none";
    }
  }

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.getAttribute("data-filter");
        filterTools();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      filterTools();
    });
  }

  // Pre-fill filter from URL hash if provided (e.g. explore.html#ai-coding)
  if (window.location.hash && filterButtons.length > 0) {
    const hash = window.location.hash.replace("#", "");
    const matchingBtn = document.querySelector(`[data-filter="${hash}"]`);
    if (matchingBtn) {
      matchingBtn.click();
    }
  }

  // Smooth scroll for Table of Contents links in blog articles
  document.querySelectorAll(".toc-list a").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          history.pushState(null, null, targetId);
        }
      }
    });
  });
});
