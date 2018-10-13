import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import PriceChart from "./PriceChart.js";
import googleMap from "./GoogleMap.js";
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart, faSave, faThumbsDown, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart, faListUl, faThLarge, faSquare, faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
library.add(faRegularHeart, faSolidHeart, faSave, faListUl, faThLarge, faSquare, faThumbsDown
,faEnvelope, faMapMarkedAlt);

class SearchResult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filters: {priceFloor:0 , priceCeiling: 100000},
			sort: null,
			originData: [],
			currentLoadAmount: 3,
			currentLoad: [],
			shouldStartRenew : true
		}
		this.changeFilters = this.changeFilters.bind(this);
		this.showMoreFilter = this.showMoreFilter.bind(this);
		this.changeToList = this.changeToList.bind(this);
		this.changeToRowBlocks = this.changeToRowBlocks.bind(this);
		this.changeToBlocks = this.changeToBlocks.bind(this);
		this.stopPropagation = this.stopPropagation.bind(this);
		this.recursive = this.recursive.bind(this);
		this.getMarkerBounce = this.getMarkerBounce.bind(this);
		this.stopMarkerBounce = this.stopMarkerBounce.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.getSelect = this.getSelect.bind(this);
	}
	componentDidMount() {
		console.log("search Result componentDidMount")
		console.log(this.props.filteredData)
		this.setState({originData: this.props.filteredData});
		this.recursive(this.props.filteredData, this.state.currentLoadAmount);
	}
	componentDidUpdate() {
		console.log("searchResult.js component did update")
		//檢查哪些按鈕已經被點擊過了
		let filtersFromApartments = this.props.filters;
		let roomAmount = lib.func.getAll(".roomAmount");
		let roomType = lib.func.getAll(".roomType");
		let roomTypeEN = ["Shared room","Private room","Entire home/apt"];
		let district = lib.func.getAll(".district");
		for ( let i = 0 ; i < roomAmount.length ; i++ ) {
			if ( lib.func.searchInsideArray(filtersFromApartments.roomAmount, i+1) ) {
				roomAmount[i].classList.add("active");
			} else {
				roomAmount[i].classList.remove("active");
			}
		}
		for ( let i = 0 ; i < roomType.length ; i++ ) {
			if ( lib.func.searchInsideArray(filtersFromApartments.roomType, roomTypeEN[i]) ) {
				roomType[i].classList.add("active");
			} else {
				roomType[i].classList.remove("active");
			}
		}
		for ( let i = 0 ; i < district.length ; i++ ) {
			if ( lib.func.searchInsideArray(filtersFromApartments.district, district[i].textContent) ) {
				district[i].classList.add("active");
			} else {
				district[i].classList.remove("active");
			}
		}
		if ( filtersFromApartments.photoRequired === true ) {
				lib.func.get(".filterDetail>.required").classList.add("active");
			} else {
				lib.func.get(".filterDetail>.required").classList.remove("active");
		}
				//價格篩選
		if ( this.props.filteredData.length ) {
			let dataForFilter = this.props.filteredData;
			let filters = this.props.filters;
			// console.log(filters.priceCeiling)
			// console.log(filters.priceFloor)
			if ( filters.priceCeiling != 100000 || filters.priceFloor != 0 ) {
				let priceArray = [];
				let dataAfterPriceFilter =[]
				let maxLength = 0;
				dataForFilter.map((realEstate, index)=>{
					if (realEstate.monthly_price != "") {
						let monthly_price = parseInt(realEstate.monthly_price.split(".")[0].split("$")[1].replace(/\,/g,""));
						priceArray.push(monthly_price);
					} else {
						let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
						priceArray.push(daily_price);
					}
				})

				//如果資料的價格介於priceCeilig以及priceFloor之間，就進行篩選
				googleMap.markerclusterer.clearMarkers();
				for ( let i = 0 ; i < dataForFilter.length ; i++ ) {
					if ( filters.priceFloor < priceArray[i] && priceArray[i] <= filters.priceCeiling ) {
						dataAfterPriceFilter.push(dataForFilter[i]);
						googleMap.markers[dataForFilter[i].index].setVisible(true);
					} else {
						googleMap.markers[dataForFilter[i].index].setVisible(false);
					}
				}
				if (this.props.filteredData.length !== dataAfterPriceFilter.length ) {		
					dataForFilter = dataAfterPriceFilter;
				}
			} 
			console.log(132,"是否為真",dataForFilter !== this.state.originData)
			//首次資料進入會不同，此時將originData設為dataForFilter，並呼叫recursive來印製畫面。
			//originData將作為比較值讓當次的render不會重新呼叫recursive，但當資料有更新時，還是會執行一次
			console.log(114, "currentLoadAmount", this.state.currentLoadAmount)
			if ( dataForFilter.length !== this.state.originData.length ) { 
				this.setState({originData: dataForFilter});
				this.recursive(dataForFilter, this.state.currentLoadAmount);
			}
		}
	}
	render() {
		console.log("render searchResult.js");
		// console.log(this.props.filteredData);
		return (
			<div className="right" style={{width: this.props.leftRightWidth.rightWidth}} onScroll={(e)=>{this.scrollToBottom(e)}}>
						<div className="areaSizer" draggable="true" onDrag={this.props.changeAreaSize} onDragEnd={this.props.changeAreaSize} style={{right: this.props.leftRightWidth.resizerRight}}></div>
						<div className="title">
							<div>台北市</div>
							<div> > </div>
							<div>行政區</div>
						</div>
						<div className="filterArea">
							<div className="filterType">
								<p>租金</p>
								<PriceChart completeList={this.props.completeList} 
								currentViewData={this.props.currentViewData} 
								changeFilters={this.props.changeFilters} 
								filteredData={this.props.filteredData}
								/>
							</div>
							<div className="filterType">
								<p>房間數量</p>
								<div className="filterDetail">
									<div className="roomAmount" onClick={()=>{this.props.changeFilters("roomAmount",1)}}>1</div>
									<div className="roomAmount" onClick={()=>{this.props.changeFilters("roomAmount",2)}}>2</div>
									<div className="roomAmount" onClick={()=>{this.props.changeFilters("roomAmount",3)}}>3</div>
									<div className="roomAmount" onClick={()=>{this.props.changeFilters("roomAmount",4)}}>4+</div>
								</div>
							</div>
							<div className="filterType">
								<p>房屋類型</p>
								<div className="filterDetail">
									<div className="roomType" onClick={()=>{this.props.changeFilters("roomType","Shared room")}} >分租套房</div>
									<div className="roomType" onClick={()=>{this.props.changeFilters("roomType","Private room")}} >獨立套房</div>
									<div className="roomType" onClick={()=>{this.props.changeFilters("roomType","Entire home/apt")}} >整層住家</div>
								</div>
							</div>
							<div className="filterType districts hidden">
								<p>行政區</p>
								<div className="filterDetail">
									<div className="district" onClick={()=>{this.props.changeFilters("district","中正區")}}>中正區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","大同區")}}>大同區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","中山區")}}>中山區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","松山區")}}>松山區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","大安區")}}>大安區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","萬華區")}}>萬華區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","信義區")}}>信義區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","士林區")}}>士林區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","北投區")}}>北投區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","內湖區")}}>內湖區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","南港區")}}>南港區</div>
									<div className="district" onClick={()=>{this.props.changeFilters("district","文山區")}}>文山區</div>				
								</div>
							</div>
							<div className="filterType hidden">
								<p>有無房屋照片</p>
								<div className="filterDetail">
									<div className="required" onClick={()=>{this.props.changeFilters("photoRequired",true)}}>必須有照片</div>
								</div>
							</div>
							<div className="filterType buttons">
								<div className="button"><FontAwesomeIcon className="icon" icon={['far','save']}/>儲存篩選組合</div>
								<div className="button" onClick={this.showMoreFilter}>更多條件</div>
							</div>
						</div>
						<div className="resultTitle">
							<div className="showLogic">
								<select onChange={this.getSelect}>
									<option value="0">預設排序</option>
									<option value="1">最新物件</option>
									<option value="2">最低價優先</option>
									<option value="3">最高價優先</option>
								</select>
							</div>
							<p>{ this.state.originData.length }筆結果</p>
							<div className="displayLogic">
								<div className="displayType" onClick={this.changeToList}><FontAwesomeIcon icon={['fas','list-ul']}/></div>
								<div className="displayType" onClick={this.changeToRowBlocks}><FontAwesomeIcon icon={['fas','th-large']}/></div>
								<div className="displayType" onClick={this.changeToBlocks}><FontAwesomeIcon icon={['fas','square']}/></div>
							</div>
						</div>
						<div className={this.props.resultAreaDisplayType[0]}>
							{
								this.state.currentLoad.map((realEstate, index)=>{
									let monthly_price = realEstate.monthly_price.split(".")[0];
									let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
									let daily_price_pureN = daily_price.toLocaleString("en");
									let loveListStatusIndex = this.props.loveListStatus != null && this.props.getloveListStatusIndex(realEstate.id, this.props.loveListStatus);
									let hidden = false;
									if ( this.props.hiddenList != null ) {
										for (let i = 0 ; i< this.props.hiddenList.length; i++) {
											if ( realEstate.id === this.props.hiddenList[i]) { hidden = true; }
										}
									}

									if (hidden === false) {
										return (
											<div key={index} className={this.props.resultAreaDisplayType[1]} onClick={(e)=> { this.props.goSimpleDetail(realEstate.id, realEstate); this.props.addSelectedIndex(realEstate.index) } } onMouseEnter={(e)=>{
												this.getMarkerBounce(e, realEstate.index)
											}} onMouseLeave={(e)=>{this.stopMarkerBounce(e, realEstate.index)}}>
												<div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
												<div className="description">
													<div className="priceGesture absolute">
														<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
														<div className="gesture" onClick={this.stopPropagation}>
															{ 
																this.props.loveListStatus != null &&this.props.loveListStatus != undefined && this.props.loveListStatus[loveListStatusIndex].inList === true 
															  ? <FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} onClick={(e)=>{ this.props.removeFromLoveList(e, realEstate.id, realEstate) }}/>
															  : <FontAwesomeIcon className="icon" icon={['far','heart']} onClick={(e)=>{ this.props.putIntoLoveList(e, realEstate.id, realEstate) }}/>
															}
															<FontAwesomeIcon className="icon" icon={['far','envelope']} onClick={this.props.openEmailForm}/>
															<FontAwesomeIcon className="icon" icon={['far','thumbs-down']} onClick={(e)=>{this.props.hideList(e, realEstate.id)}} />
														</div>
													</div>
													<p>{realEstate.bedrooms} rooms {realEstate.room_type}</p>
													<p>{realEstate.neighbourhood_cleansed}</p>
													<p className="updateTime">{realEstate.calendar_updated}</p>
												</div>
											</div>
										)
									}
									
								})
							}
						</div>
					</div>
		)
	}
	stopPropagation(e) {
		e.stopPropagation();
    	e.nativeEvent.stopImmediatePropagation();
	}

	showMoreFilter(e) {
		let filterTypes = lib.func.getAll(".filterType"); 
		let filterbutton = lib.func.getAll(".buttons>.button");	
		if ( document.body.clientWidth > 900 ) {
			filterTypes[3].classList.toggle("hidden");
			filterTypes[4].classList.toggle("hidden");	
			filterbutton[0].classList.toggle("hidden");
			filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "收合條件" : filterbutton[1].textContent = "更多條件";
		} else {
			filterTypes[3].classList.remove("hidden");
			filterTypes[4].classList.remove("hidden");
			for ( let i = 0 ; i< filterTypes.length-1 ; i++ ) {
				if ( filterTypes[i].style.display ==="" || filterTypes[i].style.display ==="none" ){
					filterTypes[i].style.display = "flex";
					filterbutton[0].classList.toggle("hidden");
					filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "收合條件" : filterbutton[1].textContent = "更多條件";
				} else { 
					filterTypes[i].style.display = "none"; 
					filterbutton[0].classList.toggle("hidden");
					filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "收合條件" : filterbutton[1].textContent = "更多條件";		
				}
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
	changeFilters(filter, value) {
		let currentState = this.state.filters;
		currentState[filter] = value;
		this.setState({filters: currentState})
	}
	recursive(dataForFilter, loadingAmount) {
		console.log(301, "loadingAmount:", loadingAmount)
		console.log("result legnth",lib.func.getAll(".results").length)
	  setTimeout(() => {
	    // let hasMore = this.state.currentLoad.length + 50 < dataForFilter.length + 50;
	    let hasMore = this.state.currentLoad.length < loadingAmount;
	    this.setState( (prev, props) => ({
	      currentLoad: dataForFilter.slice(0, prev.currentLoad.length + loadingAmount)
	    }));
	    if (hasMore) {
	    	this.recursive(dataForFilter, loadingAmount); 
	    } else {
	    	console.log(325,"has More ends!!!!!!!!!!")
	    }
	  }, 10);
	}
	getMarkerBounce(e, index) {
		e.stopPropagation();
		console.log("mouseenter");
		let currentIndex = parseInt(index);
		googleMap.markers[currentIndex].setAnimation(google.maps.Animation.BOUNCE);
	}
	stopMarkerBounce(e, index) {
		let currentIndex = parseInt(index);
		googleMap.markers[currentIndex].setAnimation(null)
	}
	scrollToBottom(e) {
		let scrollHeight = e.currentTarget.scrollHeight;
		let scrollTop = e.currentTarget.scrollTop; 
		let clientHeight = e.currentTarget.clientHeight;
				console.log(scrollHeight,scrollTop,clientHeight)

		if (scrollHeight - scrollTop < (clientHeight + 100)) {
			console.log(true,true,true,true,true)
			// this.setState((prev) => ({ currentLoadAmount: prev.currentLoadAmount + 2 }))
			setTimeout(()=>{
				this.recursive(this.state.originData, this.state.currentLoadAmount);
			}, 0)	
		}
		console.log(this.state.currentLoadAmount);
	}
	getSelect(e) {
		console.log(e.currentTarget);
		console.log(e.currentTarget.value);
	}
}

export default SearchResult;