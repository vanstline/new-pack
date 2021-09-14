const electron = require('electron')
const { machineId } = require('node-machine-id')

global.Electron = electron
global.machineId = ''

async function getMachineId() {
  let id = await machineId()
  global.machineId = id
}

getMachineId()

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = `${selector}: ${text}`
  }
  global.process.env.AGENT = process.env.AGENT
  for (const type of [ 'chrome', 'node', 'electron' ]) {
    global[`__PROCESS_${type.toUpperCase()}_ENV__`] = process.versions[type]
    replaceText(`${type}-version`, process.versions[type])
  }

  electron.ipcRenderer.send('message')
})
