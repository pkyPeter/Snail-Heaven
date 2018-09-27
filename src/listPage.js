import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import LoveList from "./LoveList.js"
import SimpleDetail from "./SimpleDetail.js";
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faListUl} from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
library.add(faRegularHeart, faSave, faListUl, faThLarge, faSquare, faThumbsDown
,faEnvelope, faMapMarkedAlt);

class List extends React.Component {	
	render () {
		return (
			<section>
				<div className="left">
					<div id="googleMap" style={{height: "100%", width: "100%"}}></div>	
				</div>
				{	!this.props.goLoveList && !this.props.toggleSimpleDetail && (
					<div className="right">
						<div className="areaSizer" draggable="true" onDrag={this.props.changeAreaSize} onDragEnd={this.props.changeAreaSize}></div>
						<div className="title">
							<div>縣市</div>
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
							<p>200筆結果</p>
							<div className="displayLogic">
								<div className="displayType" onClick={this.props.changeToList}><FontAwesomeIcon icon={['fas','list-ul']}/></div>
								<div className="displayType" onClick={this.props.changeToRowBlocks}><FontAwesomeIcon icon={['fas','th-large']}/></div>
								<div className="displayType" onClick={this.props.changeToBlocks}><FontAwesomeIcon icon={['fas','square']}/></div>
							</div>
						</div>
						<div className="resultArea">
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture" onClick={this.stopPropagation.bind(this)}>
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture">
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture">
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture">
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture">
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
							<div className="results" onClick={this.props.goSimpleDetail}>
								<div className="img"></div>
								<div className="description">
									<div className="priceGesture absolute">
										<div className="price">$1,385</div>
										<div className="gesture">
											<FontAwesomeIcon className="icon" icon={['far','heart']}/>
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>9 Floorplans</p>
									<p>New York, Chicago</p>
									<p className="updateTime">2天前</p>
								</div>
							</div>
						</div>
					</div>
				)} 
				{	this.props.goLoveList && !this.props.toggleSimpleDetail && (
					<LoveList resultAreaDisplayType={this.props.resultAreaDisplayType} goLoveListPage={this.props.goLoveListPage} />
				)}
				{	!this.props.goLoveList && this.props.toggleSimpleDetail && (
					<SimpleDetail goSimpleDetail={this.props.goSimpleDetail} goPropertyPage={this.props.goPropertyPage}/>
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
		filterTypes[3].classList.toggle("hidden");
		filterTypes[4].classList.toggle("hidden");
		let filterbutton = lib.func.getAll(".buttons>.button");		
		filterbutton[0].classList.toggle("hidden");
		filterbutton[1].textContent === "更多條件"
			? filterbutton[1].textContent = "確認條件"
			: filterbutton[1].textContent = "更多條件";
		
	}
}



export default List;