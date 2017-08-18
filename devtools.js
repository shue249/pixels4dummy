/*global chrome*/

var panelWindow, injectedPanel = false, injectedPage = false, panelVisible = false, savedStack = [];

chrome.devtools.panels.create("Pixel4Dummies", "icon.png", "index.html");