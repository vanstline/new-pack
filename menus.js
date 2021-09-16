const { app, Menu, shell } = require('electron')

const menu = [
  {
    label: 'Star',
    submenu: [
      {
        label: '关于我们',
        click() {
          shell.openExternal('https://www.bjxstars.com')
        },
      },
    ],
  },
]

if (process.platform === 'darwin') {
  menu.unshift({
    label: app.getName(),
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit()
        },
      },
    ],
  })
}
const menus = Menu.buildFromTemplate(menu)

module.exports = {
  menus,
}
