import React from "react";
// import MarkerClusterer from "@google/markerclusterer";
import MarkerClusterer from "./markerclusterer.js";
import snail from "./imgs/snail_32.png";
// import snail_happy from "./imgs/snail_happy_64.png";
// import snail_happy from "./imgs/snail_cousin.png";
// import snail_happy from "./imgs/placeholder_light.png";
import snail_happy from "./imgs/house_icon.png";
// import shell from "./imgs/shell.png";
// import shell from "./imgs/snail_cousin_shell.png";
// import shell from "./imgs/placeholder_seen.png";
import shell from "./imgs/house_icon_seen.png";

//marker cluster
import m3 from "./imgs/icon_green.png";

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
  customArea: null,
  autocomplete: {}
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
    fullscreenControl: false,
    styles: googleMap.style
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

// map style 
googleMap.style = 
  [
    {
        "featureType": "administrative.province",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#010101"
            },
            {
                "visibility": "on"
            },
            {
                "weight": "1.63"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f7f1df"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#d0e3b4"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbd3da"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#bde6ab"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffe15f"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#efd151"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "black"
            }
        ]
    },
    {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#cfb2db"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a2daf2"
            }
        ]
    }
  ]


//放置marker在地圖上面
googleMap.makeMarkers = (locations, visible) => {
 let markers = locations.map((location, i)=>{
  return new google.maps.Marker({
            // map: googleMap.map,
            position: location,
            icon: googleMap.produceMarkerStyle(true , 35),        
            draggable: false,
            animation: google.maps.Animation.DROP,
            visible: visible
  });
 }) 
 googleMap.markers = markers;
 return markers;
}
// //marker style的參考
// googleMap.produceMarkerStyle = ( newStuff , scale) => {
//   return {
//       path: google.maps.SymbolPath.CIRCLE,
//       fillColor: "red",
//       fillOpacity: 1,
//       scale: 5,
//       strokeColor: 'black',
//       strokeWeight: .5
//     }

