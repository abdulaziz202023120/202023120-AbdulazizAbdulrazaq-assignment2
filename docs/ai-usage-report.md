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

- Gave the direction: build on my Assignment 1 portfolio and follow the assignment guidelines, the
  rubric and the course announcement on AI declarations exactly.
- Kept the content to my real work. The two projects and the facts about my role in them come from me
  (my senior project and Ala Makth at my company Optimal X); no projects were added that I have not done.
- Reviewed the feature plan Claude proposed (a GitHub section instead of a demo widget, because it
  shows my real code to anyone who visits) and approved it.
- Reviewed every file in the submission and screenshots of the site on desktop, on mobile and in the
  error state before it was uploaded.

## 3. Usage log

| ID | Tool (model) | Date | Purpose | Files affected | What I changed and how I verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Anthropic), Claude desktop app | 2026-10-19 | Read the guidelines and rubric, plan the features, write the code and documentation, run automated tests, upload to GitHub | all files below | One conversation. I set the direction and the content and reviewed the result (section 4). The same chat also holds earlier, unrelated study work for other courses; the evidence ZIP contains the full Assignment 2 part, from my first message about the assignment to the submission. |
| A01 | Claude | 2026-10-19 | New *Code on GitHub* section, Show details buttons, GitHub link in the menu | `index.html` | The project details had to state only facts about my real role and status; one sentence in the first Ala Makth draft was not confirmed, so it was replaced with facts from my Assignment 1 text before upload. |
| A02 | Claude | 2026-10-19 | All new JavaScript features (repositories, details, draft, counter, fade-in, Escape key) | `js/script.js` | Reviewed it against the explanation in the technical documentation; verified by the automated tests in section 4. |
| A03 | Claude | 2026-10-19 | Styles for the new section, messages, loading cards and animations | `css/styles.css` | Reviewed the desktop, mobile and error-state screenshots. |
| A04 | Claude | 2026-10-19 | Drafts of the documentation | `README.md`, `docs/technical-documentation.md`, `docs/ai-usage-report.md` | I asked for the report to list only what I actually did; the draft was corrected to match before upload. |
| A05 | Claude | 2026-10-19 | After the site went live, the *Code on GitHub* section was empty because my course repositories are in the class organisation, not on my own account; added a second request for them | `js/script.js`, `README.md`, `docs/technical-documentation.md` | Checked on the live site and with the updated automated tests. |

The AI evidence (the full, unedited conversation and the versions the AI produced before my edits) is
in `202023120-AbdulazizAbdulrazaq-assignment2-ai-evidence.zip`, submitted on Blackboard and not
committed to this repository.

## 4. How I verified the result

| Check | How |
|-------|-----|
| Automated tests | Playwright run by Claude: 3 screen sizes, all repository states, form states, and a description containing `<script>` to confirm it is shown as text (full table in the technical documentation) |
| My review | Reviewed every file and the desktop, mobile and error-state screenshots before upload |
| Understanding | Went through what each function in `js/script.js` does (summary below) so I can explain it |

## 5. Key points from the AI output that I can explain

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
