function saveOptions(e) {
  chrome.storage.local.set({
    sendtonewsicurl: document.querySelector("#sendtonewsicurl").value
  });
  e.preventDefault();
}

// fetch data from local storage (or get default values)
function restoreOptions() {
  chrome.storage.local.get("sendtonewsicurl", function(res) {
    document.querySelector("#sendtonewsicurl").value = res.sendtonewsicurl || "https://trynewsic.tocsin.de";
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

// i13n (sadly there's no more elegant way of doing this yet)
document.addEventListener("DOMContentLoaded", function() {
  [].forEach.call(document.getElementsByTagName("*"), function(el) {
    if (el.hasAttribute("data-i18n")) {
      var translated = chrome.i18n.getMessage(el.getAttribute("data-i18n"));
      el.insertAdjacentHTML("beforeend", translated);
    }
  });
});