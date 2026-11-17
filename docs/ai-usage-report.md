# AI Usage Report – Assignment 2 (Interactive Features)

**Student:** Abdulaziz Abdulrazaq · **ID:** 202023120 · **Course:** SWE 363, Term 261

## 1. Tools used

| Tool | How I used it |
|------|---------------|
| **Claude (Anthropic)**, in the Claude desktop app | My main assistant for this assignment. It read the assignment guidelines and rubric with me, reviewed my Assignment 1 code, proposed which features would meet each requirement, wrote the code changes and the documentation drafts, and ran automated browser tests. |

I did not use Copilot, Cursor or any other AI tool for this assignment.

## 2. How the work was split

**What Claude did**

- Read the Assignment 2 guidelines and rubric and mapped every requirement to a concrete feature.
- Wrote the new code on top of my Assignment 1 files: the GitHub repositories section (fetch, cache,
  search, filter, sort, loading / error / empty states), the expandable project details, the saved
  contact-form draft and character counter, and the animations.
- Ran Playwright tests at three screen sizes and simulated GitHub failures (rate limit, network
  error, empty account) so the error messages could be checked on purpose.
- Drafted `README.md`, `docs/technical-documentation.md` and this report.

**What I did**

- Decided to keep building on my Assignment 1 portfolio instead of starting a new site.
- Chose the features that make sense for *my* portfolio: showing my real GitHub work is more useful to
  a recruiter than a demo widget, and a saved draft fits a contact form people may leave and come back to.
- Kept the content to my two real projects (senior project and Ala Makth) and wrote the facts in the
  project details (my role, methods, status). I did not let the AI add projects I have not done.
- Asked for the AI use to be documented honestly and in full.
- Reviewed the code and tested the site myself before submitting (see section 4).

## 3. Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Anthropic), Claude desktop app | 2026-10-19 | Read the guidelines and rubric, plan the features, write the code and documentation, run automated tests | all files below | One conversation. I set the direction and the content; I reviewed the result and tested it in my own browser (section 4). The same conversation also contains unrelated study work for other courses; the Assignment 2 part starts on 19 Oct 2026 in the evening. |
| A01 | Claude | 2026-10-19 | New *Code on GitHub* section, Show details buttons, GitHub link in the menu | `index.html` | I checked that the project details match my real role and status, and that the section order reads well. |
| A02 | Claude | 2026-10-19 | All new JavaScript features (repositories, details, draft, counter, fade-in, Escape key) | `js/script.js` | Read through each function and checked it against the explanation in the technical documentation; tested search, filter, sort, details and the form in the browser. |
| A03 | Claude | 2026-10-19 | Styles for the new section, messages, loading cards and animations | `css/styles.css` | Checked light and dark mode and the phone layout in the browser. |
| A04 | Claude | 2026-10-19 | First drafts of the documentation | `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | Read and corrected the drafts so they describe what I actually did. |

The AI evidence (the full, unedited conversation and the versions the AI produced before my edits) is
in `202023120-AbdulazizAbdulrazaq-assignment2-ai-evidence.zip`, submitted on Blackboard and not
committed to this repository.

## 4. How I verified the result

| Check | How |
|-------|-----|
| Automated tests | Playwright run by Claude: 3 screen sizes, all repository states, form states, and a description containing `<script>` to confirm it is shown as text (full table in the technical documentation) |
| My own check | Opened the live GitHub Pages site on my laptop and my phone, tried the search, filter, sort, details buttons, theme toggle, and submitted the form empty and then correctly |
| Understanding | Went through `js/script.js` function by function; I can explain each one (summary below) |

## 5. What I learned from the AI output

- **Caching an API response:** the GitHub API allows only 60 requests per hour without a token, so the
  list is saved in `localStorage` with a timestamp and reused for 30 minutes. If GitHub fails later,
  the old copy is still shown with a note.
- **Safe rendering:** API text is added with `textContent`, not `innerHTML`. Putting a `<script>` tag in
  a repository description shows it as plain text instead of running it.
- **Every state needs a message:** loading, error (with a reason and a *Try again* button), no results,
  and no data at all are four different situations, and each one tells the user what to do next.
- **Animating height without JavaScript:** animating `grid-template-rows` from `0fr` to `1fr` opens the
  details panel to its natural height.
- **Accessibility of toggles:** `aria-expanded`, `aria-controls` and the `hidden` attribute keep the
  details buttons understandable for screen readers.

## 6. Declaration

I declare that this report and the attached evidence document all of my AI use in this assignment,
with complete and unedited conversations, and that I understand and can explain all the code I
submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism
according to KFUPM regulations.

**Name:** Abdulaziz Abdulrazaq
**Student ID:** 202023120
**Date:** 19 October 2026
