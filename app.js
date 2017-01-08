/*
On tab load, grab image urls, put em in global,
get the current index, and display the desired image
*/
window.addEventListener("load", getImages);

/*
On click, update the index, and display the desired image
*/
document.body.addEventListener("click", setUrl);


images = [];
hurl = 'https://secret-basin-29320.herokuapp.com/todo/api/v1.0/currid';
hurl2 = 'https://secret-basin-29320.herokuapp.com/todo/api/v2.0/currid/images';
hurl_urls = 'https://secret-basin-29320.herokuapp.com/todo/api/v3.0/allurls';
hurl_url = 'https://secret-basin-29320.herokuapp.com/todo/api/v3.0/currurl'

function getImages() {
	console.log("Let's get the images");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		console.log(this.response);
		globalResponse = this.response;
		console.log(globalResponse);
		nubphotos = globalResponse.response.posts.length;
		console.log(nubphotos);
		for (let post of globalResponse.response.posts) {
			if (post.photos) {
				var url = post.photos[0].original_size.url;
				console.log(url);
				images.push(url);
			}
		}
		getUrl();
	};
	xhr.send();
}

function getImage() {
	chrome.storage.local.get(['currurl', 'currimg'], function(items) {
		console.log("items", items);
		console.log("curr img", curr_img);
		console.log("items url", items['currurl']);
		if (curr_img == items['currurl']){
			document.body.style.backgroundImage = "url(" + items["currimg"] + ")";
		}
    });
}

function getUrl() {
	console.log('Getting url');
	var xhr = new XMLHttpRequest();
	xhr.open("GET", hurl_url);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		console.log(this.response);
		indexResponse = this.response;
		curr_img = indexResponse.curr_url;
		console.log(curr_img);
		getImage();
	}
	xhr.send();
}

function setUrl() {
	var curr_randomImage = Math.floor(Math.random() * nubphotos );
	var next_randomImage = Math.floor(Math.random() * nubphotos );
	while (curr_randomImage == next_randomImage){
		next_randomImage = Math.floor(Math.random() * nubphotos );
	}
	curr_img = images[curr_randomImage];
	var next_img = images[next_randomImage];
	console.log('Setting url');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", hurl_url);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({'currurl': curr_img, 'nexturl': next_img}));	
	getBase64Image(curr_img);
	chrome.storage.local.set({'currurl': curr_img}, function() {
      console.log('curr saved');
	});
	getImage();
}

function getBase64Image(url) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function() {
	    var canvas = document.createElement("canvas");
	    var canvasContext = canvas.getContext("2d");
    	canvas.width = this.width;
    	canvas.height = this.height;
    	canvasContext.drawImage(img, 0, 0);
    	var dataURL = canvas.toDataURL('image/png');
		chrome.storage.local.set({'currimg': dataURL}, function() {
	          console.log('curr saved');
	    });
    }
    
    img.src = url;
    console.log(img);
}