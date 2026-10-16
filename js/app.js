/* ============================================================
   LIFE DASHBOARD — app.js
   Vanilla JS | No frameworks | Local Storage persistence
   ============================================================ */

'use strict';

/* ============================================================
   SECTION 1 — CONSTANTS & LOCAL STORAGE KEYS
   ============================================================ */

const LS_KEYS = {
  userName:    'userName',
  theme:       'theme',
  pomoDuration:'pomoDuration',
  tasks:       'tasks',
  sortMode:    'sortMode',
  quickLinks:  'quickLinks',
  linksInit:   'linksInitialized_v1',
};

/* ============================================================
   SECTION 2 — UTILITIES
   ============================================================ */

/**
 * Read a JSON value from Local Storage.
 * Returns `fallback` if key is missing or JSON is invalid.
 */
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Write a value as JSON to Local Storage. */
function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Generate a simple unique id string. */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Pad a number to 2 digits. */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Show an element by removing "hidden" class. */
function show(el) { el.classList.remove('hidden'); }

/** Hide an element by adding "hidden" class. */
function hide(el) { el.classList.add('hidden'); }

/* ============================================================
   SECTION 3 — THEME TOGGLE
   ============================================================ */

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon      = document.getElementById('theme-icon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next    = current === 'dark' ? 'light' : 'dark';
  lsSet(LS_KEYS.theme, next);
  applyTheme(next);
}

// Init theme (also handled by inline script in <head> to prevent FOUC)
applyTheme(lsGet(LS_KEYS.theme, 'light'));
themeToggleBtn.addEventListener('click', toggleTheme);

/* ============================================================
   SECTION 4 — CLOCK & GREETING
   ============================================================ */

const greetingTimeEl   = document.getElementById('greeting-time');
const greetingDateEl   = document.getElementById('greeting-date');
const greetingPhraseEl = document.getElementById('greeting-phrase');
const greetingNameEl   = document.getElementById('greeting-name');
const editNameBtn      = document.getElementById('edit-name-btn');
const nameEditor       = document.getElementById('name-editor');
const nameInput        = document.getElementById('name-input');
const saveNameBtn      = document.getElementById('save-name-btn');
const cancelNameBtn    = document.getElementById('cancel-name-btn');

const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];

/** Return time-based greeting string. */
function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

