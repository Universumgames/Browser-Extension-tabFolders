// #region imports
import * as tabHelper from './tabHelper.js'
import { elementData, folderData, itemData, tabStructData } from './interfaces.js'
import * as handler from './handler.js'
import * as firefoxHandler from './firefoxHandler.js'
import { createEmptyData, getDataStructFromFirefox, saveDataInFirefox, updateTabsOnStartUp } from './dataHandler/importer.js'
// #endregion

// #region init code
var dataStorage: tabStructData = createEmptyData()

// on firefox start (tabID's may have changed, changing these in data struct)
var firefoxStartHandler: firefoxHandler.firefoxStartupHandler = {
    startup: startup,
}
firefoxHandler.startupHandler(firefoxStartHandler)
// on sidepanel fully loaded
document.addEventListener('DOMContentLoaded', () => setup())

// add updateHTML listener
// browser.tabs.addEventListener("updateHTMLList", () => updateHTMLList())

async function startup() {
    var dataTmp = await getDataStructFromFirefox()
    if (dataTmp == undefined) {
        saveDataInFirefox(dataStorage)
        console.log('Data cleared or extension is newly installed, created new storage structure: ', dataStorage)
    } else dataStorage = dataTmp

    tabHelper.getTabs().then((tabs) => {
        console.log(tabs)
        updateTabsOnStartUp(dataStorage.rootFolder, tabs)
    })
}

async function setup() {
    var dataTmp = await getDataStructFromFirefox()
    console.log(dataTmp)
    if (dataTmp === undefined) {
        saveDataInFirefox(dataStorage)
        console.log('Data cleared or extension is newly installed, created new storage structure: ', dataStorage)
    } else dataStorage = dataTmp

    // load up pinned tabs
    tabHelper.getTabs().then((tabs) => {
        handler.loadFolderList(tabs, dataStorage)
    })

    handler.setupHandler(setup)

    console.log(dataStorage)
}
// #endregion

// #region Event handler
