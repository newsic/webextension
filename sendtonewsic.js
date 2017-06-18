/*
	                         _
	                        (_)
	 _ __   _____      _____ _  ___
	| '_ \ / _ \ \ /\ / / __| |/ __|
	| | | |  __/\ V  V /\__ \ | (__
	|_| |_|\___| \_/\_/ |___/_|\___|

	=================================

	Howdy, dear source code reader!

  	* Project page: https://newsic.tocsin.de
	* newsic on GitHub: https://github.com/newsic

	* Author: Stephan Fischer (https://stephan-fischer.de, https://tocsin.de)

*/

/* check current url for playlist id and,
purely optional, index of current viewed video */
function scanURL(url) {
	var regex = /(?:https?:\/\/)?(?:[a-z].*)?youtube\.com\/.*list=([a-zA-Z0-9-_]*)(?:.*index=(\d*))?/g;
	// regexec[1] is playlist id, regexec[2] is index (optional)
	/* todo:
		- sometimes index parameter is set in front of "list"
		- regex needs to be updated for this issue
		- possible new problem: how to fetch groups correctly?
	*/

	// -> https://www.youtube.com/watch?v=z-y5DAB5WQc&index=1&list=PLfU2RMxoOiSAZLR48HMRmgKZP5A2LhFDY

	return regex.exec(url);
};


// insert button on playlist pages
function insertButton() {
	var buttonPlaylistOverview = document.getElementsByClassName("playlist-actions");
	var buttonInPlaylist = document.getElementsByClassName("playlist-nav-controls");
	var regexec = scanURL(window.location.href);
	regexec.lastIndex = 0;

	var buttonbg = "#9ba766";
	var buttontext = "#fff";

	var buttonurl;

 	chrome.storage.local.get("sendtonewsicurl", function(res) {
 		if(res.sendtonewsicurl) buttonurl = res.sendtonewsicurl;

 		// fallback url for first time usage (will stay like this until user saves or changes it in settings)
 		else buttonurl = "https://trynewsic.tocsin.de";

 		buttonurl += "/play/youtube/" + regexec[1];

		// if playlist index is set: append it to newsic link
		var number;
		if(regexec[2]) number = regexec[2] - 1;
		if(number) buttonurl += "#" + number;

		// playlist overview pages
		if(typeof buttonPlaylistOverview[0] !== 'undefined') {
			var link = document.createElement("a");
			link.href = buttonurl;
			link.target = "_blank";

			button = document.createElement("button");
			button.style = "background:" + buttonbg + ";color:" + buttontext;
			button.className = "yt-uix-tooltip yt-uix-button yt-uix-button-size-default yt-uix-button-default";
			button.setAttribute("data-tooltip-text", chrome.i18n.getMessage("YTPlaylistButtonTooltip"));
		
			newsiclogo = document.createElement("img");
			newsiclogo.style = "width:20px;height:20px;margin-right:5px";
			newsiclogo.src = browser.extension.getURL("icons/logo48.png");

			button.appendChild(newsiclogo);

			buttontxt = document.createElement("span");
			buttontxt.textContent = chrome.i18n.getMessage("YTPlaylistButton");

			button.appendChild(buttontxt);
			link.appendChild(button);
			buttonPlaylistOverview[0].appendChild(link);
		}

		// watching video in playlist
		if(typeof buttonInPlaylist[0] !== 'undefined') {

			var link = document.createElement("a");
			link.href = buttonurl;
			link.target = "_blank";
			link.className = "yt-uix-button yt-uix-button-size-default yt-uix-button-player-controls yt-uix-button-empty yt-uix-button-has-icon shuffle-playlist yt-uix-button-opacity yt-uix-tooltip yt-uix-tooltip yt-uix-button-toggled";
			link.setAttribute("data-tooltip-text", chrome.i18n.getMessage("YTPlaylistButton2Tooltip"));

			var span = document.createElement("span");
			span.className = "yt-uix-button-icon-wrapper";

			newsiclogo = document.createElement("img");
			newsiclogo.style = "width:24px;height:24px";
			newsiclogo.src = browser.extension.getURL("icons/logo48.png");

			span.appendChild(newsiclogo);
			link.appendChild(span);
			buttonInPlaylist[0].appendChild(link);
		}
  	});	
};

document.addEventListener("spfdone", insertButton);
document.addEventListener("DOMContentLoaded", insertButton);