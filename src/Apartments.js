import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import { firebaseApp } from "./firebaseApp.js";
import Header from "./Header.js";
import List from "./listPage.js";
import Email from "./Email.js";
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
	    	goLoveList: false,
	    	loveListStatus: null,
	    	loveListDetail: lib.func.getLocalStorageJSON("loveList") !== null ?  lib.func.getLocalStorageJSON("loveList") : [],
	    	completeList: data,//10/6：原本應該是[]，暫時改成data測試
	    	currentLocation: [25.0484402,121.5278391],
	    	currentDistrict: null,
	    	latLng: [],
	    	toggleEmail: false,
	    	selectedIndex: -1
	    };

	  	firebaseApp.fBaseDB.getListing(dataFromFB => {
	  		console.log(dataFromFB);
	  		for ( let i = 0 ; i<dataFromFB.length ; i++ ) {dataFromFB[i].index = i;}
	  		this.setState({completeList: dataFromFB});
	  		this.setState({loveListStatus: this.createLoveListStatus(dataFromFB)});
	  		console.log(this.state.completeList);
			//製作給marker使用的state
			let location = firebaseApp.sortLatLng(dataFromFB);
			this.setState({latLng: location});
			//等google map相關程序完成，再進行後續動作
			Promise.all([googleMap.load, googleMap.loadMarkerCluster])
			.then(()=>{
					let queryLocation = [ false , false ]
					if ( lib.func.getQueryStringAndSearch("location") ) {
						let latLng= window.location.search.split("&")[0].split("=")[1].split(",");
						queryLocation[0] = parseFloat(latLng[0]);
						queryLocation[1] = parseFloat(latLng[1]);
					}
					let lat = queryLocation[0] || this.state.currentLocation[0];
					let lng = queryLocation[1] || this.state.currentLocation[1];
					let zoom = 	queryLocation[0] ? 15 : 12;
					console.log(zoom, lat, lng);
					//製作地圖的promise，以及接連進行的一系列動作
					googleMap.init.initMapPromise( zoom, lat, lng ,"googleMap" )
					.then((map)=>{
						let markers = googleMap.makeMarkers(this.state.latLng);
						let markersAndMap = [map,markers];
						return markersAndMap;
					})
					.then((markersAndMap)=>{
						googleMap.enableCluster(markersAndMap[0],markersAndMap[1]);
						return markersAndMap[1];
					})
					.then((markers)=>{
						//點擊marker，就改變state，這個state會連動影響，把state改成index是因completeList相對應的資料就是在同一個位置
						markers.map(( marker, i ) => {
							google.maps.event.addListener(marker, "click", ()=>{
								marker.setIcon(googleMap.produceMarkerStyle('red', 10));
								this.setState({selectedIndex: i})
							})
						})
						//如果點擊地圖的其他地方，則將原本focus的點釋放
						google.maps.event.addListener( googleMap.map,"click", ()=>{
							console.log("click");
							let Index = this.state.selectedIndex;
							if ( Index != -1 ) {
								googleMap.markers[Index].setIcon(googleMap.produceMarkerStyle('rgb(240, 243, 244)', 5))
								this.setState({selectedIndex: -1})
							}
						})

						//隨時偵測地圖的動態
						google.maps.event.addListener( googleMap.map, "bounds_changed", ()=>{
							console.log("bounds_changed");
							let descriptions = lib.func.getAll(".apartments>section>.right>.resultArea>.results");
							let currentLocation = googleMap.map.getBounds();
							for ( let i = 0 ; i< this.state.latLng.length ; i++ ) {
								let latLng = new google.maps.LatLng(parseFloat(this.state.latLng[i].lat),parseFloat(this.state.latLng[i].lng))
								let inside = currentLocation.contains(latLng);
								if ( inside ) {
									googleMap.markers[i].setVisible(true);
									descriptions[i].classList.remove("hidden");
								} else {
									googleMap.markers[i].setVisible(false);
									descriptions[i].classList.add("hidden");
								}
							}
						})

					})
			})
		})

	}
	componentDidMount() {
		// console.log(this.props.location.state.district)
		console.log("componentDidMount");
		if ( lib.func.getQueryStringAndSearch("loveList") === true ) {
			this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
			this.setState({toggleSimpleDetail: false})
		}
		if ( lib.func.getQueryStringAndSearch("dis") ) {
			let dis = decodeURIComponent(window.location.search.split("=")[1]);
			// let viewBox = [view.split(",")[0].split("=")[1],...[view.split(",")[1],view.split(",")[2],view.split(",")[3]]];
			this.setState({currentDistrict: dis})
		}
	}
	componentDidUpdate() {
		console.log("componentDidUpdate");
		console.log(this.state.selectedIndex);
		if (lib.func.getAll(".apartments>section>.right>.resultArea>.results")) {
			let results = lib.func.getAll(".apartments>section>.right>.resultArea>.results");
			for ( let i = 0 ; i < results.length ; i ++) {
				google.maps.event.addDomListener( results[i], "mouseenter", (e)=>{
					e.stopPropagation();
					console.log("mouseenter");
					googleMap.markers[i].setAnimation(google.maps.Animation.BOUNCE);
					googleMap.markers[i].setIcon(googleMap.produceMarkerStyle('red', 10));
					setTimeout(()=>{
						googleMap.markers[i].setAnimation(null)
						googleMap.markers[i].setIcon(googleMap.produceMarkerStyle('red', 5));
					},3000)
				})
			}
		}

		google.maps.event.addDomListener( lib.func.get("body"), "mouseenter", ()=>{
			if (lib.func.getAll(".apartments>section>.right>.resultArea>.hidden").length === 0) {
				console.log("mouseenter");
				let descriptions = lib.func.getAll(".apartments>section>.right>.resultArea>.results");
				let currentLocation = googleMap.map.getBounds();
				for ( let i = 0 ; i< this.state.latLng.length ; i++ ) {
					let latLng = new google.maps.LatLng(parseFloat(this.state.latLng[i].lat),parseFloat(this.state.latLng[i].lng))
					let inside = currentLocation.contains(latLng);
					if ( inside ) {
						googleMap.markers[i].setVisible(true);
						descriptions[i].classList.remove("hidden");
					} else {
						googleMap.markers[i].setVisible(false);
						descriptions[i].classList.add("hidden");
					}
				}
			}
		})
	}
	render() {			
		return(
		<div className="apartments">
			<Header goLoveList={this.state.goLoveList} 
			goLoveListPage={this.goLoveList.bind(this)}
			 />
			<Email toggleEmail={this.state.toggleEmail}
			openEmailForm={this.openEmailForm.bind(this)}
			/>
			<List goLoveList={this.state.goLoveList}
			goLoveListPage={this.goLoveList.bind(this)}
			completeList={this.state.completeList}
			loveListStatus={this.state.loveListStatus}
			loveListDetail={this.state.loveListDetail}
			openEmailForm={this.openEmailForm.bind(this)}
			selectedIndex={this.state.selectedIndex}
			goPropertyPage={this.goPropertyPage.bind(this)}
			addSelectedIndex={this.addSelectedIndex.bind(this)}
			removeSelectedIndex={this.removeSelectedIndex.bind(this)}
			putIntoLoveList={this.putIntoLoveList.bind(this)}
			removeFromLoveList={this.removeFromLoveList.bind(this)}
			getloveListStatusIndex={this.getloveListStatusIndex.bind(this)}
			/>
		</div>
		)
	}
	addSelectedIndex(currentMarkerIndex) {
		console.log(currentMarkerIndex);
		this.setState({selectedIndex: currentMarkerIndex})
		googleMap.markers[currentMarkerIndex].setIcon(googleMap.produceMarkerStyle('red', 10))
	}
	removeSelectedIndex(currentMarkerIndex){
		this.setState({selectedIndex: -1});
		googleMap.markers[currentMarkerIndex].setIcon(googleMap.produceMarkerStyle('rgb(240, 243, 244)', 5));
	}

	goIndex(e) {

	}

	goLoveList(e) {
		this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
		// this.setState({toggleSimpleDetail: false})		
	}
	goPropertyPage(e, id) {
		this.props.history.push(`/property?id=${id}`);
	}
	openEmailForm(e) {
		console.log('open form');
		this.setState((currentState,currentProps)=>({
			toggleEmail: !currentState.toggleEmail
		}))
	}
	createLoveListStatus(ObjectArray) {
		let loveListStatus = [];
		let JSONforRenew = lib.func.getLocalStorageJSON("loveList")!= null ? lib.func.getLocalStorageJSON("loveList") : [];
		for ( let j = 0 ; j < ObjectArray.length ; j ++ ) {
			if ( JSONforRenew !== null || JSONforRenew.length > 0) {
				let item = {id: ObjectArray[j].id, inList:false};
				for ( let i = 0 ; i< JSONforRenew.length; i++) {
					if ( JSONforRenew[i].id === ObjectArray[j].id ) {
						item.inList = true;
						break;
					} else {
						item.inList = false;
					}
				}
				loveListStatus.push(item)
			} else {
				let item = {id: ObjectArray[j].id, inList:false};
				loveListStatus.push(item);
			}
		}
		return loveListStatus;
	}
	createLatLng( lat,lng ) {
	    let newOne = new google.maps.LatLng(lat,lng);
	    return newOne;
 	}
 	putIntoLoveList(e, id, realEstate) {
		// console.log(id);
		let currentLoveList = this.state.loveListStatus;
		for (let i = 0 ; i < currentLoveList.length ; i++ ) {
			if (currentLoveList[i].id === id) {
				currentLoveList[i].inList = true;
			}
		}
		this.setState({ loveListStatus: currentLoveList});

		let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
		if( JSONforRenew === null ) {
			JSONforRenew = [];
		} 
		JSONforRenew.push(realEstate);
		localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
		this.setState({loveListDetail: JSONforRenew});
	}
	removeFromLoveList(e, id, realEstate) {
		// console.log(id);
		let currentLoveList = this.state.loveListStatus;
		for (let i = 0 ; i < currentLoveList.length ; i++ ) {
			if (currentLoveList[i].id === id) {
				currentLoveList[i].inList = false;
			}
		}
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
	getloveListStatusIndex( targetID, source ) {
		let targetIDPositionIndex;
		for ( let i = 0 ; i < source.length ; i++ ) {
			if ( targetID === source[i].id ) {
				targetIDPositionIndex = i;
				return targetIDPositionIndex;
			}
		}
	}
}


export default Apartments;

