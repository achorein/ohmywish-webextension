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
    getCurrentTab(callback) {
      if (!devMode) {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
          if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
          // `tab` will either be a `tabs.Tab` instance or `undefined`.
          callback(tab);
        });
      } else {
        callback([{ url: 'http://localhost', title: 'Dev mode' }]);
      }
    },
    executeScriptOnTab(callback) {
      if (!devMode) {
        this.getCurrentTab(tab => {
          chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['/js/tab.js'] }).then(injectionResults => {
            callback(injectionResults[0].result);
          });
        });
      } else {
        callback({ url: 'http://localhost:8080', title: 'Dev mode', description: 'description', image: 'http://localhost:8080/img/brand.png' });
      }
    },
  },
};
