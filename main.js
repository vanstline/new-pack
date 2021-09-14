const path = require('path')
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  shell,
  Notification,
  dialog,
} = require('electron')
const isDev = require('electron-is-dev')
const { autoUpdater } = require('electron-updater')

let mainWindow

function showNotification() {
  const notification = {
    title: 'Basic Notification',
    body: 'Notification from the Main process',
  }
  new Notification(notification).show()
}

app.on('ready', () => {
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.on('error', error => {
    dialog.showErrorBox(
      'Error: ',
      error === null ? 'unknown' : error.stack || error
    )
  })

  autoUpdater.on('updater-available', () => {
    dialog.showMessageBox(
      {
        type: 'info',
        title: '应用有新的版本',
        message: '发现新版本, 是否现在更新?',
        buttons: [ '是', '否' ],
      },
      btnIndex => {
        !btnIndex && autoUpdater.downloadUpdate()
      }
    )
  })

  autoUpdater.on('updater-not-available', () => {
    dialog.showMessageBox({
      title: '没有新版本',
      message: '当前已经是最新版本',
    })
  })

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const ROOT_PATH = app.getAppPath()

  ipcMain.on('get-app-path', event => {
    event.reply('reply-app-path', ROOT_PATH)
  })
  ipcMain.on('download', (event, args) => {
    //会触发will-download事件
    mainWindow.webContents.downloadURL(args.downloadPath)
  })

  const devPath = 'http://localhost:8888/#/login'
  const prodPath = `http://localhost:8888/#/login`
  const urlLocation = isDev ? devPath : prodPath

  mainWindow.loadURL(urlLocation)

  app.whenReady().then(mainWindow).then(showNotification)
  // mainWindow.loadFile('public/index.html')
})
