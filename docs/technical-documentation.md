# Technical Documentation (Assignment 2)

## 1. Overview

The portfolio is a static, single-page web application: one HTML file, one stylesheet and one
script, with no build tool and no library. Assignment 2 adds a live data source (the public GitHub
REST API) and several interactive features on top of the Assignment 1 page.

```
Browser ──loads──> index.html ──> css/styles.css
                        │
                        └──> js/script.js ──fetch──> api.github.com: /users/abdulaziz202023120/repos
                                   │                    + /search/repositories (my course repos)
                                   │
                                   └──> localStorage: theme, repoCache, contactDraft
```

## 2. Page structure (`index.html`)

| Element | Purpose |
|---------|---------|
| `<header class="site-header">` | Sticky navigation: logo, section links (now including *GitHub*), hamburger button, theme toggle |
| `<section id="about">` | Greeting, name, tagline, introduction, call-to-action buttons, avatar |
| `<section id="skills">` | Four skill cards |
| `<section id="projects">` | Two project cards, each with a **Show details** button and a hidden details panel (`<dl>`) |
| `<section id="github">` | **New.** Search box, language filter, sort menu, a status line and the repository list |
| `<section id="contact">` | Contact form with a character counter under the message |
| `<footer>` | Copyright with the current year, GitHub link, back-to-top link |

Accessibility of the new parts:

- The details buttons use `aria-expanded` and `aria-controls`; the panel uses `hidden` when closed so
  screen readers skip it.
- The repository status line and the form status use `role="status"` / `aria-live="polite"`, so loading,
  error and result messages are announced.
- Every control has a visible `<label>`. The search area has `role="search"`.
- **Escape** closes the mobile menu and returns focus to the menu button.

## 3. Styling (`css/styles.css`)

### Theme tokens
All colours are CSS custom properties on `:root`. Assignment 2 adds `--error-soft`, `--success-soft`
and `--skeleton` for message backgrounds and loading cards; dark mode redefines them like the others.

### Layout of the new section

| Width | Repository controls | Repository cards |
|-------|---------------------|------------------|
| > 900 px | search, language and sort on one row (2 : 1 : 1) | 3 columns |
| 681–900 px | one row | 2 columns |
| ≤ 680 px | stacked | 1 column |

### Animations

| Effect | How |
|--------|-----|
| Section fade-in | `.js-reveal .reveal` starts at `opacity: 0; translateY(24px)`; JavaScript adds `.visible` when the section enters the screen |
| Project details slide open | `grid-template-rows` animates from `0fr` to `1fr`, so the panel opens to its real height without measuring it in JavaScript |
| Hover | cards lift with `transform: translateY()`; nav links draw an underline with `transform: scaleX()` |
| Loading | spinner (`@keyframes spin`) and shimmering placeholder cards (`@keyframes shimmer`) |
| Messages | form and repository messages fade up (`@keyframes fade-up`); invalid fields shake once |

Only `transform` and `opacity` are animated (plus `grid-template-rows` for the panel), which the
browser can animate smoothly. `prefers-reduced-motion: reduce` turns off every transition and animation.
The `.js-reveal` class is added by JavaScript, so if the script fails to load, the sections are
still visible.

## 4. JavaScript (`js/script.js`)

The script runs after the DOM is ready and calls one function per feature:

| Function | New? | What it does |
|----------|------|--------------|
| `setGreeting()` | A1 | Good morning / afternoon / evening from the local hour |
| `initThemeToggle()` | A1 | Switches `data-theme` and saves it in `localStorage` |
| `initMobileNav()` | A1, improved | Opens / closes the phone menu; **Escape** now closes it too |
| `initActiveLinks()` | A1 | Highlights the menu link of the section in view (`IntersectionObserver`) |
| `initReveal()` | **A2** | Fades sections in once as they scroll into view |
| `initProjectDetails()` | **A2** | Expands / collapses the project details panels |
| `initRepos()` | **A2** | Loads repositories, then handles search, language filter and sort |
| `initContactForm()` | A1, extended | Validation, **saved draft**, **character counter**, animated status messages |

`readStorage()`, `writeStorage()` and `removeStorage()` wrap every `localStorage` call in
`try / catch`, because storage can be blocked (private browsing) or full. In that case the feature
still works for the current visit.

### 4.1 Loading the repositories

1. Check `localStorage["repoCache"]`. If it is younger than **30 minutes**, use it and skip the request.
   The GitHub API allows 60 unauthenticated requests per hour per IP, so the cache keeps the page
   working for visitors who reload often.
2. Otherwise show *"Loading repositories…"* with a spinner and three placeholder cards, then make two
   requests in parallel with `Promise.all`:
   - `GET /users/abdulaziz202023120/repos` for the repositories on my own account, and
   - `GET /search/repositories?q=202023120 in:name org:Web-Engineering-KFUPM` for my course
     repositories, which live in the class organisation and start with my student ID.
   Both lists are merged by `full_name`, so a repository never appears twice.
