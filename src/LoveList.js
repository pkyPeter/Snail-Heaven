import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faRegularHeart, faThumbsDown, faEnvelope, faSearch, faCaretLeft);

const LoveList = props => {
	console.log(props.resultAreaDisplayType);
	console.log(props.loveListDetail);
	return  (
		<div className="right">
			<div className="areaSizer" draggable="true" onDrag={props.changeAreaSize} onDragEnd={props.changeAreaSize}></div>
			<div className="favTitle">
				<div className="return" onClick={props.goLoveListPage}>							
					<FontAwesomeIcon className="icon" icon={['fas','long-arrow-alt-left']}/>
					<div>回到搜尋結果</div>
				</div>
				<div className="title">共{props.loveListDetail.length}個喜愛標的</div>
			</div>
			<div className={props.resultAreaDisplayType[0]}>
				{
					props.loveListDetail.map((realEstate, index)=>{		
						let monthly_price = realEstate.monthly_price.split(".")[0];
						let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
						let daily_price_pureN = daily_price.toLocaleString("en");
						let loveListStatusIndex = props.getloveListStatusIndex(realEstate.id, props.loveListStatus);
						return(
								<div className={props.resultAreaDisplayType[1]} onClick={(e)=>{props.goSimpleDetail(realEstate.id,realEstate)}} key={index}>
									<div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
									<div className="description">
									<div className="priceGesture absolute" onClick={props.stopPropagation}>
										<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
										<div className="gesture">
											{ props.loveListStatus != undefined && props.loveListStatus[loveListStatusIndex].inList === true ? <FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} onClick={(e)=>{ props.removeFromLoveList(e, realEstate.id, realEstate) }}/>
												: <FontAwesomeIcon className="icon" icon={['far','heart']} onClick={(e)=>{ props.putIntoLoveList(e, realEstate.id, realEstate) }}/>}
											<FontAwesomeIcon className="icon" icon={['far','envelope']}/>
											<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
										</div>
									</div>
									<p>{realEstate.bedrooms}rooms {realEstate.room_type}</p>
									<p>{realEstate.neighbourhood_cleansed}</p>
									<p className="updateTime">2天前</p>
									</div>
								</div>		
						)
					})
				}
			</div>
		</div>
	)	
}


export default LoveList;



