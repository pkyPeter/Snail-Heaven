import React from "react";
// import MarkerClusterer from "@google/markerclusterer";
import MarkerClusterer from "./markerclusterer.js";
import snail_new from "./imgs/snail_new.png";
import snail_seen from "./imgs/snail_seen.png";
import snail_new_24 from "./imgs/snail_new_24.png";
import snail_seen_24 from "./imgs/snail.png";
import snail_seen_32 from "./imgs/snail_seen_32.png";
import snail from "./imgs/snail_32.png";
import snail_happy from "./imgs/snail_happy_64.png";

console.log(MarkerClusterer);
// import "./markerclusterer.js";
const script = "https://maps.googleapis.com/maps/api/js?region=TW&language=zh-TW&key=AIzaSyDxFq8QlAbDRIiQvSGD_a2C1Vwru0Q69rE&libraries=places,drawing,geometry"
// const script2 = "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";

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
  // loadMarkerCluster: loadScript(script2),
  map: null,
	init: {},
  markers:[],
  evt: {},
  customArea: null
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
googleMap.makeMarkers = (locations, visible) => {
 let markers = locations.map((location, i)=>{
  return new google.maps.Marker({
            // map: googleMap.map,
            position: location,
            icon: googleMap.produceMarkerStyle("red",38),        
            draggable: false,
            animation: google.maps.Animation.DROP,
            visible: visible
  });
 }) 
 googleMap.markers = markers;
 return markers;
}
//marker style的參考
googleMap.produceMarkerStyle = (fillColor, scale) => {
  return {
      url: snail_happy,
      scaledSize: new google.maps.Size(scale ,scale)
    }
}
// googleMap.produceMarkerStyle = (fillColor, scale) => {
//   return {
      // path: google.maps.SymbolPath.CIRCLE,
      // fillColor: fillColor,
      // fillOpacity: 1,
      // scale: scale,
      // strokeColor: 'black',
      // strokeWeight: .5
//     }
// }
//製造群聚效果
googleMap.enableCluster = (map, markers) => {
   let markerclusterer = new MarkerClusterer(map, markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
   googleMap.markerclusterer = markerclusterer;
   return markerclusterer;
}
googleMap.makeClusterOpstions = () => {
  let options = {
    styles: [{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}],
    gridSize: 100
  }
  return options;
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

//google map 繪製客製化區域功能
googleMap.evt.drawCustomArea = () => {
     let mouseDown = google.maps.event.addDomListener(googleMap.map.getDiv(),'mousedown', (e) => {
            googleMap.map.setOptions({draggable: false})
             //the polygon
            let poly = new google.maps.Polyline({ map:googleMap.map, clickable:false, strokeColor: "#00A99D" });
            //move-listener
            let move = google.maps.event.addListener( googleMap.map, 'mousemove', (e) => {
                  console.log("move")
                  poly.getPath().push(e.latLng);
            });
            //mouseup-listener
            google.maps.event.addDomListenerOnce(window.document,'mouseup', (e) => {
                  console.log("mouseup")
                  google.maps.event.removeListener(move);
                  let path = poly.getPath();
                  poly.setMap(null);
                  poly = new google.maps.Polygon(googleMap.polygonOptions(path));
                  console.log(poly.getPaths());
                  googleMap.customArea = poly;
                  googleMap.map.setOptions({draggable: true})     
                  google.maps.event.removeListener(mouseDown);
                  return true;
            });
    });
}

// googleMap.filterLocation = (mode, filterList, latLngList, currentLocation) => {
//   let completeList = filterList;
//   let latLngList = latLngList;
//   let currentLocation = currentLocation;
//   let LocationsWithinArea = [];
//   if (mode === "normal") {
//     for ( let i = 0; i < latLngList.length ; i++ ) {
//       let latLng = new google.maps.LatLng(parseFloat(latLngList[i].lat),parseFloat(latLngList[i].lng));
//       let inside = currentLocation.contains(latLng);
//       if ( inside ) 
//     }
//   } else if (mode ==="polygon") {

//   }
// }

googleMap.polygonOptions = (path) => {
  let options = {
    map: googleMap.map,
    path: path,
    strokeColor: "#00A99D",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#9FDFDA',
    fillOpacity: 0.15
  }
  return options;
}


export default googleMap;