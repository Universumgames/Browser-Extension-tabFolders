import { recursiveSelectionSort } from '../sorting.js';
import * as defs from './definitions.js';
import { getFirefoxTabByURL, getFolderJSONObjectByID } from './getter.js';
import { addTabSync, createItemIDByTab } from './adder.js';
import { tabExistsByTabID } from './checker.js';
function updatePinnedTabs(elements, tabs) {
    var pinnedFolder = getFolderJSONObjectByID(defs.pinnedFolderID, { elements });
    if (pinnedFolder == undefined) {
        pinnedFolder = {
            name: "Pinned Tabs",
            open: true,
            folderID: defs.pinnedFolderID,
            parentFolderID: "-1",
            elements: [],
            index: defs.pinnedIndex
        };
        elements[defs.pinnedIndex] = pinnedFolder;
    }
    pinnedFolder.elements = new Array();
    for (var key in tabs) {
        var tab = tabs[key];
        if (tab.pinned) {
            addTabSync(pinnedFolder, tab.title, tab.url, tab.favIconUrl, true, tab.id, createItemIDByTab(tab), tab.hidden);
        }
    }
}
function updateUnorderedTabs(elements, tabs) {
    var unorderedFolder = getFolderJSONObjectByID(defs.unorderedFolderID, { elements });
    if (unorderedFolder == undefined) {
        unorderedFolder = {
            name: "Unordered Tabs",
            open: true,
            folderID: defs.unorderedFolderID,
            parentFolderID: "-1",
            elements: [],
            index: defs.unorderedIndex
        };
        elements[defs.unorderedIndex] = unorderedFolder;
    }
    unorderedFolder.elements = new Array();
    for (var tab of tabs) {
        var exist = tabExistsByTabID(tab.id, elements);
        if (!tab.pinned && !exist) {
            addTabSync(unorderedFolder, tab.title, tab.url, tab.favIconUrl, true, tab.id, createItemIDByTab(tab), tab.hidden);
        }
    }
}
export function updateTabsOnStartUp(data, tabs) {
    for (var key in data.elements) {
        var element = data.elements[key];
        if ('folderID' in element)
            updateTabsOnStartUp(element, tabs);
        else {
            var item = element;
            var firefoxTab = getFirefoxTabByURL(tabs, item.url);
            if (firefoxTab == undefined) {
                item.tabID = "-1";
                item.hidden = true;
            }
            else {
                item.tabID = firefoxTab.id;
                item.hidden = firefoxTab.hidden;
            }
        }
    }
}
void function updateOrganisedTabs(elements, tabs) {
};
export function updateTabs(elements, tabs) {
    updateUnorderedTabs(elements, tabs);
    updatePinnedTabs(elements, tabs);
    recursiveSelectionSort({ elements });
}
//# sourceMappingURL=updater.js.map