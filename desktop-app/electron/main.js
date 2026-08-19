const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = process.platform === 'win32'
  ? path.join('C:', 'medicine data')
  : path.join(app.getPath('userData'), 'medicine data');

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RECORDS_DIR = path.join(DATA_DIR, 'records');

function ensureStorage() {
  fs.mkdirSync(RECORDS_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) {
    const adminPassword = crypto.randomBytes(9).toString('base64url');
    const users = [{
      username: 'admin',
      passwordHash: hashPassword(adminPassword),
      role: 'admin'
    }];
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    fs.writeFileSync(path.join(DATA_DIR, 'FIRST_LOGIN.txt'),
      `Default administrator account\nUsername: admin\nTemporary password: ${adminPassword}\n\nChange this password after first login.\n`, 'utf8');
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readUsers() {
  ensureStorage();
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function sanitizeName(value) {
  return String(value || '').replace(/[^a-zA-Z0-9._ -]/g, '_').slice(0, 80) || 'record';
}

function recordFileName(record) {
  const stamp = String(record.savedAt || Date.now()).replace(/[^0-9]/g, '');
  return `${stamp}-${sanitizeName(record.user || 'user')}.json`;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, '..', 'index.html'));
}

ipcMain.handle('auth:login', (_event, username, password) => {
  const user = readUsers().find(u => u.username.toLowerCase() === String(username).trim().toLowerCase());
  if (!user || user.passwordHash !== hashPassword(String(password))) {
    return { ok: false, message: 'Invalid username or password.' };
  }
  return { ok: true, username: user.username, role: user.role };
});

ipcMain.handle('storage:save-record', (_event, record) => {
  ensureStorage();
  const saved = {
    ...record,
    savedAt: new Date().toISOString()
  };
  const filePath = path.join(RECORDS_DIR, recordFileName(saved));
  fs.writeFileSync(filePath, JSON.stringify(saved, null, 2), 'utf8');
  return { ok: true, filePath, savedAt: saved.savedAt };
});

ipcMain.handle('storage:list-records', () => {
  ensureStorage();
  return fs.readdirSync(RECORDS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      try {
        const full = path.join(RECORDS_DIR, file);
        const record = JSON.parse(fs.readFileSync(full, 'utf8'));
        return { ...record, fileName: file };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
});

ipcMain.handle('storage:delete-record', (_event, fileName) => {
  const safe = path.basename(String(fileName));
  const full = path.join(RECORDS_DIR, safe);
  if (!full.startsWith(RECORDS_DIR) || !fs.existsSync(full)) return { ok: false };
  fs.unlinkSync(full);
  return { ok: true };
});

ipcMain.handle('admin:list-users', () => {
  return readUsers().map(({ username, role }) => ({ username, role }));
});

ipcMain.handle('admin:create-user', (_event, username, password) => {
  const name = String(username).trim();
  if (!name || !password) return { ok: false, message: 'Username and password are required.' };
  const users = readUsers();
  if (users.some(u => u.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false, message: 'User already exists.' };
  }
  users.push({ username: name, passwordHash: hashPassword(String(password)), role: 'user' });
  writeUsers(users);
  return { ok: true };
});

ipcMain.handle('admin:reset-password', (_event, username, password) => {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user || !password) return { ok: false, message: 'User or password is invalid.' };
  user.passwordHash = hashPassword(String(password));
  writeUsers(users);
  return { ok: true };
});

ipcMain.handle('app:data-folder', () => DATA_DIR);

app.whenReady().then(() => {
  ensureStorage();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
