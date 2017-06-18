var currentTab;

function scanURL(url) {
  // same as in sendtonewsic.js, therefore it needs some polishing too ;)
  var regex = /(?:https?:\/\/)?(?:[a-z].*)?youtube\.com\/.*list=([a-zA-Z0-9-_]*)(?:.*index=(\d*))?/g;
  return regex.exec(url);
};

function updateActiveTab(tabs) {
  function updateTab(tabs) {
    //console.log(tabs[0]);
    if (tabs[0]) {
      currentTab = tabs[0];

      var regexec = scanURL(currentTab.url);
   
      if(regexec && regexec[1]) {
        regexec.lastIndex = 0;
        chrome.browserAction.enable();
        chrome.browserAction.setIcon({
          tabId: currentTab.id, path: "icons/logo48.png"
        });
        chrome.browserAction.setBadgeText({text: ""});
      } else {
        chrome.browserAction.setIcon({
          tabId: currentTab.id, path: "icons/logo48_bw.png"
        });
        chrome.browserAction.disable();
      } 
    }
  }

  var gettingActiveTab = chrome.tabs.query({active: true, currentWindow: true}, updateTab);
}


function handleClick(tab) {
  if (tab) {
    var regexec = scanURL(tab.url);
    if(regexec && regexec[1]) {
      regexec.lastIndex = 0;
      var url;
      var number;
      chrome.storage.local.get("sendtonewsicurl", function(res) {
        if(res.sendtonewsicurl) url = res.sendtonewsicurl;
        else url = "https://trynewsic.tocsin.de";
        url += "/play/youtube/" + regexec[1];

        // if index is set
        if(regexec[2]) number = regexec[2] - 1;
        if(number) url += "#" + number;

        var creating = chrome.tabs.create({
          url: url
        });

        creating.then(onCreated, onError);
      });
    }
  }
}


// handle the click
chrome.browserAction.onClicked.addListener(handleClick);

// listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
chrome.tabs.onActivated.addListener(updateActiveTab);

updateActiveTab();