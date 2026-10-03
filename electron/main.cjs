/* Electron main process: serves the built Vite app (dist/) over a custom
 * app:// scheme so that absolute paths (/assets, /models) work unchanged.
 * Responses are read with fs (asar-safe) and never set Content-Encoding, so
 * the renderer can detect and decode gzip model payloads itself. */
const {app, BrowserWindow, protocol} = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const ROOT = path.join(__dirname, '..', 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.bin': 'application/octet-stream',
  '.gz': 'application/octet-stream',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

protocol.registerSchemesAsPrivileged([
  {scheme: 'app', privileges: {standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true}},
]);

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 360,
    minHeight: 500,
    backgroundColor: '#f2f3f3',
    autoHideMenuBar: true,
    webPreferences: {contextIsolation: true, nodeIntegration: false, sandbox: true},
  });
  win.loadURL('app://bundle/index.html');
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  return win;
}

app.whenReady().then(() => {
  protocol.handle('app', async (request) => {
    try {
      const url = new URL(request.url);
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith('/')) pathname += 'index.html';
      const file = path.normalize(path.join(ROOT, pathname));
      if (!file.startsWith(ROOT + path.sep)) return new Response('Forbidden', {status: 403});
      const body = await fs.readFile(file);
      const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
      return new Response(body, {headers: {'Content-Type': type, 'Cache-Control': 'no-cache'}});
    } catch {
      return new Response('Not found', {status: 404});
    }
  });
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
