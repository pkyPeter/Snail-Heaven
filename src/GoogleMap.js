import React from "react";

const script = "https://maps.googleapis.com/maps/api/js?region=TW&language=zh-TW&key=AIzaSyDxFq8QlAbDRIiQvSGD_a2C1Vwru0Q69rE&libraries=places,drawing"
const script2 = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

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
  loadMarker: loadScript(script2),
	init: {},
  markers:[]
};

googleMap.init.initMap = (zoom,lat,lng,targetID,locations, secLocations) => {
  let map = new google.maps.Map(document.getElementById(targetID), {
		zoom: zoom,
		center: {
			lat: lat,
			lng: lng
		},
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
	});
  
  let markers = locations.map(function(location, i) {
    return new google.maps.Marker({
        position: location,
        icon: circle('red'),        
        draggable: false,
        animation: google.maps.Animation.DROP,
    });

  });

  function circle(fillColor) {
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: fillColor,
      fillOpacity: 1,
      scale: 5,
      strokeColor: 'black',
      strokeWeight: .5
    }
  }

    // Add a marker clusterer to manage the markers.
  let markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});  
  let testListener = google.maps.event.addDomListener(map, 'click', function() {
    console.log(map.getBounds());
  });
  let markerChangeColorListener = markers.map(function(marker, i) {
    google.maps.event.addListener(marker, 'click', () => {
      marker.setIcon(circle('rgb(240, 243, 244)'));
    });
  })

}


export default googleMap;