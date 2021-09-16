const electron = require('electron')
const { machineId } = require('node-machine-id')

global.Electron = electron
global.machineId = ''

const ENV_ARR = [ 'AGENT' ]

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

  for (const type of ENV_ARR) {
    global.process.env[type] = process.env[type]
  }

  for (const type of [ 'chrome', 'node', 'electron' ]) {
    global[`__PROCESS_${type.toUpperCase()}_ENV__`] = process.versions[type]
    replaceText(`${type}-version`, process.versions[type])
  }

  electron.ipcRenderer.send('message')

  // let btn = document.getElementById('singleCapture')
  // console.log(`btn`, btn);
})