/** Update the clock and greeting every second. */
function updateClock() {
  const now    = new Date();
  const hours  = now.getHours();
  const mins   = now.getMinutes();
  const secs   = now.getSeconds();

  greetingTimeEl.textContent  = `${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`;
  greetingDateEl.textContent  = `${DAY_NAMES[now.getDay()]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  greetingPhraseEl.textContent = getGreeting(hours);
}

/** Load and display the saved user name. */
function loadUserName() {
  const name = lsGet(LS_KEYS.userName, 'Friend');
  greetingNameEl.textContent = name;
}

/** Open the name editor inline. */
function openNameEditor() {
  nameInput.value = lsGet(LS_KEYS.userName, '');
  show(nameEditor);
  hide(editNameBtn);
  nameInput.focus();
}

/** Close and hide the name editor. */
function closeNameEditor() {
  hide(nameEditor);
  show(editNameBtn);
}

/** Save the entered name to Local Storage. */
function saveName() {
  const trimmed = nameInput.value.trim();
  const name    = trimmed.length > 0 ? trimmed : 'Friend';
  lsSet(LS_KEYS.userName, name);
  greetingNameEl.textContent = name;
  closeNameEditor();
}

editNameBtn.addEventListener('click', openNameEditor);
saveNameBtn.addEventListener('click', saveName);
cancelNameBtn.addEventListener('click', closeNameEditor);

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveName();
  if (e.key === 'Escape') closeNameEditor();
});

// Init
loadUserName();
updateClock();
setInterval(updateClock, 1000);

/* ============================================================
   SECTION 5 — FOCUS TIMER
   ============================================================ */

const timerDisplay  = document.getElementById('timer-display');
const timerStartBtn = document.getElementById('timer-start');
const timerStopBtn  = document.getElementById('timer-stop');
const timerResetBtn = document.getElementById('timer-reset');
const pomoDurationInput = document.getElementById('pomo-duration');
const pomoSetBtn    = document.getElementById('pomo-set');

// Timer state
let pomoDuration = lsGet(LS_KEYS.pomoDuration, 25); // minutes
let timeLeft     = pomoDuration * 60;                // seconds
let isRunning    = false;
let timerInterval = null;

/** Render current timeLeft to the display. */
function renderTimer() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timerDisplay.textContent = `${pad2(m)}:${pad2(s)}`;
}

/** Update the visual state class of the timer display. */
function setTimerState(state) {
  timerDisplay.classList.remove('running', 'done');
  if (state) timerDisplay.classList.add(state);
}

function startTimer() {
  if (isRunning || timeLeft <= 0) return;
  isRunning = true;
  setTimerState('running');

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    renderTimer();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning     = false;
      timeLeft      = 0;
      setTimerState('done');
    }
  }, 1000);
}

function stopTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning     = false;
  setTimerState(null);
}

function resetTimer() {
  stopTimer();
  timeLeft = pomoDuration * 60;
  renderTimer();
  setTimerState(null);
}

/** Apply a new Pomodoro duration from the input field. */
function setCustomDuration() {
  const val = parseInt(pomoDurationInput.value, 10);
  if (isNaN(val) || val < 1 || val > 120) {
    pomoDurationInput.classList.add('input--error');
    setTimeout(() => pomoDurationInput.classList.remove('input--error'), 800);
    return;
  }
  pomoDuration = val;
  lsSet(LS_KEYS.pomoDuration, pomoDuration);
  resetTimer();
}

timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);
pomoSetBtn.addEventListener('click', setCustomDuration);

pomoDurationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') setCustomDuration();
});

// Init
pomoDurationInput.value = pomoDuration;
renderTimer();

/* ============================================================
   SECTION 6 — TO-DO LIST
   ============================================================ */

const taskInput    = document.getElementById('task-input');
const addTaskBtn   = document.getElementById('add-task-btn');
const taskListEl   = document.getElementById('task-list');
const todoErrorEl  = document.getElementById('todo-error');
const todoEmptyEl  = document.getElementById('todo-empty');

// Sort toolbar buttons
const sortBtns     = document.querySelectorAll('.btn-sort');

// State
let tasks    = lsGet(LS_KEYS.tasks, []);
let sortMode = lsGet(LS_KEYS.sortMode, 'newest');

/** Save tasks array to Local Storage. */
function saveTasks() {
  lsSet(LS_KEYS.tasks, tasks);
}

/** Show a temporary error message in the todo area. */
function showTodoError(msg) {
  todoErrorEl.textContent = msg;
  show(todoErrorEl);
  setTimeout(() => hide(todoErrorEl), 3000);
}

/** Return a sorted copy of the tasks array without mutating the original. */
function sortTasks(arr, mode) {
  const copy = [...arr];
  switch (mode) {
    case 'newest':
      return copy.sort((a, b) => b.createdAt - a.createdAt);
    case 'oldest':
      return copy.sort((a, b) => a.createdAt - b.createdAt);
    case 'az':
      return copy.sort((a, b) => a.text.localeCompare(b.text));
    case 'za':
      return copy.sort((a, b) => b.text.localeCompare(a.text));
    case 'donelast':
      return copy.sort((a, b) => Number(a.done) - Number(b.done));
    default:
      return copy;
  }
}

/** Build a single task item DOM element. */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item${task.done ? ' done' : ''}`;
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked   = task.done;
  checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'undone' : 'done'}`);
  checkbox.addEventListener('change', () => toggleDone(task.id));

  // Task text
  const span = document.createElement('span');
  span.className   = 'task-text';
  span.textContent = task.text;

  // Actions container
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn btn-ghost btn-sm';
  editBtn.textContent = '✏️';
  editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
  editBtn.addEventListener('click', () => editTask(task.id, li, span));

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn btn-ghost btn-sm';
  delBtn.textContent = '🗑️';
  delBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
  delBtn.addEventListener('click', () => deleteTask(task.id));

  actions.append(editBtn, delBtn);
  li.append(checkbox, span, actions);

  return li;
}

/** Render the full task list. */
function renderTasks() {
  taskListEl.innerHTML = '';

  const sorted = sortTasks(tasks, sortMode);

  if (sorted.length === 0) {
    show(todoEmptyEl);
    return;
  }

  hide(todoEmptyEl);
  sorted.forEach(task => {
    taskListEl.appendChild(createTaskElement(task));
  });
}

/** Add a new task. */
function addTask() {
  const text = taskInput.value.trim();

  if (text.length === 0) {
    showTodoError('Task cannot be empty.');
    taskInput.focus();
    return;
  }

  // Duplicate check (case-insensitive)
  const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    showTodoError(`"${text}" is already in your list.`);
    taskInput.select();
    return;
  }

  const newTask = {
    id:        uid(),
    text:      text,
    done:      false,
    createdAt: Date.now(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

/** Toggle the done state of a task. */
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTasks();
}

/** Delete a task by id. */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Turn a task's text span into an inline edit input.
 * @param {string} id   - Task id
 * @param {HTMLElement} li   - The list item element
 * @param {HTMLElement} span - The text span element
 */
function editTask(id, li, span) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Replace span with input
  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'task-edit-input';
  editInput.value     = task.text;
  editInput.maxLength = 100;
  editInput.setAttribute('aria-label', 'Edit task text');

  span.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  /** Commit the edit */
  function commitEdit() {
    const newText = editInput.value.trim();

    if (newText.length === 0) {
      // Revert if empty
      editInput.replaceWith(span);
      return;
    }

    // Duplicate check (ignore current task's own text)
    const isDuplicate = tasks.some(t => t.id !== id && t.text.toLowerCase() === newText.toLowerCase());
    if (isDuplicate) {
      showTodoError(`"${newText}" is already in your list.`);
      editInput.focus();
      return;
    }

    task.text = newText;
    saveTasks();
    renderTasks();
  }

  editInput.addEventListener('blur', commitEdit);
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { editInput.removeEventListener('blur', commitEdit); commitEdit(); }
    if (e.key === 'Escape') { editInput.replaceWith(span); }
  });
}

/** Handle sort button clicks. */
function handleSortClick(e) {
  const btn = e.target.closest('.btn-sort');
  if (!btn) return;

  sortMode = btn.dataset.sort;
  lsSet(LS_KEYS.sortMode, sortMode);

  // Update active state
  sortBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderTasks();
}

// Init sort active state
sortBtns.forEach(b => {
  if (b.dataset.sort === sortMode) b.classList.add('active');
  else b.classList.remove('active');
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTask(); });
document.querySelector('.sort-toolbar').addEventListener('click', handleSortClick);

// Init
renderTasks();

/* ============================================================
   SECTION 7 — QUICK LINKS
   ============================================================ */

const linkNameInput   = document.getElementById('link-name-input');
const linkUrlInput    = document.getElementById('link-url-input');
const addLinkBtn      = document.getElementById('add-link-btn');
const linksContainer  = document.getElementById('links-container');
const linksErrorEl    = document.getElementById('links-error');
const linksEmptyEl    = document.getElementById('links-empty');

// Default Preset Links
const DEFAULT_LINKS = [
  {
    id:   'link-github',
    name: 'Github',
    url:  'https://github.com/mfauzanhanif/mfauzanhanif-CodingCamp-12Octobert26-fauzanhanif/',
  },
  {
    id:   'link-github-page',
    name: 'Github Page',
    url:  'https://mfauzanhanif.github.io/mfauzanhanif-CodingCamp-12Octobert26-fauzanhanif/',
  },
];

// State
let links = lsGet(LS_KEYS.quickLinks, null);
const isLinksInit = lsGet(LS_KEYS.linksInit, false);

if (!isLinksInit) {
  const current = Array.isArray(links) ? links : [];
  DEFAULT_LINKS.forEach(defLink => {
    const exists = current.some(l => l.url.replace(/\/+$/, '') === defLink.url.replace(/\/+$/, ''));
    if (!exists) {
      current.push(defLink);
    }
  });
  links = current;
  lsSet(LS_KEYS.quickLinks, links);
  lsSet(LS_KEYS.linksInit, true);
} else if (!links) {
  links = [...DEFAULT_LINKS];
  lsSet(LS_KEYS.quickLinks, links);
}

/** Save links array to Local Storage. */
function saveLinks() {
  lsSet(LS_KEYS.quickLinks, links);
}

/** Show a temporary error in the links area. */
function showLinksError(msg) {
  linksErrorEl.textContent = msg;
  show(linksErrorEl);
  setTimeout(() => hide(linksErrorEl), 3000);
}

/**
 * Ensure the URL has a protocol prefix.
 * Returns null if the URL is still invalid after patching.
 */
function normalizeUrl(raw) {
  let url = raw.trim();
  if (!url) return null;

  // Auto-prepend https:// if no protocol present
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // Basic URL validation
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

/** Render the links container. */
function renderLinks() {
  linksContainer.innerHTML = '';

  if (links.length === 0) {
    show(linksEmptyEl);
    return;
  }

  hide(linksEmptyEl);

  links.forEach(link => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';

    const a = document.createElement('a');
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';
    a.className = 'link-item';
    a.textContent = link.name;
    a.setAttribute('aria-label', `Open ${link.name} (${link.url})`);

    // Delete button (sits inside the link item visually)
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'link-delete';
    delBtn.textContent = '✕';
    delBtn.setAttribute('aria-label', `Remove link: ${link.name}`);
    delBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(link.id);
    });

    a.appendChild(delBtn);
    linksContainer.appendChild(a);
  });
}

/** Add a new quick link. */
function addLink() {
  const name = linkNameInput.value.trim();
  const rawUrl = linkUrlInput.value.trim();

  if (!name) {
    showLinksError('Please enter a name for the link.');
    linkNameInput.focus();
    return;
  }

  const url = normalizeUrl(rawUrl);
  if (!url) {
    showLinksError('Please enter a valid URL (e.g. github.com).');
    linkUrlInput.focus();
    return;
  }

  const newLink = { id: uid(), name, url };
  links.push(newLink);
  saveLinks();
  renderLinks();

  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
}

/** Delete a quick link by id. */
function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}

addLinkBtn.addEventListener('click', addLink);

linkUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

linkNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') linkUrlInput.focus();
});

// Init
renderLinks();

/* ============================================================
   END OF app.js
   ============================================================ */
