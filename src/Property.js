import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header.js";
import lib from "./lib.js";
import "./style/common.css";
import "./style/header.css";
import "./style/Property.css";
import data from "./result_export.json";
import Email from "./Email.js";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faRegularHeart,faSolidHeart,faShareAlt, faCaretLeft);


class Property extends React.Component {
	constructor() {
		super();
		this.state = {
	    	goLoveList: false,
	    	toggleSimpleDetail: false,
	    	loveListStatus: this.createLoveListStatus(data),
	    	loveListDetail: lib.func.getLocalStorageJSON("loveList"),
	    	completeList: data,
	    	currentList: {},
	    	toggleEmail: false
	    };
	}
	componentDidMount() {
		this.getQueryStringID((outputArray)=>{
			console.log(outputArray);
			let targetID = outputArray[0];
			let completeList = this.state.completeList;
			for (let i = 0; i< completeList.length; i++) {
				if (completeList[i].id === targetID) {
					this.setState({currentList: completeList[i]});
					console.log(completeList[i]);
				}
			}
		});
	}
	render() {
		if (Object.keys(this.state.currentList).length > 0) {
			let monthly_price = this.state.currentList.monthly_price.split(".")[0];
			let daily_price = parseInt(this.state.currentList.price.split(".")[0].split("$")[1].replace(",",""))*30;
			let daily_price_pureN = daily_price.toLocaleString("en");
			let amenities = this.sortOutAmenities(this.state.currentList.amenities,[/Internet/ig, /Hot water/ig, /Air conditioning/ig, /Refrigerator/ig,/Laptop friendly workspace/ig,  /washer/ig, /Pets allowed/ig]);
			let otherAmenities = this.sortOutAmenities(this.state.currentList.amenities,[/Kitchen/ig,/Paid parking off premises/ig, /Free street parking/ig, /Elevator/ig, /Gym/ig]);
			let TV = this.sortOutAmenities(this.state.currentList.amenities, [/TV/ig]).length === 2 ? ["TV", "Cable TV"] : ["TV"];//因為電視無法拆
			let loveListStatusIndex = this.getloveListStatusIndex(this.state.currentList.id, this.state.loveListStatus);
		return(
			<div className="properties">
				<Header goLoveListPage={this.goLoveList.bind(this)}/>
				<Email toggleEmail={this.state.toggleEmail}
				openEmailForm={this.openEmailForm.bind(this)}
				/>
				<section className="property">
					<div className="propTitle">
						<div className="button" onClick={this.goBackToSearch.bind(this)}>							
							<FontAwesomeIcon className="icon" icon={['fas','caret-left']}/>
							<div>回到搜尋結果</div>
						</div>
						<div className="sdRight">
							<div className="button">							
								<FontAwesomeIcon className="icon" icon={['fas','share-alt']}/>
								<div>分享</div>
							</div>
							{ 
								this.state.loveListStatus != undefined && this.state.loveListStatus[loveListStatusIndex].inList === true 
								? (
								<div className="button" onClick={(e)=>{ this.removeFromLoveList(e, this.state.currentList.id, this.state.currentList) }}>
									<FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} />
									<div>收藏</div>
								</div>
								)
								: (
								<div className="button" onClick={(e)=>{ this.putIntoLoveList(e, this.state.currentList.id, this.state.currentList) }}>
									<FontAwesomeIcon className="icon" icon={['far','heart']}/>
									<div>收藏</div>
								</div>
								)
							}
						</div>
					</div>
					<div className="propContent">
						<div className="left">
							<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
							<div className="name">{this.state.currentList.name}</div>
							<div className="address">「地址」：還要用google map製作，再接再厲</div>
							<div className="checkAvailable" onClick={this.openEmailForm.bind(this)}>立即詢問</div>
							<div className="propGraphicInfo">
								<div className="tabs">
									<div className="tab active">照片</div>
									<div className="tab">地圖</div>
									<div className="tab">街景</div>
								</div>
								<div className="graphics">
									<div className="photoGallery">
										<div className="gallery">
											<div className="photos">
												<div className="photo" style={{backgroundImage: `url(${this.state.currentList.picture_url})`}}></div>
											</div>
											<div className="leftSelector">
												<FontAwesomeIcon className="icon" icon={['fas','caret-left']}/>
											</div>
											<div className="rightSelector">
												<FontAwesomeIcon className="icon" icon={['fas','caret-right']}/>
											</div>
										</div>
										<div className="photoSelector">
											<div className="selector focus"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
										</div>
									</div>
									<div className="map"></div>
									<div className="streetView"></div>
								</div>
							</div>
							<div className="description">
							{this.state.currentList.description}
							</div>
							<div className="Amenities">
								<div className="title">房屋設備</div>
								<div className="content">
								{
									TV.map((TV,index)=>{
										if ( TV === "TV") { TV = "電視" }
										if ( TV === "Cable TV") { TV = "第四臺" }
										return(<div className="amenity" key={index}>{TV}</div>)
									})
								}
								{
									amenities.map((amenity, index)=>{
										if ( amenity === "Internet") { amenity = "網路" }
										if ( amenity === "Hot water") { amenity = "熱水器" }
										if ( amenity === "Air conditioning") { amenity = "冷氣" }
										if ( amenity === "Refrigerator") { amenity = "冰箱" }
										if ( amenity === "Laptop friendly workspace") { amenity = "書桌/工作區" }
										if ( amenity === "Washer") { amenity = "洗衣機" }
										if ( amenity === "Pets allowed") { amenity = "可養寵物" }
										return(<div className="amenity" key={index}>{amenity}</div>)
									})
								}
								</div>
							</div>
						</div>
						<div className="right">
							<div className="profile">
								<div className="avatar" style={{backgroundImage: `url(${this.state.currentList.host_picture_url})`}}></div>
								<div className="description">
									<div className="title">Posted by:</div>
									<div className="name">{this.state.currentList.host_name}</div>
								</div>
							</div>
							<div className="checkAvailable" onClick={this.openEmailForm.bind(this)}>立即詢問</div>
							<div className="flag">檢舉這個物件</div>
						</div>
					</div>
					<div className="footer">
						&copy;
					</div>
				</section>
			</div>
		)
		} else {
			return "loading";
		}
	}

	goLoveList(e) {
		this.props.history.push("/apartments?loveList");
	}
	goBackToSearch(e) {
		this.props.history.push("/apartments");
	}
	openEmailForm(e) {
		console.log('open form');
		this.setState((currentState,currentProps)=>({
			toggleEmail: !currentState.toggleEmail
		}))
	}
	getQueryStringID(callback) {
		let queryString = window.location.search;
		let splitByAnd = queryString.split("&");
		let outputArray = []; 
		for ( let i = 0 ; i < splitByAnd.length ; i++ ) {
			let splitByEuqal = splitByAnd[i].split("=");
			outputArray.push(splitByEuqal[1]);
		}
		console.log(outputArray);
		if (callback) {
			callback(outputArray);	
		}	
	}
	getloveListStatusIndex( targetID, source ) {
		let targetIDPositionIndex;
		for ( let i = 0 ; i < source.length ; i++ ){
			if ( targetID === source[i].id ) {
				targetIDPositionIndex = i;
				return targetIDPositionIndex;
			}
		}
	}

	createLoveListStatus(ObjectArray) {
		let loveListStatus = [];

		let JSONforRenew = lib.func.getLocalStorageJSON("loveList")!= null ? lib.func.getLocalStorageJSON("loveList") : [];

		// let JSONforRenew = current != null ? JSON.parse(current) : [];
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

	sortOutAmenities ( data, ruleArray) {
	let amenities = [];
		for (let i = 0; i<ruleArray.length; i++) {
			let amenity = data.match(ruleArray[i]);
			if (amenity != null) {
				amenities = [...amenities, ...amenity];
			}	
		}
		return amenities;
	}
	putIntoLoveList(e, id, realEstate) {
		console.log(id);
		let currentLoveList = this.state.loveListStatus;
		// currentLoveList[index].love = true;
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
		console.log(id);
		let currentLoveList = this.state.loveListStatus;
		// currentLoveList[index].love = false;
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
}

export default Property;