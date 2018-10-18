import React from "react";
import PropTypes from 'prop-types';
import "firebase/database";
import { firebaseApp } from "./firebaseApp.js";
import lib from "./lib.js";
import LoveList from "./LoveList.js";
import SimpleDetail from "./SimpleDetail.js";
import SearchResult from "./searchResult.js";
import googleMap from "./GoogleMap.js";
// import snail_face from "./imgs/snail_white.png";
import snail_face from "./imgs/snail_cousin_white.png";
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faMapMarkedAlt, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faMapMarkedAlt,faPencilAlt);

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			resultAreaDisplayType: ["resultArea","results"],
			toggleSimpleDetail: false,
			currentSimpleDetail: false,
			hiddenList: lib.func.getLocalStorageJSON("hiddenList"),
			selectedIndex: -1,
			customArea: false,
			showBusiness: false,
			showRoad: false,
			leftRightWidth: { rightWidth: "600px", leftWidth: "calc(100% - 600px)", resizerRight: "600px" },
			sort: null,
			readyForSort: false,
			loadEnd: true
		}
		this.drawCustomArea =this.drawCustomArea.bind(this);
		this.openMapMarker = this.openMapMarker.bind(this);
		this.changeAreaSize = this.changeAreaSize.bind(this);
		this.goSimpleDetail = this.goSimpleDetail.bind(this);
		this.hideList = this.hideList.bind(this);
		this.stopPropagation= this.stopPropagation.bind(this);
		this.switchToMap = this.switchToMap.bind(this);
		this.getSelect = this.getSelect.bind(this);
		this.recordCurrentStatus = this.recordCurrentStatus.bind(this);
	}
	componentDidMount() {
		if (document.documentElement.clientWidth <= 900) {
			let leftRightWidth = this.state.leftRightWidth;
			leftRightWidth.rightWidth = "100%";
			leftRightWidth.leftWidth = "100%";
			this.setState({leftRightWidth: leftRightWidth})
		} else {
			let leftRightWidth = this.state.leftRightWidth;
			leftRightWidth.rightWidth = "600px";
			leftRightWidth.leftWidth = "calc(100% - 600px)";
			this.setState({leftRightWidth: leftRightWidth})
		}
	}
	componentDidUpdate() {
		// console.log(this.props.loveListStatus);
		console.log(this.props.selectedIndex)
		//20181003 : selectedIndex 預設值是－１，點擊後會儲存 marker 在 markers 中所在的位置，這個位置跟 completeList 的物件相對位置是一樣的
		if ( this.props.selectedIndex !== this.state.selectedIndex ) {
			//這邊這個行為，取代了在每個地方加上goSimpleDetail的意義，只要加在這裡就好了
			if ( this.props.selectedIndex !== -1 ) {
				console.log(this.props.filteredData)
				for ( let i = 0 ; i < this.props.completeList.length; i++ ) {
					if ( this.props.completeList[i].index === this.props.selectedIndex ) {
						this.goSimpleDetail(this.props.completeList[i].id, this.props.completeList[i]);
					}
				}
				if ( this.state.selectedIndex !== -1 ) {
					googleMap.markers[this.state.selectedIndex].setIcon(googleMap.produceMarkerStyle(false, 30));
				} 
				// this.state({currentSimpleDetail: this.props.completeList[this.props.selectedIndex]});
			} 
			else if ( this.props.selectedIndex === -1 && this.state.toggleSimpleDetail === true ) {
				this.goSimpleDetail("back",{})
			}
			this.setState({selectedIndex: this.props.selectedIndex});
		}
		if ( this.props.filteredData.length !== 0  ) {
			if (document.documentElement.clientWidth > 900 ) {
				lib.func.get(".apartments>section>.loading").style.opacity = "0";
				setTimeout(()=>{			
					lib.func.get(".apartments>section>.loading").style.zIndex = "0";
				}, 1000)
			} else {
				if ( !lib.func.get(".apartments>section>.loading").style.opacity || lib.func.get(".apartments>section>.right").style.display === "unset") {
					lib.func.get(".apartments>section>.loading").style.opacity = "0";
					setTimeout(()=>{			
						lib.func.get(".apartments>section>.loading").style.zIndex = "0";
					}, 1000)
				}
			}
		}
	}
	render () {
		return (
			<section>
				<div className="left" style={{width: this.state.leftWidth}}>
					<div className="paint" onClick={this.drawCustomArea}>
						{	this.state.customArea === false
							? ( 
							<span>
								<FontAwesomeIcon className="icon" icon={['fas','pencil-alt']} />自行繪製區域
							</span> )
							: ( <span>取消繪製區域</span> )
						}						
					</div>
					<div className="business" onClick={()=>{this.openMapMarker("business")}}>
							{	!this.state.showBusiness 
								?( <span>顯示周邊商家</span> )
								:( <span>隱藏周邊商家</span> )
							}
					</div>
					<div className="road" onClick={()=>{this.openMapMarker("road")}}>
							{	!this.state.showRoad 
								?( <span>顯示道路名稱</span> )
								:( <span>隱藏道路名稱</span> )
							}
					</div>
					<div id="googleMap" style={{height: "100%", width: "100%"}}></div>	
				</div>
				<div className="loading">
					<img src={snail_face}  />
					<div className="description">LOADING</div>
	            </div>
				{	!this.props.goLoveList && !this.state.toggleSimpleDetail && (
					<SearchResult changeAreaSize={this.changeAreaSize}
					leftRightWidth = {this.state.leftRightWidth}
					resultAreaDisplayType={this.state.resultAreaDisplayType}
					completeList={this.props.completeList}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.props.getloveListStatusIndex}
					hiddenList={this.state.hiddenList}
					goSimpleDetail={this.goSimpleDetail}
					removeFromLoveList={this.props.removeFromLoveList}
					putIntoLoveList={this.props.putIntoLoveList}
					openEmailFrom={this.props.openEmailFrom}
					hideList={this.hideList}
					addSelectedIndex={this.props.addSelectedIndex}
					removeSelectedIndex={this.props.removeSelectedIndex}
					currentViewData={this.props.currentViewData}
					filteredData={this.props.filteredData}
					changeFilters={this.props.changeFilters}
					filters={this.props.filters}
					readyForSort = {this.state.readyForSort}
					sort = {this.state.sort}
					getSelect={this.getSelect}
					/>
				)} 
				{	this.props.goLoveList && !this.state.toggleSimpleDetail && (
					<LoveList 	leftRightWidth = {this.state.leftRightWidth}
					resultAreaDisplayType={this.state.resultAreaDisplayType} 
					goLoveListPage={this.props.goLoveListPage} 
					addSelectedIndex={this.props.addSelectedIndex}
					goSimpleDetail={this.goSimpleDetail} 
					stopPropagation={this.stopPropagation}
					loveListDetail={this.props.loveListDetail}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.props.getloveListStatusIndex}
					removeFromLoveList={this.props.removeFromLoveList}
					putIntoLoveList={this.props.putIntoLoveList}
					/>
				)}
				{	this.state.toggleSimpleDetail != false && this.state.currentSimpleDetail && (
					<SimpleDetail  leftRightWidth = {this.state.leftRightWidth}
					goSimpleDetail={this.goSimpleDetail} 
					goPropertyPage={this.props.goPropertyPage}
					currentSimpleDetail={this.state.currentSimpleDetail}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.props.getloveListStatusIndex}
					putIntoLoveList={this.props.putIntoLoveList}
					removeFromLoveList={this.props.removeFromLoveList}
					hideList={this.hideList}
					openEmailFrom={this.props.openEmailForm}
					removeSelectedIndex={this.props.removeSelectedIndex}
					selectedIndex={this.state.selectedIndex}
					recordCurrentStatus={this.recordCurrentStatus}
					/>
				)}
				<div className="mapMode" onClick={this.switchToMap}><FontAwesomeIcon className="icon" icon={['fas','map-marked-alt']} /></div>
				<div className="listMode"></div>
			</section>
		)
	}
	stopPropagation(e) {
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	}
	changeAreaSize(e) {
		let left = document.querySelector(".apartments>section>.left");
		let right = document.querySelector(".apartments>section>.right");
		let resizer = document.querySelector(".apartments>section>.right>.areaSizer ");
		let leftRightWidth = this.state.leftRightWidth;
		if ( e.type === "drag" && e.clientX != 0 && window.innerWidth - e.clientX >= 600) {
				// left.style.width = e.clientX;
				// right.style.width = window.innerWidth - e.clientX;
				e.preventDefault();
				resizer.style.right = window.innerWidth - e.clientX;	
		}
		if ( e.type === "dragend") {
			if (( window.innerWidth - e.clientX ) >= 600 ) {
				left.style.width = e.clientX;
				right.style.width = window.innerWidth - e.clientX;
				resizer.style.right = window.innerWidth - e.clientX;
				leftRightWidth.leftWidth = e.clientX;
				leftRightWidth.rightWidth = window.innerWidth - e.clientX;
				leftRightWidth.resizerRight = window.innerWidth - e.clientX;
				this.setState({leftRightWidth: leftRightWidth})
			} else {
				left.style.width = `calc(100% - 600px)`;
				right.style.width = `600px`;
				resizer.style.right = "600px";
				leftRightWidth.leftWidth = `calc(100% - 600px)`;
				leftRightWidth.rightWidth = `600px`;
				leftRightWidth.resizerRight = "600px";
				this.setState({leftRightWidth: leftRightWidth})
			}
		} 
	}

	goSimpleDetail( id, realEstate ) {
		// console.log(this.state.toggleSimpleDetail);
		// console.log(realEstate);
		if (id && id != "back") {
			if (document.documentElement.clientWidth > 900) {
				let latLng = new google.maps.LatLng(parseFloat(realEstate.lat),parseFloat(realEstate.lng));
				if ( !googleMap.map.getBounds().contains(latLng) ) {
					googleMap.map.setCenter(latLng);
					googleMap.map.setZoom(googleMap.map.getZoom());	
				}
			}
			firebaseApp.fBaseDB.getData("details",(detail)=>{
				let objectKey = parseInt(Object.keys(detail)[0]);
				let currentDetail = detail[objectKey];
				this.setState({currentSimpleDetail: currentDetail})
				if ( this.props.selectedIndex === -1 ) {
					this.setState({toggleSimpleDetail: false});		
				} else {
					this.setState({toggleSimpleDetail: true});
					    googleMap.markers[currentMarkerIndex].setIcon(googleMap.produceMarkerStyle(false, 30));
				}
				
				this.setState({goLoveList: false})
			}, "id", id );
		}
		if (id === "back") {
			if (document.documentElement.clientWidth <= 900) {
				let right = lib.func.get(".apartments>section>.right")
				right.style.display = "none";
			}
			console.log("back");
			this.setState({currentSimpleDetail: false})
			this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));
		}
	}

	hideList(e, id, index) {
		let confirmHidden = confirm("您確定要隱藏這筆物件嗎？");
		if (confirmHidden === true) {
			let currentHidden = this.state.hiddenList;
			if (currentHidden === null) {
				currentHidden = [];
			}
			currentHidden.push(id);
			this.setState({ hiddenList: currentHidden });
			let JSONforRenew = lib.func.getLocalStorageJSON("hiddenList");
			if( JSONforRenew === null ) {
				JSONforRenew = [];
			} 
			JSONforRenew.push(id);
			localStorage.setItem("hiddenList", JSON.stringify(JSONforRenew));
			if (this.state.toggleSimpleDetail === true) {
				this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));		
			}
			googleMap.markers[index].setVisible(false);
		}
	}

	drawCustomArea() {
		console.log("paint Clicked");
		let mouseDown = googleMap.evt.drawCustomArea(false);
		lib.func.get(".left>.paint").classList.toggle("active");
		googleMap.map.setOptions({draggableCursor:'crosshair'}); 
		if (this.state.customArea) {
			googleMap.evt.drawCustomArea(true);
			googleMap.map.setOptions({draggableCursor:'default'}); 
		}
		this.setState( currentState=>({ customArea: !currentState.customArea}) )
	}

	openMapMarker(target) {
		
		console.log("openBusinessMarker")
		if ( target === "business" ) {
			if ( !this.state.showBusiness ) {
				googleMap.style[5].stylers[0].visibility = "simplified";
				googleMap.map.setOptions({styles: googleMap.style});	
				this.setState({showBusiness: true})
			} else {
				googleMap.style[5].stylers[0].visibility = "off";
				googleMap.map.setOptions({styles: googleMap.style});	
				this.setState({showBusiness: false})
			}
		}
		if ( target === "road" ) {
			if ( !this.state.showRoad ) {
				googleMap.style[9].stylers[0].visibility = "simplified";
				googleMap.map.setOptions({styles: googleMap.style});	
				this.setState({showRoad: true})
			} else {
				googleMap.style[9].stylers[0].visibility = "off";
				googleMap.map.setOptions({styles: googleMap.style});	
				this.setState({showRoad: false})
			}
		}
		
	}

	switchToMap() {
		let left = lib.func.get(".apartments>section>.left")
		let right = lib.func.get(".apartments>section>.right")
		if ( left.style.opacity !== "1" || left.style.opacity === undefined || !left.style.opacity ) {
			console.log(left.style.opacity)
			left.style.opacity = "1";
			right.style.display = "none";
		} else {
			console.log(left.style.opacity)
			left.style.opacity = "0";
			right.style.display = "flex";
		}
	}
	getSelect(e, usage) {
		if (usage === "select") {
			switch ( e.currentTarget.value ) {
		    	case "default":
		    	this.setState({sort: "default", readyForSort: true})
		    	break;
		    	case "latest":
		    	this.setState({sort: "latest", readyForSort: true})
		    	break;
		    	case "lowest":
		    	this.setState({sort: "lowest", readyForSort: true})
		    	break;
		    	case "highest":
		    	this.setState({sort: "highest", readyForSort: true})
		    	break;
		    }
		} else if ( usage === "disable") {
			this.setState({readyForSort: false})
		}

	 }
	recordCurrentStatus() {
	    let mapZoom = googleMap.map.getZoom();
	    let mapCenter = googleMap.map.getCenter();
	    let currentFilters = this.props.filters;
	    let sceenInfo = {
	      zoom: mapZoom,
	      center: mapCenter,
	      screenInfo: currentFilters
	    }
	    localStorage.setItem("sceenInfo", JSON.stringify(sceenInfo));
	  }

}


export default List;