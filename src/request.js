function load_url(url) {
    var xmlhttp = new XMLHttpRequest();
	var response_text = "";
	xmlhttp.open("GET", url, false);
	xmlhttp.onreadystatechange	= function() {
	    console.log(readyState);
	    console.log(xmlhttp.responseText);
		if (this.readyState == 4) {
			response_text = xmlhttp.responseText;
		}
	}
	xmlhttp.send(null);
	return response_text;
}

function ajax(url, callback) {
	xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange	= function() {
		if (this.readyState == 4) {
			callback(xmlhttp.responseText);
		}
	}
	xmlhttp.send(null);
}
