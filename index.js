const menubar = require('menubar')
const path = require('path')
const app = require('app')

const mb = new menubar({
  // 'always-on-top': true,
  resizable: false,
  width: 250,
  height: 281,
  preloadWindow: true,
  icon: __dirname + '/app/IconTemplate.png'
})

// width: 1280,
// height: 720,

mb.on('ready', () => {
  console.log('Ready');
  mb.tray.setToolTip(`${app.getName()} ${app.getVersion()}`)
  mb.tray.setHighlightMode(false)
  mb.tray.setTitle('ddd D MMM HH:MM')
})

mb.on('after-create-window', () => {
  if (process.env.NODE_ENV === 'dev') {
    mb.window.show()
    mb.window.openDevTools()
    mb.window.loadURL('http://localhost:8080/')
    mb.window.maximize()
    mb.window.setContentSize(1280,760)
    // mb.window.setMovable(1)
  }
})

exports.mb = mb
