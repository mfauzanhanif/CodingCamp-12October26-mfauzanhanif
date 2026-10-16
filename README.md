# 🌟 Life Dashboard — Personal Productivity Hub

A clean, modern, and responsive **Life Dashboard** designed to help users organize their daily workflow effortlessly. Built with a distinctive **Neo-Brutalist** aesthetic, featuring real-time clock & greeting, Pomodoro focus timer, full-featured to-do manager, customizable quick links, and seamless dark mode support.

> 🎓 **RevoU Software Engineering Coding Camp — Mini Project**  
> 🌐 **Live Demo:** [https://mfauzanhanif.github.io/mfauzanhanif-CodingCamp-12Octobert26-fauzanhanif/](https://mfauzanhanif.github.io/mfauzanhanif-CodingCamp-12Octobert26-fauzanhanif/)

---

## ✨ Features

### 1. 🕒 Dynamic Greeting & Clock

- **Real-Time Clock:** Displays current time (hours, minutes, seconds) and formatted date.
- **Context-Aware Greeting:** Automatically adapts greeting (Good Morning, Good Afternoon, Good Evening, Good Night) based on the time of day.
- **Customizable Name:** Click the ✏️ icon to set your custom name; persisted across sessions.

### 2. 🍅 Focus Timer (Pomodoro)

- **Standard 25-Minute Timer:** Start, stop, and reset anytime with clear visual feedback.
- **Custom Duration:** Set any custom focus session length (1–120 minutes).
- **Audio & Visual Alerts:** Audible notification chime when the timer finishes.

### 3. 📋 Smart To-Do List

- **Full CRUD:** Add, edit inline, mark as completed, and delete tasks.
- **Duplicate Prevention:** Prevents accidental duplicate tasks with helpful feedback.
- **Task Sorting:** Sort tasks on the fly:
  - **Newest** / **Oldest**
  - **Alphabetical (A→Z / Z→A)**
  - **Done Last** (prioritizes pending items)
- **Persistent State:** Saves all tasks locally in browser storage.

### 4. 🔗 Quick Links Manager

- **Favorite Shortcuts:** Save custom links with customizable names and URLs.
- **Smart URL Normalization:** Automatically handles protocol prefixes (`https://`).
- **Secure Navigation:** External links open with `rel="noopener noreferrer"`.
- **Quick Deletion:** Easily remove shortcuts with one click.

### 5. 🌓 Light & Dark Mode

- Instant theme toggle with zero screen flash (FOUC) on page reload via pre-paint execution.
- High-contrast Neo-Brutalist color palette tailored for both light and dark themes.

---

## 🛠️ Tech Stack & Constraints

- **Structure:** Semantic HTML5 (compliant with standard void elements and accessible ARIA attributes).
- **Styling:** Vanilla CSS3 (Custom design tokens, Neo-Brutalist shadows & borders, CSS Grid & Flexbox, fully responsive).
- **Logic:** Vanilla JavaScript (ES6+, zero third-party libraries or frameworks).
- **Storage:** Browser `localStorage` API for 100% client-side persistence without requiring an external backend.

---

## 📁 Project Structure

```text
miniproject-revou/
├── index.html         # Main dashboard HTML structure
├── css/
│   └── style.css      # Design system, themes & Neo-Brutalist styling
├── js/
│   └── app.js         # Core application logic & localStorage handlers
└── README.md          # Project documentation
```

---

## 🚀 Getting Started

No installation or build steps are required. You can run the dashboard locally in several ways:

### Option 1: Direct Browser Access

Double-click `index.html` or drag and drop it into any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local Static Server (VS Code / Laragon)

- **VS Code:** Right-click `index.html` and choose **"Open with Live Server"**.

- **Laragon / Node.js:**

  ```bash
  npx serve .
  ```

  Then visit `http://localhost:3000`.

---

## 🌐 Deployment (GitHub Pages)

Proyek ini telah dideploy dan aktif menggunakan **GitHub Pages** melalui branch `main`:

- 🔗 **Live Website:** [https://mfauzanhanif.github.io/CodingCamp-12October26-mfauzanhanif](https://mfauzanhanif.github.io/CodingCamp-12October26-mfauzanhanif)
- 📦 **Repository GitHub:** [https://github.com/mfauzanhanif/CodingCamp-12October26-mfauzanhanif](https://github.com/mfauzanhanif/CodingCamp-12October26-mfauzanhanif)
- 🌿 **Deployment Branch:** `main` (folder `/root`)

### Panduan Deployment

1. Push commit ke branch `main`:

   ```bash
   git add .
   git commit -m "deploy: update project"
   git push origin main
   ```

2. Konfigurasi di GitHub Repository:
   - Buka tab **Settings** > **Pages**.
   - Pada bagian **Build and deployment** > **Source**, pilih **Deploy from a branch**.
   - Tentukan Branch ke `main` dan folder `/ (root)`, lalu klik **Save**.
   - Halaman dashboard otomatis ter-deploy dan dapat diakses melalui URL di atas.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
