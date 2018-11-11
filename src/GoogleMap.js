import MarkerClusterer from "./markerclusterer.js";
import snail from "./imgs/snail_32.png";
import snail_happy from "./imgs/house_icon.png";
import shell from "./imgs/house_icon_seen.png";
import apiKey from "./credential/googleKey.js";
//marker cluster
import clusterIcon from "./imgs/icon_green.png";
const script =
`https://maps.googleapis.com/maps/api/js?region=TW&language=zh-TW&key=${apiKey.key}&libraries=places,drawing,geometry`;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", function() {
      resolve();
    });
    script.addEventListener("error", function(e) {
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
};
//創造地圖的promise
googleMap.init.initMapPromise = ( zoom, lat, lng, targetID) => { 
  return new Promise((resolve,reject)=>{
    googleMap.map = googleMap.init.initMapNew( zoom, lat, lng, targetID );
    if ( googleMap.map != null ) {
      resolve(googleMap.map);
    } else {
      reject("error");
    }
  });
};

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
  ];

googleMap.init.setPanorama = (targetDOM, position) => {
  googleMap.panorama = new google.maps.StreetViewPanorama(
    document.querySelector(targetDOM), {
      position: position,
      addressControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
      },
      linksControl: false,
      panControl: false,
      enableCloseButton: false
    });
};

// marker options
googleMap.setMapOptions = ( zoom, center) => {
  if ( zoom != "" ) googleMap.map.setZoom(zoom);
  if ( center != "" ) googleMap.map.setCenter(center);
};

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
  }); 
  googleMap.markers = markers;
  return markers;
};

//marker style的參考
googleMap.produceMarkerStyle = ( newStuff , scale) => {
  if (newStuff === true) {
    return {
      url: snail_happy,
      scaledSize: new google.maps.Size(scale ,scale)
    };
  } else {
    return {
      url: shell,
      scaledSize: new google.maps.Size(scale ,scale)
    };
  }

};

//製造群聚效果
googleMap.enableCluster = (map, markers) => {
  let markerclusterer = new MarkerClusterer(map, markers, googleMap.makeClusterOpstions());
  googleMap.markerclusterer = markerclusterer;
  google.maps.event.trigger(googleMap.markerclusterer,"clusterclick", (e)=>{

  });
  return markerclusterer;
};
googleMap.makeClusterOpstions = () => {
  let options = {
    styles: googleMap.clusterStyles,
    gridSize: 100,
    minimumClusterSize: 5
  };
  return options;
};

googleMap.clusterStyles = [{
  url: clusterIcon,
  height: 36,
  width: 36,
  // anchor: [16, 0],
  textColor: "white",
  textSize: 10
}, {
  url: clusterIcon,
  height: 48,
  width: 48,
  // anchor: [24, 0],
  textColor: "white",
  textSize: 10
}, {
  url: clusterIcon,
  height: 56,
  width: 56,
  // height: 66,
  // width: 66,
  textColor: "#FFFFFF",
  textSize: 12
}, {
  url: clusterIcon,
  height: 78,
  width: 78,
  // anchor: [24, 24],
  textColor: "white",
  textSize: 12
}, {
  url: clusterIcon,
  height: 90,
  width: 90,
  // anchor: [24, 24],
  textColor: "white",
  textSize: 12
}];


//取得地點的geocode
googleMap.geocode = ( address, callback ) => {
  let geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, (results, status)=>{
    if (status == "OK") {
      if (callback) {
        callback(results);  
      } 
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};

googleMap.reverseGeocode = (lat,lng, callback) => {
  let geocoder = new google.maps.Geocoder();
  let latLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
  geocoder.geocode({"location": latLng},  (results, status)=>{
    if (status == "OK") {
      if (callback) {
        callback(results);  
      } 
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
};

googleMap.contain = ( bounds,lat,Lng) => {
  let contain = [];
  let currentbounds = bounds;
  let latLng = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
  let inside = currentbounds.contains(latLng);
  if ( inside === true ) {
    return true;
  } else if ( inside === false ) {
    return false;
  } else {
    return null;
  }
};

//google map 繪製客製化區域功能
googleMap.evt.drawCustomArea = ( deletion ) => {
  let mouseMove;
  let mouseUp;
  googleMap.markerclusterer.clearMarkers();
  let mouseDown = google.maps.event.addDomListener( googleMap.map,"mousedown", (e) => {
    googleMap.map.setOptions({draggable: false});
    //the polygon
    let poly = new google.maps.Polyline({ map:googleMap.map, clickable:false, strokeColor: "#00A99D" });
    let bounds = new google.maps.LatLngBounds();
    //move-listener
    mouseMove = google.maps.event.addListener( googleMap.map, "mousemove", (e) => {
      poly.getPath().push(e.latLng);
      bounds.extend(e.latLng);
    });
    //mouseup-listener
    mouseUp = google.maps.event.addDomListenerOnce(window.document,"mouseup", (e) => {
      google.maps.event.removeListener(mouseMove);
      let path = poly.getPath();
      poly.setMap(null);
      poly = new google.maps.Polygon(googleMap.polygonOptions(path));
      googleMap.customArea = poly;
      googleMap.map.setOptions({draggable: true});     
      google.maps.event.removeListener(mouseDown);
      googleMap.map.fitBounds(bounds);
    });
  });
  if ( deletion ) {
    // google.maps.event.removeListener(mouseMove);
    // google.maps.event.removeListener(mouseUp);
    // google.maps.event.removeListener(mouseDown);
    mouseDown.remove();
    google.maps.event.clearListeners(googleMap.map, "mousedown");
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
};

googleMap.polygonOptions = (path) => {
  let options = {
    map: googleMap.map,
    path: path,
    strokeColor: "#00A99D",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#9FDFDA",
    fillOpacity: 0.15
  };
  return options;
};

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
  } else if (sitePosition === "property") {
    googleMap.autocomplete.property = new google.maps.places.Autocomplete(input);
    autocomplete = googleMap.autocomplete.property; 
  }
  if (map && sitePosition !== "property") {
    autocomplete.bindTo("bounds", googleMap.map);  
  }
  autocomplete.setFields(["geometry"]);
  autocomplete.setComponentRestrictions({"country": ["tw"]});
};

googleMap.addAutocompleteListener = (autocomplete, callback) => {
  autocomplete.addListener("place_changed", () => {
    let place = autocomplete.getPlace();
    let map = googleMap.map;
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }
    if ( window.location.pathname === "/apartments" ) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  
      }
    } else {
      callback(place);
    }

  });
};

export default googleMap;