/* ==========================================================================
   Portfolio interactivity
   From Assignment 1:
     1. Greeting by time of day
     2. Dark / light theme toggle (remembered in localStorage)
     3. Mobile navigation menu
     4. Highlight the nav link of the section in view
   New in Assignment 2:
     5. Fade-in of sections as they scroll into view
     6. Expand / collapse project details
     7. GitHub repositories: fetch from the API, then search, filter and sort
     8. Contact form: validation, saved draft, character counter
   ========================================================================== */

const GITHUB_USER = "abdulaziz202023120";
const REPO_CACHE_KEY = "repoCache";
const REPO_CACHE_MINUTES = 30; // the GitHub API allows 60 requests per hour without a token
const DRAFT_KEY = "contactDraft";

document.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  initThemeToggle();
  initMobileNav();
  initActiveLinks();
  initReveal();
  initProjectDetails();
  initRepos();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Small storage helpers (storage can be blocked in private mode) ---------- */
function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage full or blocked: the feature still works for this visit */
  }
}

function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    /* nothing to clean up */
  }
}

/* ---------- 1. Greeting by time of day ---------- */
function setGreeting() {
  const hour = new Date().getHours();
  let text = "Good evening!";
  if (hour >= 5 && hour < 12) text = "Good morning!";
  else if (hour >= 12 && hour < 17) text = "Good afternoon!";
  document.getElementById("greeting").textContent = text;
}

