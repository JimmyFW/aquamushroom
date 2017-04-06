window.addEventListener("load", startNewTab);
document.body.addEventListener("click", advanceImage);

images = [];
hurl_urls = 'https://secret-basin-29320.herokuapp.com/todo/api/v3.0/allurls';
hurl_url = 'https://secret-basin-29320.herokuapp.com/todo/api/v3.0/currurl';

// try to grab currimg out of localstorage and set it as background image
// if we can't find it, get url from /v3.0/currurl,
// store image data in localStorage,
// and set stored data as background image
function startNewTab() {
	var storedImage = localStorage.getItem("currimg");
	if (storedImage == null) {
		console.log("Get image from heroku");
		getImageFromHeroku();
	} else {
		console.log("Get image from local storage");
		setBackgroundToLocalCurrImg();
	}
}

// if we don't have images, get images from tumblr
// then, pick a random image, and set that image on heroku
// then, load the data url into localstorage
// and get the image from localstorage to the background
function advanceImage() {
	if (images.length === 0) {
		console.log("Fetching from tumblr");
		getImageFromTumblrWithCallback(updateCurrImage);
	} else {
		console.log("Updating with current images");
		updateCurrImage();
	}
}

// in localStorage, updates currUrl and currImage
// in Heroku, updates currUrl
function updateCurrImage() {
	var randomIndex = Math.floor(Math.random() * images.length);
	var new_url = images[randomIndex];
	localStorage.setItem("currurl", new_url);
	updateDataUrlWithCallback(new_url, setBackgroundToLocalCurrImg);
	updateCurrImageOnHeroku(new_url);
}

function updateCurrImageOnHeroku(new_url) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", hurl_url);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({'currurl': new_url}));
}

function getImageFromTumblrWithCallback(callback) {
	console.log("Let's get the images from tumblr");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		globalResponse = this.response;
		for (let post of globalResponse.response.posts) {
			if (post.photos) {
				var url = post.photos[0].original_size.url;
				images.push(url);
			}
		}
		if (callback) {
			callback.call();
		}
	};
	xhr.send();
}

function getImageFromHeroku() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", hurl_url, true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		var new_url = this.response.curr_url[0];
		localStorage.setItem("currurl", new_url);
		updateDataUrlWithCallback(new_url, setBackgroundToLocalCurrImg);
	};
	xhr.send();
}


function setBackgroundToLocalCurrImg() {
	document.body.style.backgroundImage = "url(" + localStorage.getItem("currimg") + ")";
}

function updateDataUrl(url) {
	updateDataUrlWithCallback(url, null);
}

function updateDataUrlWithCallback(url, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function() {
	    var canvas = document.createElement("canvas");
	    var canvasContext = canvas.getContext("2d");
    	canvas.width = this.width;
    	canvas.height = this.height;
    	canvasContext.drawImage(img, 0, 0);
    	var dataURL = canvas.toDataURL('image/png');
    	localStorage.setItem('currimg', dataURL);
    	if (callback) {
    		console.log("updateDataUrl called with callback " + callback);
    		callback.call();
    	}
    }
    
    img.src = url;
}