import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import {firebaseApp} from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from "./Header.js";
import List from "./listPage.js"
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import "./style/LoveList.css";
import "./style/SimpleDetail.css";

// let locations = [
//     {lat: 25.042579729719883 , lng: 121.55364735398231},
//     {lat: 25.029252860369635 , lng: 121.55560906545534},
//     {lat: 25.052912765882606 , lng: 121.54645063582818},
//     {lat: 25.051586771863008 , lng: 121.54747290451549},
//     {lat: 25.05067399631369 , lng: 121.54568336995456},
//     {lat: 25.044876561982644 , lng: 121.5130474960245},
//     {lat: 25.027937732634378 , lng: 121.54780713477564},
//     {lat: 25.027937732634378 , lng: 121.54780713477564},
//     {lat: 25.03106259633463 , lng: 121.5540802611592},
//     {lat: 25.024818016316544 , lng: 121.55411769055303},
//     {lat: 25.003841076128182 , lng: 121.55572581952055},
//     {lat: 25.043351730261502 , lng: 121.55006859988497},
//     {lat: 25.08006947898509 , lng: 121.55908068285575},
//     {lat: 25.050247842284772 , lng: 121.5808111707392},
//     {lat: 25.079206716939805 , lng: 121.5512801776511},
//     {lat: 25.02704269670446 , lng: 121.54329968427548},
//     {lat: 25.023209334719848 , lng: 121.52340424570937},
//     {lat: 25.022946777889135 , lng: 121.52256108127577},
//     {lat: 25.042336562506133 , lng: 121.55190931941526},
//     {lat: 25.02866387796419 , lng: 121.5433041668365},
//     {lat: 25.048142776761107 , lng: 121.54579245095837},
//     {lat: 25.042557600284653 , lng: 121.5446053449906}
//   ]


class Apartments extends React.Component {
	constructor() {
	    super();	
	    this.state = {
	    	resultAreaDisplayType: ["resultArea","results"],
	    	goLoveList: false,
	    	completeList: [],
	    	currentLocation: [25.0484402,121.5278391],
	    	latLng: [],
	    	toggleSimpleDetail: false
	    };

  	}
	componentDidMount() {
	  // 	firebaseApp.fBaseDB.getListing(data => {
	  // 		this.setState({completeList: data});
			// let location =[];
			// for(let i = 0; i < data.length; i++ ) {
			// 	let laAndLong = {lat:"", lng:""};
			// 	laAndLong.lat = parseFloat(data[i].latitude);
			// 	laAndLong.lng = parseFloat(data[i].longitude);
			// 	location.push(laAndLong);
			// }
			// this.setState({latLng: location});
			
			// Promise.all([googleMap.load, googleMap.loadMarker]).then(
			// ()=>{
			// 	console.log(this.state.locations);
			// 	googleMap.init.initMap(12,this.state.currentLocation[0],this.state.currentLocation[1],"googleMap", this.state.latLng);
			// })
		// })
		console.log("before getQueryString");
		if ( lib.func.getQueryString("loveList") === true ) {
			this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
			this.setState({toggleSimpleDetail: false})
			console.log('line 77 getQueryString')		
		}
	}
	render() {
		return(
		<div className="apartments">
			<Header goLoveList={this.state.goLoveList} 
			goLoveListPage={this.goLoveList.bind(this)}
			toggleSimpleDetail={this.state.goSimpleDetail}
			 />
			
			<List goLoveList={this.state.goLoveList}
			goLoveListPage={this.goLoveList.bind(this)}
			resultAreaDisplayType={this.state.resultAreaDisplayType}
			changeAreaSize={this.changeAreaSize.bind(this)} 
			changeToList={this.changeToList.bind(this)}
			changeToRowBlocks={this.changeToRowBlocks.bind(this)}
			changeToBlocks={this.changeToBlocks.bind(this)} 
			toggleSimpleDetail={this.state.toggleSimpleDetail}
			goSimpleDetail={this.goSimpleDetail.bind(this)}
			goPropertyPage={this.goPropertyPage.bind(this)}
			/>
		</div>
		)
	}
	changeAreaSize(e) {
		let left = document.querySelector(".apartments>section>.left");
		let right = document.querySelector(".apartments>section>.right");
		let resizer = document.querySelector(".apartments>section>.right>.areaSizer ");
		if ( e.type === "drag" && e.clientX != 0 && window.innerWidth - e.clientX >= 600) {
				left.style.width = e.clientX;
				right.style.width = window.innerWidth - e.clientX;
				resizer.style.right = window.innerWidth - e.clientX;	
		}
		if ( e.type === "dragend") {
			if (( window.innerWidth - e.clientX ) >= 600 ) {
				left.style.width = e.clientX;
				right.style.width = window.innerWidth - e.clientX;
				resizer.style.right = window.innerWidth - e.clientX;
			} else {
				left.style.width = `calc(100% - 600px)`;
				right.style.width = `600px`;
				resizer.style.right = "600px";
			}
		} 
	}
	changeToList(e) {
		//先移除RowBlocks的class，再把自己的放進去
		lib.func.toggleClass("remove",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsFlex"]);	
		lib.func.toggleClass("toggle",".resultArea>.results", ["resultsList"]);	
		this.setState({resultAreaDisplayType: ["resultArea","results resultsList"]});
	}	
	changeToRowBlocks(e) {
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsList"]);
		lib.func.toggleClass("toggle",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("toggle",".resultArea>.results", ["resultsFlex"]);
		this.setState({resultAreaDisplayType: ["resultArea resultAreaFlex","results resultsFlex"]});	
	}	
	changeToBlocks(e) {
		lib.func.toggleClass("remove",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsFlex", "resultsList"]);	
		this.setState({resultAreaDisplayType: ["resultArea","results"]});
	}
	goLoveList(e) {
		this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
		this.setState({toggleSimpleDetail: false})		
	}
	goSimpleDetail(e) {
		this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));
		this.setState({goLoveList: false})		
	}
	goPropertyPage(e) {
		this.props.history.push("/property");
	}
}

export default Apartments;

