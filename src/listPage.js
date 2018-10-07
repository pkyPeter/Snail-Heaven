import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import LoveList from "./LoveList.js";
import SimpleDetail from "./SimpleDetail.js";
import SearchResult from "./searchResult.js"
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faMapMarkedAlt);

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			resultAreaDisplayType: ["resultArea","results"],
			toggleSimpleDetail: false,
			currentSimpleDetail: {},
			hiddenList: lib.func.getLocalStorageJSON("hiddenList"),
			selectedIndex: -1
		}
		this.changeAreaSize = this.changeAreaSize.bind(this);
		this.goSimpleDetail = this.goSimpleDetail.bind(this);
		this.hideList = this.hideList.bind(this);
	}
	componentDidUpdate() {
		// console.log(this.props.loveListStatus);
		//20181003 : selectedIndex 預設值是－１，點擊後會儲存 marker 在 markers 中所在的位置，這個位置跟 completeList 的物件相對位置是一樣的
		if ( this.props.selectedIndex !== this.state.selectedIndex ) {
			this.setState({selectedIndex: this.props.selectedIndex});
			if ( this.props.selectedIndex !== -1 && this.state.toggleSimpleDetail === false) {
				this.goSimpleDetail("", this.props.completeList[this.props.selectedIndex]);
				// this.state({currentSimpleDetail: this.props.completeList[this.props.selectedIndex]});
			} 
			else if ( this.props.selectedIndex === -1 && this.state.toggleSimpleDetail === true ) {
				this.goSimpleDetail("",{})
			}
		}
		google.maps.event.addDomListener( lib.func.get(".filterType>p"), "click", (e)=>{
					console.log("test")
		})
	}
	render () {
		return (
			<section>
				<div className="left">
					<div id="googleMap" style={{height: "100%", width: "100%"}}></div>	
				</div>
				{	!this.props.goLoveList && !this.state.toggleSimpleDetail && (
					<SearchResult changeAreaSize={this.changeAreaSize}
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
					/>
				)} 
				{	this.props.goLoveList && !this.state.toggleSimpleDetail && (
					<LoveList resultAreaDisplayType={this.state.resultAreaDisplayType} 
					goLoveListPage={this.props.goLoveListPage} 
					goSimpleDetail={this.goSimpleDetail} 
					stopPropagation={this.stopPropagation.bind(this)}
					loveListDetail={this.props.loveListDetail}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.props.getloveListStatusIndex}
					removeFromLoveList={this.props.removeFromLoveList}
					putIntoLoveList={this.props.putIntoLoveList}
					/>
				)}
				{	this.state.toggleSimpleDetail != false && (
					<SimpleDetail goSimpleDetail={this.goSimpleDetail} 
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
					/>
				)}
				<div className="mapMode"><FontAwesomeIcon className="icon" icon={['fas','map-marked-alt']} /></div>
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

	goSimpleDetail( id, realEstate ) {
		// console.log(this.state.toggleSimpleDetail);
		// console.log(realEstate);
		this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));
		this.setState({goLoveList: false})	
		if( id !="" || realEstate != {}) {
			this.setState({currentSimpleDetail: realEstate})
		}
	}

	hideList(e, id) {
		let confirmHidden = confirm("您確定要隱藏這筆物件嗎？");
		if (confirmHidden === true) {
			let currentHidden = this.state.hiddenList;
			if (currentHidden === null) {
				currentHidden = [];
			}
			// console.log(id);
			// console.log(currentHidden);
			currentHidden.push(id);
			this.setState({ hiddenList: currentHidden });

			let JSONforRenew = lib.func.getLocalStorageJSON("hiddenList");
			if( JSONforRenew === null ) {
				JSONforRenew = [];
			} 
			JSONforRenew.push(id);
			localStorage.setItem("hiddenList", JSON.stringify(JSONforRenew));
			this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));	
		}
	}


}


export default List;