3. Forks are removed and each repository is reduced to the six fields the page needs
   (`name`, `description`, `language`, `stars`, `updated`, `url`). That smaller object is what gets cached.
4. On failure:

| Situation | What the user sees |
|-----------|--------------------|
| HTTP 403 / 429 (rate limit) | "GitHub is limiting requests right now. Please wait a few minutes, then try again." + **Try again** |
| Network error or other HTTP error | "The repositories could not be loaded. Check your connection, then try again." + **Try again** |
| Request fails but an older cached copy exists | The cached list, with "GitHub could not be reached, so this is the last saved list." |
| Account has no public repositories | "There are no public repositories on this account yet. Check back soon." |

### 4.2 Search, filter and sort

`render()` rebuilds the list from the stored array every time the search text, language or sort
changes:

```js
repos
  .filter((repo) => lang === "all" || repo.language === lang)
  .filter((repo) => `${repo.name} ${repo.description}`.toLowerCase().includes(term))
  .sort(/* by updated date, name, or stars */);
```

- The language menu is filled from the languages that actually appear in the data.
- The status line always says how many repositories are shown (*"Showing 2 of 5 repositories."*), or
  explains that nothing matched and what to try instead.
- Cards are built with `createElement` and `textContent`, never `innerHTML`, so text that comes from
  the API cannot inject HTML or scripts into the page.

### 4.3 Project details

Each button points to its panel with `aria-controls`. Opening removes `hidden` and, on the next frame,
adds `.open` so the CSS transition can run. Closing removes `.open` and sets `hidden` again after
`transitionend` (immediately when reduced motion is on).

### 4.4 Contact form

| Field | Rule | Message |
|-------|------|---------|
| Name | at least 2 characters | "Please enter your name (at least 2 characters)." |
| Email | matches `name@domain.tld` | "Please enter a valid email address, like name@example.com." |
| Message | at least 10 characters (maximum 1000) | "Your message should be at least 10 characters." |

- Every keystroke saves `{ name, email, message }` to `localStorage["contactDraft"]`. On the next visit
  the fields are refilled and the user is told *"Your unsent draft was restored."*
- A failed submit shows a red summary message, highlights the fields and moves focus to the first
  invalid one. A valid submit shows a green confirmation, resets the form and deletes the draft.

## 5. Performance

- Still no framework, font or library: one HTML, one CSS, one JS file and three small SVGs.
- The API response is cached for 30 minutes and trimmed to the fields that are used.
- `<link rel="preconnect" href="https://api.github.com">` starts the connection to GitHub early.
- The script uses `defer`; project images use `loading="lazy"`.
- The search only filters an array already in memory, so typing feels instant.

## 6. Browser compatibility

Features used: CSS Grid, custom properties, `aspect-ratio`, animated `grid-template-rows`, `fetch`,
`async/await`, `IntersectionObserver`, `replaceChildren()` and `localStorage`. All are supported in
current Chrome, Edge, Firefox and Safari (desktop and mobile). Fallbacks:

- No `IntersectionObserver`: sections are shown immediately and the active-link highlight is skipped.
- Blocked storage: theme, cache and draft simply are not remembered; nothing breaks.
- Browsers that cannot animate `grid-template-rows` still open and close the details, just without the slide.

## 7. Testing performed

Automated checks were run with Playwright (Chromium). The GitHub API was replaced with test data so
that every state, including failures, could be checked on purpose.

| Test | Result |
|------|--------|
| Desktop 1366 px, tablet 820 px, mobile 390 px | Correct layout, no horizontal scrolling |
| Browser console (normal load) | No errors |
| Repositories load | Loading state, then 3 cards (the fork in the test data is hidden) |
| Search "inventory" | 1 card, status "Showing 1 of 3 repositories." |
| Search with no match | Empty-state message with a hint |
| Language filter "Python" | Only Python repositories |
| Sort by stars | Highest-starred repository first |
| Repository description containing `<script>` | Shown as plain text, no script element created |
| GitHub returns 403 | Rate-limit message and **Try again** button |
| Network failure | Connection message and **Try again** button |
| Empty account | "No public repositories" message |
| Show / hide details | Panel opens, button changes to *Hide details*, panel closes and is hidden again |
| Draft saving | Text typed, page reloaded, fields restored with the "draft was restored" message |
| Invalid submit | Error summary and field messages, focus on the first invalid field |
| Valid submit | Success message, form reset, draft removed from `localStorage` |

## 8. Future improvements

- Send the contact form to a real backend (planned later in the course with Node/Express).
- Show repositories from the course organisation as well, with a tag for each course.
- Replace the placeholder images with real project screenshots.
