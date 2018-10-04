




googleMap.init.initMap = (zoom,lat,lng,targetID,locations, secLocations) => {
  //這個時候map就等於google.maps.Map，而且他還夾帶了很多Methods
 //  let map = new google.maps.Map(document.getElementById(targetID), {
	// 	zoom: zoom,
	// 	center: {
	// 		lat: lat,
	// 		lng: lng
	// 	},
 //    mapTypeControl: false,
 //    streetViewControl: false,
 //    fullscreenControl: false
	// });
  // googleMap.map = map;
  // console.log(google.maps);

  googleMap.mapPromise = new Promise(function(resolve, reject) {
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
      if( map != "") {
        resolve(map);
      } else {
        reject("map load failed");
      }
  })
  // let markers = locations.map(function(location, i) {
  //   return new google.maps.Marker({
  //       position: location,
  //       icon: circle('red'),        
  //       draggable: false,
  //       animation: google.maps.Animation.DROP,
  //   });
  // });
   googleMap.markersPromise = new Promise(function(resolve,reject) {
      console.log("markersPromise");
      let markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,
            icon: circle('red'),        
            draggable: false,
            animation: google.maps.Animation.DROP,
        });
      });
      if ( markers != []) {
        resolve(markers);
      } else {
        reject([nothing]);
      }
  })

  googleMap.clusterPromise = googleMap.markersPromise.then((markers)=>{console.log(markers);googleMap.markers = markers;}).then(()=>{
    return new MarkerClusterer(map, googleMap.markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  });

  // googleMap.markers = markers;
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
  // let markerCluster = new MarkerClusterer(map, googleMap.markers, {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});  

  let clickListener = google.maps.event.addDomListener(map, 'click', function() {
    console.log(map.getBounds());
  });

  // let results = document.querySelectorAll(".resultArea>.results");
  // for ( let i = 0 ; i < results.length ; i ++ ) {
  //     console.log(i);
  //     google.maps.event.addDomListener(results[i], 'click', (e) => {
  //     console.log(e.target);
  //     console.log(map.getBounds());
  //   });
  // }
  // let roomAmount = document.querySelectorAll(".roomAmount");
  // for ( let i = 0 ; i < roomAmount.length ; i ++ ) {
  //     console.log(i);
  //     google.maps.event.addDomListener(roomAmount[i], 'click', (e) => {
  //     console.log(e.target);
  //     console.log(map.getBounds());
  //   });
  // }

  // let clickResultListener = google.maps.event.addDomListener(map, 'click', function() {
  //   console.log(map.getBounds());
  // });


  // let dragListener = google.maps.event.addDomListener(map, 'dragend', function() {
  //   console.log(map.getBounds());
  // });

  // let markerChangeColorListener = markers.map(function(marker, i) {
  //   google.maps.event.addListener(marker, 'click', () => {
  //     marker.setIcon(circle('rgb(240, 243, 244)'));
  //   });
  // })
  // let dbClickListener = markers.map(function(marker, i) {
  //   google.maps.event.addListener(marker, 'dblclick', () => {
  //     marker.setMap(null);
  //   });
  // })

}