/* ---------- 2. Theme toggle ---------- */
function initThemeToggle() {
  const button = document.getElementById("themeToggle");
  const root = document.documentElement;

  const currentTheme = () =>
    root.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const updateLabel = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${next} theme`);
  };

  root.setAttribute("data-theme", currentTheme());
  updateLabel();

  button.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next); // stored as a plain string, read by the inline script in <head>
    } catch (e) {
      /* storage blocked: the theme still changes for this visit */
    }
    updateLabel();
  });
}

/* ---------- 3. Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const setOpen = (isOpen) => {
    links.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setOpen(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

  // Escape closes the menu and returns focus to the button
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && links.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- 4. Active link while scrolling ---------- */
function initActiveLinks() {
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

/* ---------- 5. Fade-in on scroll ---------- */
function initReveal() {
  const sections = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Without IntersectionObserver, or when the user asked for less motion, just show everything
  if (!("IntersectionObserver" in window) || reduceMotion) {
    sections.forEach((section) => section.classList.add("visible"));
    return;
  }

  document.documentElement.classList.add("js-reveal"); // hide sections only once JS is running
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target); // animate once
      });
    },
    { threshold: 0.12 }
  );
  sections.forEach((section) => observer.observe(section));
}

/* ---------- 6. Project details (expand / collapse) ---------- */
function initProjectDetails() {
  document.querySelectorAll(".details-toggle").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      button.firstChild.textContent = isOpen ? "Show details " : "Hide details ";

      if (isOpen) {
        panel.classList.remove("open");
        // wait for the closing animation before hiding it from screen readers
        panel.addEventListener("transitionend", () => (panel.hidden = true), { once: true });
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) panel.hidden = true;
      } else {
        panel.hidden = false;
        requestAnimationFrame(() => panel.classList.add("open"));
      }
    });
  });
}

/* ---------- 7. GitHub repositories ---------- */
function initRepos() {
  const list = document.getElementById("repoList");
  const status = document.getElementById("repoStatus");
  const search = document.getElementById("repoSearch");
  const language = document.getElementById("repoLanguage");
  const sort = document.getElementById("repoSort");
  let repos = [];

  const setStatus = (text, type = "") => {
    status.textContent = text;
    status.className = `repo-status ${type}`.trim();
  };

  // Rebuild the list from the current search, language and sort choices
  const render = () => {
    const term = search.value.trim().toLowerCase();
    const lang = language.value;

    const shown = repos
      .filter((repo) => lang === "all" || repo.language === lang)
      .filter((repo) => `${repo.name} ${repo.description}`.toLowerCase().includes(term))
      .sort((a, b) => {
        if (sort.value === "name") return a.name.localeCompare(b.name);
        if (sort.value === "stars") return b.stars - a.stars;
        return new Date(b.updated) - new Date(a.updated);
      });

    list.replaceChildren(...shown.map(createRepoCard));

    if (repos.length === 0) {
      setStatus("There are no public repositories on this account yet. Check back soon.", "empty");
    } else if (shown.length === 0) {
      setStatus(`No repositories match your search. Try another word or choose "All languages".`, "empty");
    } else {
      setStatus(`Showing ${shown.length} of ${repos.length} repositories.`);
    }
  };

  const fillLanguages = () => {
    const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))].sort();
    language.replaceChildren(new Option("All languages", "all"), ...languages.map((l) => new Option(l, l)));
  };

  const load = async () => {
    // Use a recent copy if we have one, to save API calls
    const cached = readStorage(REPO_CACHE_KEY);
    if (cached && Date.now() - cached.savedAt < REPO_CACHE_MINUTES * 60 * 1000) {
      repos = cached.repos;
      fillLanguages();
      render();
      return;
    }

    setStatus("Loading repositories…", "loading");
    list.replaceChildren(...Array.from({ length: 3 }, createSkeletonCard));

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
        { headers: { Accept: "application/vnd.github+json" } }
      );
      if (response.status === 403) throw new Error("rate-limit");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      // Keep only the fields the page uses, and skip forks
      repos = data
        .filter((repo) => !repo.fork)
        .map((repo) => ({
          name: repo.name,
          description: repo.description || "",
          language: repo.language,
          stars: repo.stargazers_count,
          updated: repo.updated_at,
          url: repo.html_url,
        }));

      writeStorage(REPO_CACHE_KEY, { savedAt: Date.now(), repos });
      fillLanguages();
      render();
    } catch (error) {
      list.replaceChildren();
      if (cached) {
        // An old copy is better than nothing
        repos = cached.repos;
        fillLanguages();
        render();
        setStatus("GitHub could not be reached, so this is the last saved list.", "error");
        return;
      }
      const reason =
        error.message === "rate-limit"
          ? "GitHub is limiting requests right now. Please wait a few minutes"
          : "The repositories could not be loaded. Check your connection";
      showRepoError(`${reason}, then try again.`, load);
    }
  };

  const showRepoError = (message, retry) => {
    setStatus(message, "error");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-ghost btn-small";
    button.textContent = "Try again";
    button.addEventListener("click", retry, { once: true });
    status.append(" ", button);
  };

  search.addEventListener("input", render);
  language.addEventListener("change", render);
  sort.addEventListener("change", render);
  load();
}

// Build one repository card with textContent only (API text is never inserted as HTML)
function createRepoCard(repo) {
  const item = document.createElement("li");
  item.className = "repo-card";

  const title = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repo.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = repo.name;
  title.append(link);

  const description = document.createElement("p");
  description.textContent = repo.description || "No description yet.";

  const meta = document.createElement("p");
  meta.className = "repo-meta";
  const updated = new Date(repo.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  meta.textContent = [repo.language || "Other", `★ ${repo.stars}`, `Updated ${updated}`].join(" · ");

  item.append(title, description, meta);
  return item;
}

function createSkeletonCard() {
  const item = document.createElement("li");
  item.className = "repo-card skeleton";
  item.setAttribute("aria-hidden", "true");
  return item;
}

/* ---------- 8. Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const message = form.elements.message;
  const counter = document.getElementById("charCount");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: (value) => (value.length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    email: (value) => (!emailPattern.test(value) ? "Please enter a valid email address, like name@example.com." : ""),
    message: (value) => (value.length < 10 ? "Your message should be at least 10 characters." : ""),
  };

  const showStatus = (text, type) => {
    status.textContent = text;
    status.className = `form-status ${type}`;
    // restart the animation each time a new message appears
    status.classList.remove("show");
    void status.offsetWidth;
    status.classList.add("show");
  };

  const validateField = (field) => {
    const error = rules[field.name](field.value.trim());
    document.getElementById(`${field.name}Error`).textContent = error;
    field.classList.toggle("invalid", error !== "");
    field.setAttribute("aria-invalid", String(error !== ""));
    return error === "";
  };

  const updateCounter = () => {
    counter.textContent = `${message.value.length} / ${message.maxLength}`;
  };

  // Restore a saved draft
  const draft = readStorage(DRAFT_KEY);
  if (draft) {
    ["name", "email", "message"].forEach((key) => (form.elements[key].value = draft[key] || ""));
    if (draft.name || draft.email || draft.message) showStatus("Your unsent draft was restored.", "info");
  }
  updateCounter();

  form.querySelectorAll("input, textarea").forEach((field) =>
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
      if (field === message) updateCounter();
      writeStorage(DRAFT_KEY, {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: message.value,
      });
    })
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // no backend yet
    const fields = [...form.querySelectorAll("input, textarea")];
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      showStatus("Please fix the highlighted fields and send again.", "error");
      fields.find((field) => field.classList.contains("invalid")).focus();
      return;
    }

    const name = form.elements.name.value.trim();
    showStatus(`Thanks, ${name}! Your message is ready. (This demo has no backend, so nothing was sent.)`, "success");
    form.reset();
    removeStorage(DRAFT_KEY);
    updateCounter();
  });
}
