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
import data from "./result_export.json";

class Apartments extends React.Component {
	constructor() {
	    super();	
	    this.state = {
	    	resultAreaDisplayType: ["resultArea","results"],
	    	goLoveList: false,
	    	loveListStatus: createLoveListStatus(data),
	    	loveListDetail: lib.func.getLocalStorageJSON("loveList"),
	    	completeList: data,
	    	currentLocation: [25.0484402,121.5278391],
	    	latLng: [],
	    	toggleSimpleDetail: false,
	    	currentSimpleDetail: {}
	    };

  	}
	componentDidMount() {
		// this.setState({completeList : data, loveList:createLoveListStatus(data)});
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
			// console.log(this.state.completeList)
			// Promise.all([googleMap.load, googleMap.loadMarker]).then(
			// ()=>{
			// 	console.log(this.state.locations);
			// 	googleMap.init.initMap(12,this.state.currentLocation[0],this.state.currentLocation[1],"googleMap", this.state.latLng);
			// })
		// })
		console.log("before getQueryString");
		if ( lib.func.getQueryStringAndSearch("loveList") === true ) {
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
			currentSimpleDetail={this.state.currentSimpleDetail}
			goPropertyPage={this.goPropertyPage.bind(this)}
			completeList={this.state.completeList}
			loveListStatus={this.state.loveListStatus}
			loveListDetail={this.state.loveListDetail}
			putIntoLoveList={this.putIntoLoveList.bind(this)}
			removeFromLoveList={this.removeFromLoveList.bind(this)}
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
	goSimpleDetail(e, index, realEstate) {
		this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));
		this.setState({goLoveList: false})	
		if( index || realEstate) {
			realEstate.index = index;
			this.setState({currentSimpleDetail: realEstate})
		}
	}
	goPropertyPage(e) {
		this.props.history.push("/property");
	}
	putIntoLoveList(e, index, realEstate) {
		console.log(index);
		let currentLoveList = this.state.loveListStatus;
		currentLoveList[index].love = true;
		this.setState({ loveListStatus: currentLoveList});

		let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
		if( JSONforRenew === null ) {
			JSONforRenew = [];
		} 
		realEstate.index = index;
		JSONforRenew.push(realEstate);
		localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
		this.setState({loveListDetail: JSONforRenew});
	}
	removeFromLoveList(e, index, realEstate) {
		console.log(index);
		let currentLoveList = this.state.loveListStatus;
		currentLoveList[index].love = false;
		this.setState({ loveListStatus: currentLoveList});

		let JSONforRenew = lib.func.getLocalStorageJSON("loveList");

		for ( let i = 0 ; i < JSONforRenew.length ; i++ ) {
			if ( JSONforRenew[i].id === realEstate.id ) {
				JSONforRenew.splice(i,1);
			}
		}
		localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
		this.setState({loveListDetail: JSONforRenew})		
	}
}

function createLoveListStatus(ObjectArray) {
	let loveListStatus = [];

	let JSONforRenew = lib.func.getLocalStorageJSON("loveList")!= null ? lib.func.getLocalStorageJSON("loveList") : [];

	// let JSONforRenew = current != null ? JSON.parse(current) : [];
	for ( let j = 0 ; j < ObjectArray.length ; j ++ ) {
		if ( JSONforRenew !== null || JSONforRenew.length > 0) {
			let inList = false;
			for ( let i = 0 ; i< JSONforRenew.length; i++) {
				
				if ( JSONforRenew[i].id === ObjectArray[j].id ) {
					inList = true;
					break;
				} else {
					inList = false;
				}
			}
			loveListStatus.push({love: inList})
		} else {
			loveListStatus.push({love: false});
		}
	}
	return loveListStatus;
}

export default Apartments;

