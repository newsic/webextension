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
	var button = document.getElementsByClassName("playlist-actions");
	var button2 = document.getElementsByClassName("playlist-nav-controls");
	var regexec = scanURL(window.location.href);

	// newsic logo as base64 encoded image (50x50)
	var newsiclogo = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAdgB2AAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAyADIDAREAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAYHCAEF/8QANBAAAQQBAQUEBgsAAAAAAAAAAQACAwQRBQYHCCFBEiIxcRMWNXSysyYyN0NRYWRzgZGx/8QAGwEBAAMBAQEBAAAAAAAAAAAAAAECBgUDBAf/xAAnEQEAAgAEAwkBAAAAAAAAAAAAAQIDBAURBiFxEhQxMjRBUcHwM//aAAwDAQACEQMRAD8Astfl6ggICAgICAgsHdfuy9fIrNiWXsxwytiGJOyc4yeh6YXV07Tu+xMymIT6PhsgbczJbcYC7ut9Lnljnk4HVdSOH47XOeSdno2uG/Q3wFteX0cmOThK88/5XrbQMOY5GymNutgdU2JvOrXYnBme648w4dHA9Qs9nMlfJ27NkTCLL4kCAg0Dw0+y73vo+WFquH/Jbr9LQszeXtu3YDZabXG1hYsOe2GvE44aZHdT+QAJXY1DOdxwJxdt58ISiO6De3q23MlqprcFds9ctOYWloLXHkcEnwwvg0vVMTOTNcSI3j4REvR3+6TXv7v7V58YMtFzXsd1AJwR/n9L21vCi+Vm0+MEsnrDKiAg0Dw0+y73vo+WFquH/Jbr9LQ9niZJ9SqQ/G+34HL34h9PXqSgHDofpFqQ/Tx/GuXoP9bdEQuXfV9metfts+MLQ6v6O/73Wlj9YFQQEF98OFytX0+3FNMxjpLvdDnAfdhajQL1rSYmff6Wh7HEvbrP2P0+KOdj3OvjAa4HwYV78QXrOXrET7koDw+269TX9RfYkawOgjaCSBz7a5eh2iuLbf4RC5d9d2oN2esgWI3FzY2gNeCcmRq0Or3r3O/P9utLIqwaggIOhzm+BI8kAvc76zifMoOAkeBwg6XvcMF7j5lBxAQEBAQEBAQEH//Z";

	var buttonbg = "#9ba766";
	var buttontext = "#fff";

	var buttonurl;

 	chrome.storage.local.get("sendtonewsicurl", function(res) {
 		if(res.sendtonewsicurl) buttonurl = res.sendtonewsicurl;

 		// fallback url for first time usage (will stay like this until user saves or changes it in settings)
 		else buttonurl = "https://trynewsic.tocsin.de";

 		buttonurl += "/play/youtube/" + regexec[1];

		// if index is set
		if(regexec[2]) buttonurl += "#" + regexec[2];

		// playlist overview pages
		if(typeof button[0] !== 'undefined') {
			button[0].insertAdjacentHTML("beforeend", '<a href="' + buttonurl + '" target="_blank"><button style="background:' + buttonbg + ';color:' + buttontext + '" class="yt-uix-tooltip yt-uix-button yt-uix-button-size-default yt-uix-button-default" data-tooltip-text="' + chrome.i18n.getMessage("YTPlaylistButtonTooltip") + '"><img style="width:20px;height:20px;" alt="" title="" src="' + newsiclogo + '" /> ' + chrome.i18n.getMessage("YTPlaylistButton") + '</button>');
		}

		// watching video in playlist
		if(typeof button2[0] !== 'undefined') {
			button2[0].insertAdjacentHTML("beforeend", '<a class="yt-uix-button yt-uix-button-size-default yt-uix-button-player-controls yt-uix-button-empty yt-uix-button-has-icon shuffle-playlist yt-uix-button-opacity yt-uix-tooltip yt-uix-tooltip yt-uix-button-toggled" data-tooltip-text="' + chrome.i18n.getMessage("YTPlaylistButton2Tooltip") + '" href="' + buttonurl + '" target="_blank"><span class="yt-uix-button-icon-wrapper"><img style="width:24px;height:24px;" alt="" title="" src="' + newsiclogo + '" /></span></a>');
		}
  	});	
};

document.addEventListener("spfdone", insertButton);
document.addEventListener("DOMContentLoaded", insertButton);