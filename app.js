window.addEventListener("load", getImages);
document.body.addEventListener("click", getImage);

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
	};
	xhr.send();
}

function getImage() {
	if (index >= images.length) {
		console.log("Reached end of images, wrapping around");
		index = 0;
	}
	var img = images[index];
	console.log(img);
	document.body.style.backgroundImage = "url(" + img + ")"
	index++;
}