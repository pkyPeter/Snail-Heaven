import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import LoveList from "./LoveList.js";
import ListRight from "./ListRight.js";
import SimpleDetail from "./SimpleDetail.js";
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faListUl} from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
library.add(faRegularHeart, faSolidHeart, faSave, faListUl, faThLarge, faSquare, faThumbsDown
,faEnvelope, faMapMarkedAlt);

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggleSimpleDetail: false,
			currentSimpleDetail: {}
		}
	}
	render () {
		return (
			<section>
				<div className="left">
					<div id="googleMap" style={{height: "100%", width: "100%"}}></div>	
				</div>
				{	!this.props.goLoveList && !this.state.toggleSimpleDetail && (
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
								<div className="displayType" onClick={this.props.changeToList}><FontAwesomeIcon icon={['fas','list-ul']}/></div>
								<div className="displayType" onClick={this.props.changeToRowBlocks}><FontAwesomeIcon icon={['fas','th-large']}/></div>
								<div className="displayType" onClick={this.props.changeToBlocks}><FontAwesomeIcon icon={['fas','square']}/></div>
							</div>
						</div>
						<div className={this.props.resultAreaDisplayType[0]}>
							{
								this.props.completeList.map((realEstate, index)=>{
									let monthly_price = realEstate.monthly_price.split(".")[0];
									let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
									let daily_price_pureN = daily_price.toLocaleString("en");
									let loveListStatusIndex = this.getloveListStatusIndex(realEstate.id, this.props.loveListStatus);
									let hidden = false;
									if ( this.props.hiddenList != null ) {
										for (let i = 0 ; i< this.props.hiddenList.length; i++) {
											if ( realEstate.id === this.props.hiddenList[i]) {
												hidden = true;
											}
										}
									}
									if (hidden === false) {
										return (
											<div key={index} className={this.props.resultAreaDisplayType[1]} onClick={(e)=> { this.goSimpleDetail(e, realEstate.id, realEstate) } }>
												<div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
												<div className="description">
													<div className="priceGesture absolute">
														<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
														<div className="gesture" onClick={this.stopPropagation.bind(this)}>
															{ 
																this.props.loveListStatus != undefined && this.props.loveListStatus[loveListStatusIndex].inList === true ? <FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} onClick={(e)=>{ this.props.removeFromLoveList(e, realEstate.id, realEstate) }}/>
															  : <FontAwesomeIcon className="icon" icon={['far','heart']} onClick={(e)=>{ this.props.putIntoLoveList(e, realEstate.id, realEstate) }}/>
															}
															<FontAwesomeIcon className="icon" icon={['far','envelope']} onClick={this.props.openEmailForm}/>
															<FontAwesomeIcon className="icon" icon={['far','thumbs-down']} onClick={(e)=>{this.props.hideList(e, realEstate.id, realEstate)}} />
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
				)} 
				{	this.props.goLoveList && !this.state.toggleSimpleDetail && (
					<LoveList resultAreaDisplayType={this.props.resultAreaDisplayType} 
					goLoveListPage={this.props.goLoveListPage} 
					goSimpleDetail={this.goSimpleDetail.bind(this)} 
					stopPropagation={this.stopPropagation.bind(this)}
					loveListDetail={this.props.loveListDetail}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.getloveListStatusIndex}
					removeFromLoveList={this.props.removeFromLoveList}
					putIntoLoveList={this.props.putIntoLoveList}
					/>
				)}
				{	!this.props.goLoveList && this.state.toggleSimpleDetail && (
					<SimpleDetail goSimpleDetail={this.goSimpleDetail.bind(this)} 
					goPropertyPage={this.props.goPropertyPage}
					currentSimpleDetail={this.state.currentSimpleDetail}
					loveListStatus={this.props.loveListStatus}
					getloveListStatusIndex={this.getloveListStatusIndex}
					putIntoLoveList={this.props.putIntoLoveList}
					removeFromLoveList={this.props.removeFromLoveList}
					hideList={this.props.hideList}
					openEmailFrom={this.props.openEmailForm}
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
	showMoreFilter(e) {
		let filterTypes = lib.func.getAll(".filterType"); 
		let filterbutton = lib.func.getAll(".buttons>.button");	
		console.log(filterTypes[0].style.display);
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

	getloveListStatusIndex( targetID, source ) {
		let targetIDPositionIndex;
		for ( let i = 0 ; i < source.length ; i++ ){
			if ( targetID === source[i].id ) {
				targetIDPositionIndex = i;
				return targetIDPositionIndex;
			}
		}
	}

	goSimpleDetail(e, id, realEstate) {
		this.setState((currentState,currentProps) => ({toggleSimpleDetail: !currentState.toggleSimpleDetail}));
		this.setState({goLoveList: false})	
		if( id || realEstate) {
			this.setState({currentSimpleDetail: realEstate})
		}
	}

}


export default List;