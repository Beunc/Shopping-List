const electron = require('electron')
const url = require('url')
const path = require('path')

const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = electron;

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;


app.on('ready', function () {

	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	})
	mainWindow.loadURL(url.format({

		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	mainWindow.on('closed', function () {
		app.quit();
	})

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true
		},
		width: 300,
		height: 200,
		title: 'Add Shopping List Item'
	});

	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	addWindow.on('close', function () {
		addWindow = null;
	})
}

ipcMain.on('item:add', function (e, item) {
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
})


const mainMenuTemplate = [{
	label: 'File',
	submenu: [{
			label: 'Esya ekle',
			click() {
				createAddWindow();
			}
		},
		{
			label: 'Esyalari sil',
			click(){
				mainWindow.webContents.send('item:clear');
			}
		},
		{
			label: 'Cikis',
			accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
			click() {
				app.quit();
			}
		}
	]
}];


// If mac, add empty object to menu
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

// Developer Tools run in developer mode
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}