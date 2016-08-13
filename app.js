/*
On tab load, grab image urls, put em in global,
get the current index, and display the desired image
*/
window.addEventListener("load", getImages);

/*
On click, update the index, and display the desired image
*/
document.body.addEventListener("click", setIndex);

globalResponse = "";
images = [];
index = 0;


function getImages() {
	console.log("Let's get the images");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		console.log(this.response);
		globalResponse = this.response;
		for (let post of globalResponse.response.posts) {
			if (post.photos) {
				console.log(post.photos.length);
				var url = post.photos[0].original_size.url;
				console.log(url);
				images.push(url)
			}
		}
		getIndex();
	};
	xhr.send();
}

function getIndex() {
	console.log('Getting index');
	var xhr = new XMLHttpRequest();
	xhr.open("GET", hurl);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		console.log(this.response);
		indexResponse = this.response;
		currIndex = indexResponse.currid;
		console.log(currIndex);
		getImage();
	}
	xhr.send();
}

function getImage() {
	if (currIndex >= images.length) {
		console.log("Reached end of images, wrapping around");
		currIndex = 0;
	}
	var img = images[currIndex];
	console.log(img);
	document.body.style.backgroundImage = "url(" + img + ")"
	currIndex++;
}

function setIndex() {
	console.log('Setting index');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", hurl);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({'newid': currIndex++}));	
	getIndex();
}