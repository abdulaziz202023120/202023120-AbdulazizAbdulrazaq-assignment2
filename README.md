# Abdulaziz Abdulrazaq – Personal Portfolio (Assignment 2: Interactive Features)

My personal portfolio for **SWE 363 – Web Engineering & Development (KFUPM, Term 261)**, built with
plain **HTML, CSS and JavaScript**. Assignment 2 starts from my
[Assignment 1 portfolio](https://github.com/Web-Engineering-KFUPM/202023120-AbdulazizAbdulrazaq-assignment1)
and makes it interactive: live data from the GitHub API, search / filter / sort, expandable project
details, a contact form that keeps your draft, and smooth animations.

**Live site:** https://web-engineering-kfupm.github.io/202023120-AbdulazizAbdulrazaq-assignment2/

---

## What is new in Assignment 2

| Requirement | What I built |
|-------------|--------------|
| **Dynamic content** | *Code on GitHub* section: live search while typing, filter by language and sort by date, name or stars. Project cards have a **Show details / Hide details** button that expands extra information. |
| **Data handling** | My repositories are **fetched from the public GitHub API** (my own account plus my course repositories in the class organisation, two requests in parallel). The result is cached in `localStorage` for 30 minutes (fewer API calls). The contact form **saves your draft** in `localStorage` and restores it on your next visit. The theme choice is still remembered. |
| **Animation & transitions** | Sections fade in as you scroll, cards lift on hover, nav links get an animated underline, project details slide open, loading cards shimmer, form messages fade in and invalid fields shake. All motion turns off for users who choose *reduce motion*. |
| **Error handling & feedback** | "Loading repositories…" with a spinner and placeholder cards, a friendly error with a **Try again** button (separate message when GitHub's rate limit is hit), an empty-state message when the search finds nothing, a message when the account has no repositories, per-field form errors, a character counter and a success message. |

Features kept from Assignment 1: time-of-day greeting, dark / light theme toggle, sticky navigation
with active-section highlight, hamburger menu on phones, and a fully responsive layout.

## Tech stack

- HTML5 (semantic sections, ARIA attributes for the interactive parts)
- CSS3 (custom properties, Grid, Flexbox, transitions, keyframe animations, media queries); no framework
- Vanilla JavaScript (ES2020: `fetch`, `async/await`, `IntersectionObserver`, `localStorage`); no libraries
- GitHub REST API (`GET /users/{user}/repos` and `GET /search/repositories`, no token needed)
- Hosted with GitHub Pages

## Project structure

```
├── README.md
├── index.html              # page structure and content
├── css/
│   └── styles.css          # styling, themes, animations and breakpoints
├── js/
│   └── script.js           # all interactivity (one function per feature)
├── assets/
│   └── images/             # SVG avatar and project placeholder images
├── docs/
│   ├── ai-usage-report.md  # AI usage log and declaration
│   └── technical-documentation.md
└── .gitignore
```

## Setup: run it locally

No build step and no dependencies.

1. Clone the repository:
   ```bash
   git clone https://github.com/Web-Engineering-KFUPM/202023120-AbdulazizAbdulrazaq-assignment2.git
   cd 202023120-AbdulazizAbdulrazaq-assignment2
   ```
2. Start a small local server (recommended, because the page calls the GitHub API with `fetch`):
   ```bash
   python -m http.server 8000
   ```
   Then open http://localhost:8000.
   In VS Code you can use the **Live Server** extension instead: right-click `index.html` → *Open with Live Server*.
3. An internet connection is needed for the *Code on GitHub* section. Everything else works offline.

## How to use the site

- **Theme:** click the moon / sun button in the menu. Your choice is remembered.
- **Projects:** click **Show details** on a card to see my role, methods and status.
- **Code on GitHub:** type in the search box to filter as you type, pick a language, or change the sort order.
  If GitHub cannot be reached, a message explains what happened and a **Try again** button appears.
- **Contact:** your text is saved while you type, so you can leave and come back. Press **Send message**;
  fields with problems are highlighted with a short explanation. There is no backend yet, so nothing is sent.

## Testing

The site was tested with automated Playwright checks in Chromium at 1366 px, 820 px and 390 px,
including the error cases (GitHub offline, rate limit, no results). There is no horizontal scrolling and no console error in the normal
case. The full test table is in [`docs/technical-documentation.md`](docs/technical-documentation.md#7-testing-performed).

## AI use (summary)

I used **Claude (Anthropic)** in the Claude desktop app for this assignment. It read the assignment
guidelines and rubric with me, proposed and wrote the code changes on top of my Assignment 1 code,
ran automated browser tests (including simulated API failures), and drafted the documentation.
I set the direction, kept the content to my real projects, and reviewed every file and screenshots
of the site before it was uploaded. Every AI-assisted commit is marked with `Assisted-by`.
The full log and my declaration are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

## Author

**Abdulaziz Abdulrazaq** · Student ID 202023120 · KFUPM
GitHub: [@abdulaziz202023120](https://github.com/abdulaziz202023120)
