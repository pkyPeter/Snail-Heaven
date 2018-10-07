import React from "react";

const script = "https://maps.googleapis.com/maps/api/js?region=TW&language=zh-TW&key=AIzaSyDxFq8QlAbDRIiQvSGD_a2C1Vwru0Q69rE&libraries=places,drawing,geometry"
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
  loadMarkerCluster: loadScript(script2),
  map: null,
	init: {},
  markers:[],
  evt: {}
};

//創造新地圖
googleMap.init.initMapNew = ( zoom, lat, lng, targetID ) => {
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
    googleMap.map = map;
    return map;
}
//創造地圖的promise
googleMap.init.initMapPromise = ( zoom, lat, lng, targetID) => { 
  return new Promise((resolve,reject)=>{
    let map = googleMap.init.initMapNew( zoom, lat, lng, targetID );
    if ( map.zoom != undefined ) {
      resolve(map);
    } else {
      reject("error");
    }
  })
}
//放置marker在地圖上面
googleMap.makeMarkers = (locations) => {
 let markers = locations.map((location, i)=>{
  return new google.maps.Marker({
            position: location,
            icon: googleMap.produceMarkerStyle("red",5),        
            draggable: false,
            animation: google.maps.Animation.DROP,
  });
 }) 
 googleMap.markers = markers;
 return markers;
}
//製造群聚效果
googleMap.enableCluster = (map, markers) => {
   return new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

//marker style的參考
googleMap.produceMarkerStyle = (fillColor, scale) => {
  return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: fillColor,
      fillOpacity: 1,
      scale: scale,
      strokeColor: 'black',
      strokeWeight: .5
    }
}
//取得地點的geocode
googleMap.geocode = ( address, callback ) => {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, (results, status)=>{
    if (status == 'OK') {
      if (callback) {
        callback(results);  
      } 
    } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
  })
}

googleMap.contain = ( bounds,lat,Lng) => {
  let contain = [];
  let currentbounds = bounds;
  let latLng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
  let inside = currentbounds.contains(latLng);
  if ( inside === true ) {
    return true
  } else if ( inside === false ) {
    return false
  } else {
    return null
  }
}


export default googleMap;