import React from "react";

const script = "https://maps.googleapis.com/maps/api/js?region=TW&language=zh-TW&key=AIzaSyDxFq8QlAbDRIiQvSGD_a2C1Vwru0Q69rE&libraries=places"

function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function() {
      resolve();
    });
    script.addEventListener('error', function(e) {
      reject(e);
    });
    document.body.appendChild(script);
  });
}

const googleMap = {
	load: loadScript(script),
	init: {}
};

googleMap.init.initMap = (zoom,lat,lng,targetID) => {
	new google.maps.Map(document.getElementById(targetID), {
		zoom: 12,
		center: {
			lat: lat,
			lng: lng
		}
	});
}

export default googleMap;