// Views
let view = 'default'; // [default, options, about]
let since = localStorage.getItem('since') || 'five_minutes';

function i18n(key) {
  return chrome.i18n.getMessage(key);
}

// Default settings
const defaults = {
  "history": true,
  "cookies": true,
  "cache": true,
  "downloads": true,
  "formData": false,
  "passwords": false,
  "appcache": false,
  "localStorage": false,
  "pluginData": false,
  "fileSystems": false,
  "indexedDB": false,
  "webSQL": false
};

const labels = {
  "history": i18n('item_history'),
  "cookies": i18n('item_cookies'),
  "cache": i18n('item_cache'),
  "downloads": i18n('item_downloads'),
  "formData": i18n('item_formData'),
  "passwords": i18n('item_passwords'),
  "appcache": i18n('item_appcache'),
  "localStorage": i18n('item_localStorage'),
  "pluginData": i18n('item_pluginData'),
  "fileSystems": i18n('item_fileSystems'),
  "indexedDB": i18n('item_indexedDB'),
  "webSQL": i18n('item_webSQL')
};

let settings = {};

function init() {
  settings = loadSettings() || { ...defaults };
  render();
}

// Reset to default settings
function reset() {
  localStorage.removeItem('settings');
  init();
}

// Save settings
function save() {
  localStorage.setItem('settings', JSON.stringify(settings));
}

function show(screen) {
  view = screen;
  render();
}

function forget() {
  localStorage.setItem('since', since);
  chrome.runtime.sendMessage({ action: "clear", since: since, settings: settings });
}

// Load settings
function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('settings'));
  } catch (e) {
    return false;
  }
}

function renderDefault() {
  document.getElementById('default-view').style.display = view === 'default' ? 'block' : 'none';
  document.getElementById('since-five-minutes').checked = since === 'five_minutes';
  document.getElementById('since-one-hour').checked = since === 'one_hour';
  document.getElementById('since-one-day').checked = since === 'one_day';

  const itemsList = document.getElementById('items-list');
  itemsList.innerHTML = '';

  for (const key in settings) {
    if (settings[key]) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${i18n('clear')}</span> <strong>${labels[key]}</strong>`;
      itemsList.appendChild(li);
    }
  }
}

function renderAbout() {
  document.getElementById('about-view').style.display = view === 'about' ? 'block' : 'none';
}

function renderSettings() {
  document.getElementById('settings-view').style.display = view === 'settings' ? 'block' : 'none';

  const settingsContainer = document.getElementById('settings-container');
  settingsContainer.innerHTML = '';

  for (const key in settings) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = settings[key];
    checkbox.addEventListener('change', () => {
      settings[key] = checkbox.checked;
    });
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + labels[key]));
    settingsContainer.appendChild(label);
  }
}

function render() {
  renderDefault();
  renderAbout();
  renderSettings();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Highlight browser icon
  chrome.runtime.sendMessage({ action: "init" });

  // i18n
  document.querySelectorAll('[i18n]').forEach(element => {
    element.innerHTML = chrome.i18n.getMessage(element.getAttribute('i18n'));
  });

  // Handle external links
  document.querySelectorAll('[data-href]').forEach(link => {
    link.addEventListener('click', () => {
      window.open(link.getAttribute('data-href'));
    });
  });

  // Event listeners for radio buttons
  document.getElementById('since-five-minutes').addEventListener('change', () => {
    since = 'five_minutes';
  });
  document.getElementById('since-one-hour').addEventListener('change', () => {
    since = 'one_hour';
  });
  document.getElementById('since-one-day').addEventListener('change', () => {
    since = 'one_day';
  });

  // Event listeners for buttons
  document.getElementById('forget-btn').addEventListener('click', forget);
  document.getElementById('save-btn').addEventListener('click', () => {
    save();
    show('default');
  });
  document.getElementById('reset-btn').addEventListener('click', reset);

  // Event listeners for navigation
  document.getElementById('info-icon').addEventListener('click', () => show('about'));
  document.getElementById('customize-link').addEventListener('click', () => show('settings'));
  document.getElementById('back-icon').addEventListener('click', () => show('default'));

  init();
});