// }
//marker style的參考
googleMap.produceMarkerStyle = ( newStuff , scale) => {
  // console.log(newStuff)
  if (newStuff === true) {
      return {
      url: snail_happy,
      scaledSize: new google.maps.Size(scale ,scale)
    }
  } else {
    return {
      url: shell,
      scaledSize: new google.maps.Size(scale ,scale)
    }
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
   let markerclusterer = new MarkerClusterer(map, markers, googleMap.makeClusterOpstions());
   googleMap.markerclusterer = markerclusterer;
   // console.log(googleMap.markerclusterer)
   google.maps.event.trigger(googleMap.markerclusterer,"clusterclick", (e)=>{
    // console.log(e.target);

   })
   return markerclusterer;
}
googleMap.makeClusterOpstions = () => {
  let options = {
    styles: googleMap.clusterStyles,
    gridSize: 100,
    minimumClusterSize: 5
  }
  return options;
}

// googleMap.clusterStyles = [{
//         url: m1,
//         height: 53,
//         width: 53,
//         // anchor: [16, 0],
//         textColor: 'black',
//         textSize: 10
//       }, {
//         url: m2,
//         height: 56,
//         width: 56,
//         // anchor: [24, 0],
//         textColor: 'black',
//         textSize: 11
//       }, {
//         url: m3,
//         height: 65,
//         width: 48,
//         // height: 66,
//         // width: 66,
//         anchor: [17, 0],
//         textColor: '#FFFFFF',
//         textSize: 12,
//         backgroundPosition: "40% 40%"
//       }, {
//         url: m4,
//         height: 78,
//         width: 78,
//         // anchor: [24, 24],
//         textColor: 'black',
//         textSize: 12
//       }, {
//         url: m5,
//         height: 90,
//         width: 90,
//         // anchor: [24, 24],
//         textColor: 'black',
//         textSize: 12
//       }];
googleMap.clusterStyles = [{
        url: m3,
        height: 36,
        width: 36,
        // anchor: [16, 0],
        textColor: 'white',
        textSize: 10
      }, {
        url: m3,
        height: 48,
        width: 48,
        // anchor: [24, 0],
        textColor: 'white',
        textSize: 10
      }, {
        url: m3,
        height: 56,
        width: 56,
        // height: 66,
        // width: 66,
        textColor: '#FFFFFF',
        textSize: 12
      }, {
        url: m3,
        height: 78,
        width: 78,
        // anchor: [24, 24],
        textColor: 'white',
        textSize: 12
      }, {
        url: m3,
        height: 90,
        width: 90,
        // anchor: [24, 24],
        textColor: 'white',
        textSize: 12
      }];


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

googleMap.reverseGeocode = (lat,lng, callback) => {
  let geocoder = new google.maps.Geocoder();
  let latLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
  geocoder.geocode({"location": latLng},  (results, status)=>{
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
googleMap.evt.drawCustomArea = ( deletion ) => {
     let mouseMove;
     let mouseUp;
     googleMap.markerclusterer.clearMarkers();
     let mouseDown = google.maps.event.addDomListener( googleMap.map,'mousedown', (e) => {
            googleMap.map.setOptions({draggable: false})
             //the polygon
            let poly = new google.maps.Polyline({ map:googleMap.map, clickable:false, strokeColor: "#00A99D" });
            let bounds = new google.maps.LatLngBounds();
            //move-listener
            mouseMove = google.maps.event.addListener( googleMap.map, 'mousemove', (e) => {
                  console.log("move")
                  poly.getPath().push(e.latLng);
                  bounds.extend(e.latLng);
            });
            //mouseup-listener
            mouseUp = google.maps.event.addDomListenerOnce(window.document,'mouseup', (e) => {
                  console.log("mouseup")
                  google.maps.event.removeListener(mouseMove);
                  let path = poly.getPath();
                  poly.setMap(null);
                  poly = new google.maps.Polygon(googleMap.polygonOptions(path));
                  console.log(poly.getPaths());
                  googleMap.customArea = poly;
                  googleMap.map.setOptions({draggable: true})     
                  google.maps.event.removeListener(mouseDown);
                  googleMap.map.fitBounds(bounds);
            });
    });
    if ( deletion ) {
                  // google.maps.event.removeListener(mouseMove);
                  // google.maps.event.removeListener(mouseUp);
                  // google.maps.event.removeListener(mouseDown);
                  mouseDown.remove();
                  google.maps.event.clearListeners(googleMap.map, 'mousedown');
                  // google.maps.event.clearListeners(googleMap.map, 'mousemove');
                  if (googleMap.customArea) {
                    googleMap.customArea.setMap(null);
                    googleMap.customArea = null;
                    // googleMap.map.panTo({lat:25.0484402,lng:121.5278391});
                    // googleMap.map.setZoom(12); 
                  }
                  googleMap.map.setZoom(googleMap.map.getZoom());
    }
    return mouseDown;
}

// googleMap.filterLocation = (mode, filterList, latLngList, currentLocation) => {
//   let completeList = filterList;
//   let latLngList = latLngList;
//   let currentLocation = currentLocation;
//   let LocationsWithinArea = [];
//   if (mode === "normal") {
//     for ( let i = 0; i < latLngList.length ; i++ ) {
//       let latLng = new google.maps.LatLng(parseFloat(latLngList[i].lat),parseFloat(latLngList[i].lng));
//       let inside = currentLocation.tains(latLng);
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

//autoComplete
googleMap.initAutocomplete = (DomElement, sitePosition) => {
  let input = DomElement;
  let autocomplete;
  let map = googleMap.map;
  if (sitePosition === "index") {
    googleMap.autocomplete.index = new google.maps.places.Autocomplete(input);
    autocomplete = googleMap.autocomplete.index;
  } else if (sitePosition === "apartments") {
    googleMap.autocomplete.apartments = new google.maps.places.Autocomplete(input);
    autocomplete = googleMap.autocomplete.apartments;
  }
  if (map) {
    autocomplete.bindTo('bounds', googleMap.map);  
  }
  autocomplete.setFields(['geometry']);
  autocomplete.setComponentRestrictions({'country': ['tw']});
}

googleMap.addAutocompleteListener = (autocomplete, callback) => {
  autocomplete.addListener('place_changed', () => {
  let place = autocomplete.getPlace();
  let map = googleMap.map;
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    if (googleMap.map) {
      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
    } else {
      callback(place);
    }

  })
}

export default googleMap;