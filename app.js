/*
On tab load, grab image urls, put em in global,
get the current index, and display the desired image
*/
window.addEventListener("load", getImages);

/*
On click, update the index, and display the desired image
*/
document.body.addEventListener("click", setIndex);

images = [];
hurl = 'https://secret-basin-29320.herokuapp.com/todo/api/v1.0/currid';
hurl2 = 'https://secret-basin-29320.herokuapp.com/todo/api/v2.0/currid/images';


function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getImages() {
	console.log("Let's get the images");
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = function(e) {
		console.log(this.response);
		globalResponse = this.response;
		console.log(globalResponse)
		nubphotos = globalResponse.response.posts.length;
		console.log(nubphotos)
		for (let post of globalResponse.response.posts) {
			if (post.photos) {
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
	console.log(nubphotos);
	fullHurl2 = hurl2 + "/" + String(nubphotos);
	console.log(fullHurl2);
	xhr.open("GET", fullHurl2);
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
	var img = images[currIndex];
	console.log(img);
	document.body.style.backgroundImage = "url(" + img + ")"
}

function setIndex() {
	var randomImage = Math.floor(Math.random() * nubphotos )
	console.log('Setting index');
	var xhr = new XMLHttpRequest();
	xhr.open("POST", hurl);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.send(JSON.stringify({'newid': randomImage}));	
	getIndex();
}