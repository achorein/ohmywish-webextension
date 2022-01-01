// Test if we are into a web extension or in a standard page (yarn serve)
const devMode = !chrome.storage;
if (devMode) console.log('DEBUG use mocks for storage');

export const chromeUtils = {
  methods: {
    storageGet(params, callback) {
      if (!devMode) {
        chrome.storage.sync.get(params, callback);
      } else {
        callback(params);
      }
    },
    storageSet(params, callback) {
      if (!devMode) {
        chrome.storage.sync.set(params, callback);
      } else {
        callback(params);
      }
    },
    getTabs(callback) {
      if (!devMode) {
        chrome.tabs.query({ active: true, currentWindow: true }, callback);
      } else {
        callback([{ url: 'http://localhost', title: 'Dev mode' }]);
      }
    },
    executeScriptOnTab(callback) {
      if (!devMode) {
        chrome.tabs.executeScript({ file: '/js/tab.js' }, callback);
      } else {
        callback([{ url: 'http://localhost:8080', title: 'Dev mode', description: 'description', image: 'http://localhost:8080/img/brand.png' }]);
      }
    },
  },
};
