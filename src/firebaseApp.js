import firebase from "firebase";


// Initialize Firebase
var config = {
	apiKey: "AIzaSyDxFq8QlAbDRIiQvSGD_a2C1Vwru0Q69rE",
	authDomain: "snail-heaven-1537271625768.firebaseapp.com",
	databaseURL: "https://snail-heaven-1537271625768.firebaseio.com",
	projectId: "snail-heaven-1537271625768",
	storageBucket: "snail-heaven-1537271625768.appspot.com",
	messagingSenderId: "888195818530"
};

export const firebaseApp = {
  fBase: firebase.initializeApp(config),
  fBaseDB:{}
};

const firebaseDB = firebaseApp.fBase.database();

firebaseApp.fBaseDB.getListing = callback => {
	firebaseDB.ref("listings/").once("value").then(snapshot => {
		if (callback) {
			callback(snapshot.val());
		}
	})
}

firebaseApp.fBaseDB.getListingByID = ( ID ,callback) => {
	firebaseDB.ref("listings").orderByChild("id").equalTo(ID).once("value").then(snapshot => {
		if (callback) {
			callback(snapshot.val());
		}
	})
}

firebaseApp.sortLatLng = ( data ) => {
	let location = [];
	for(let i = 0; i < data.length; i++ ) {
		let laAndLong = {lat:"", lng:""};
		laAndLong.lat = parseFloat(data[i].latitude);
		laAndLong.lng = parseFloat(data[i].longitude);
		location.push(laAndLong);
	}
	return location;
}