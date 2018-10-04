import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
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
		}
	}
	render() {
		return (
			<div className="right">
						<div className="areaSizer" draggable="true" onDrag={this.props.changeAreaSize} onDragEnd={this.props.changeAreaSize}></div>
						<div className="title">
							<div>台北市</div>
							<div> > </div>
							<div>行政區</div>
						</div>
						<div className="filterArea">
							<div className="filterType">
								<p>租金</p>
								<div className="filterDetail"></div>
							</div>
							<div className="filterType">
								<p>房間數量</p>
								<div className="filterDetail">
									<div className="roomAmount">1</div>
									<div className="roomAmount">2</div>
									<div className="roomAmount">3</div>
									<div className="roomAmount">4+</div>
								</div>
							</div>
							<div className="filterType">
								<p>房屋類型</p>
								<div className="filterDetail">
									<div className="roomType">分租套房</div>
									<div className="roomType">獨立套房</div>
									<div className="roomType">整層住家</div>
								</div>
							</div>
							<div className="filterType hidden">
								<p>行政區</p>
								<div className="filterDetail"></div>
							</div>
							<div className="filterType hidden">
								<p>有無房屋照片</p>
								<div className="filterDetail"></div>
							</div>
							<div className="filterType buttons">
								<div className="button"><FontAwesomeIcon className="icon" icon={['far','save']}/>儲存篩選組合</div>
								<div className="button" onClick={this.showMoreFilter.bind(this)}>更多條件</div>
							</div>
						</div>
						<div className="resultTitle">
							<div className="showLogic">
								<select>
									<option>相關性</option>
									<option>最新物件</option>
									<option>最低價優先</option>
									<option>最高價優先</option>
								</select>
							</div>
							<p>{this.props.completeList.length}筆結果</p>
							<div className="displayLogic">
								<div className="displayType" onClick={this.changeToList.bind(this)}><FontAwesomeIcon icon={['fas','list-ul']}/></div>
								<div className="displayType" onClick={this.changeToRowBlocks.bind(this)}><FontAwesomeIcon icon={['fas','th-large']}/></div>
								<div className="displayType" onClick={this.changeToBlocks.bind(this)}><FontAwesomeIcon icon={['fas','square']}/></div>
							</div>
						</div>
						<div className={this.props.resultAreaDisplayType[0]}>
							{
								this.props.completeList.map((realEstate, index)=>{
									let monthly_price = realEstate.monthly_price.split(".")[0];
									let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
									let daily_price_pureN = daily_price.toLocaleString("en");
									let loveListStatusIndex = this.props.getloveListStatusIndex(realEstate.id, this.props.loveListStatus);
									let hidden = false;
									if ( this.props.hiddenList != null ) {
										for (let i = 0 ; i< this.props.hiddenList.length; i++) {
											if ( realEstate.id === this.props.hiddenList[i]) { hidden = true; }
										}
									}
									if (hidden === false) {
										return (
											<div key={index} className={this.props.resultAreaDisplayType[1]} onClick={(e)=> { this.props.goSimpleDetail(realEstate.id, realEstate); } }>
												<div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
												<div className="description">
													<div className="priceGesture absolute">
														<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
														<div className="gesture" onClick={this.stopPropagation.bind(this)}>
															{ 
																this.props.loveListStatus != undefined && this.props.loveListStatus[loveListStatusIndex].inList === true 
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
			filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "確認條件" : filterbutton[1].textContent = "更多條件";
		} else {
			filterTypes[3].classList.remove("hidden");
			filterTypes[4].classList.remove("hidden");
			for ( let i = 0 ; i< filterTypes.length-1 ; i++ ) {
				if ( filterTypes[i].style.display ==="" || filterTypes[i].style.display ==="none" ){
					filterTypes[i].style.display = "flex";
					filterbutton[0].classList.toggle("hidden");
					filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "確認條件" : filterbutton[1].textContent = "更多條件";
				} else { 
					filterTypes[i].style.display = "none"; 
					filterbutton[0].classList.toggle("hidden");
					filterbutton[1].textContent === "更多條件" ? filterbutton[1].textContent = "確認條件" : filterbutton[1].textContent = "更多條件";		
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
}

export default SearchResult;