# ActinVision – FRONT

A simple web page that consumes the ActinVision survey API: it displays customer
satisfaction survey responses in a table and lets the user filter them by a
minimum rating.

Built with Next.js (App Router), React and TypeScript, styled with Tailwind CSS.

---

## Prerequisites

- **Node.js** ≥ 18 (developed with Node v24)
- **npm** (installed with Node)

Check your version with:

```bash
node -v
```

---

## IMPORTANT - The backend must be running

This front-end only fetches its data from the API. For the table to display
anything, the **backend must be running** and reachable on
**http://localhost:5000**.

Start the backend first! Its repository and instructions are here:
**[ActinVision - BACK](https://github.com/Fonzy57/actinvision-back.git)**

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Fonzy57/ActinVision-FRONT.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start in development mode

```bash
npm run dev
```

The app then runs on **http://localhost:3000**.

### 4. Build and run in production mode

```bash
npm run build   # builds the optimized production bundle
npm start       # runs the built app
```

---

## Notes

- **The API URL** (`http://localhost:5000`) is set directly in the `fetch` call
  in `src/app/page.tsx`. Change it there if your backend runs on another host or
  port.
- **Filtering — design choice:** the filter is applied when the user clicks the
  **"Filtrer"** button (not live while typing). Clearing the input on its own
  does **not** reload the list; the **"Réinitialiser"** button is what restores
  the full list. This keeps the interaction explicit and predictable.
- The minimum rating is validated on the client (must be a number between 1 and
  5) before calling the API, which also validates it on its side.