'use strict';

const { Tray, app, BrowserWindow, globalShortcut, dialog, Menu } = require('electron');

let mainWindow = null;
let contextMenu = null;

function createWindow() {
	  mainWindow = new BrowserWindow({
		title: "Messages for web",
		width: 480,
		height: 720,
		resizable: false,
		backgroundColor: '#000000',
		frame: true,
		fullScreen: true,
		titleBarStyle: 'hidden',
		transparent: false,
		webPreferences: {
		  //devTools: false,
		  preload: __dirname + '/renderer.js'
		}
	  });

	  mainWindow.loadURL("https://messages.google.com/web/authentication");
	  mainWindow.setMenu(null);
	  mainWindow.on('closed', () => {
		mainWindow = null;
	  });
	mainWindow.on('maximize', function(event){
		event.preventDefault();
		mainWindow.unmaximize();
	});
	
	var tray = new Tray(__dirname + "/messages_96dp.png");

	mainWindow.on('close', function (event) {
		if (!app.isQuiting){
			event.preventDefault();
			mainWindow.hide();
		}

		return false;
	});

	contextMenu = Menu.buildFromTemplate([
		{ label: 'Show', click:  function(){
			mainWindow.show();
		} },
		{ label: 'Quit', click:  function(){
			app.isQuiting = true;
			app.quit();
		} }
	]);
	
	tray.setContextMenu(contextMenu);
	tray.setToolTip('Messages for web');

	tray.on("click", () => {
		mainWindow.show()
	});
}

var exitDialogExists = false;
function exit() {
  if (exitDialogExists) return null;
  exitDialogExists = true;
  dialog.showMessageBox(null, {
    type: "warning",
    title: "Confirm",
    message: "Are you sure you want to exit?",
    buttons: [
      "No",
  	  "Yes"
    ],
    defaultId: 0
  }, (response) => {
	exitDialogExists = false;
    if (response > 0) {
  	  app.quit();
    }
  });
}

app.on('ready', createWindow);
app.on('ready', () => {
  //globalShortcut.register('CommandOrControl+Shift+I', () => {
  //  return false;
  //});
  mainWindow.setTitle("Messages");
});

app.on('window-all-closed', () => {
  app.quit();
});

let first_ = false;
app.on('browser-window-created', (ev, win) => {
	if (first_) {
		win.close();
	} else {
		first_ = true;
		return;
	}
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});