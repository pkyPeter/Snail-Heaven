import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import RoomPreviewCard from "./RoomPreviewCard.js"
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart, faThumbsDown, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSearch, faCaretLeft, faListUl, faThLarge, faSquare } from "@fortawesome/free-solid-svg-icons";
library.add(faRegularHeart, faThumbsDown, faEnvelope, faSearch, faCaretLeft, faListUl, faThLarge, faSquare);

const LoveList = props => {
	return  (
		<div className="right" style={{width: props.leftRightWidth.rightWidth}}>
			<div className="areaSizer" draggable="true" onDrag={props.changeAreaSize} onDragEnd={props.changeAreaSize} style={{right: props.leftRightWidth.resizerRight}}></div>
			<div className="favTitle">
				<div className="return" onClick={props.goLoveListPage}>							
					<FontAwesomeIcon className="icon" icon={['fas','long-arrow-alt-left']}/>
					<div>回到搜尋結果</div>
				</div>
				<div className="title">
					<div className="displayLogic">
						<div className="displayType" onClick={()=>{props.switchDisplayMode("list")}}><FontAwesomeIcon icon={["fas","list-ul"]}/></div>
						<div className="displayType" onClick={()=>{props.switchDisplayMode("rowBlocks")}}><FontAwesomeIcon icon={["fas","th-large"]}/></div>
						<div className="displayType" onClick={()=>{props.switchDisplayMode("blocks")}}><FontAwesomeIcon icon={["fas","square"]}/></div>
				</div>
				<div>已收藏{props.loveListDetail.length}個</div>
				</div>
			</div>
			<div className={props.resultAreaDisplayType[0]}>
				{
					props.loveListDetail.map((realEstate, index)=>{		
						// let monthly_price = realEstate.monthly_price.split(".")[0];
						// let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
						// let daily_price_pureN = daily_price.toLocaleString("en");
						// let monthly_price = realEstate.monthly_price.toLocaleString("en");
						// let loveListStatusIndex = props.getloveListStatusIndex(realEstate.id, props.loveListStatus);
						// let roomType;
						// switch(realEstate.room_type) {
						// 	case "EHA":
						// 	roomType = "整層住家";
						// 	case "PR":
						// 	roomType = "獨立套房";
						// 	case "SR":
						// 	roomType = "分租套房";
						// }
						// console.log(index ,loveListStatusIndex);
						// console.log(index ,props.loveListStatus)
						return (
		                  <RoomPreviewCard 
		                    key={index}
		                    realEstate = { realEstate }
		                    resultAreaDisplayType = {props.resultAreaDisplayType}
		                    changeSelecteIndex = {props.changeSelecteIndex}
		                    removeFromLoveList = {props.removeFromLoveList}
		                    putIntoLoveList = {props.putIntoLoveList}
		                    loveListStatus = {props.loveListStatus}
		                    getloveListStatusIndex={props.getloveListStatusIndex}
		                    openEmailForm = {props.openEmailForm}
		                    hideList = {props.hideList}
		                  />
						)
						// return(
						// 		<div className={props.resultAreaDisplayType[1]} onClick={(e)=>{ props.changeSelecteIndex("add",loveListStatusIndex); }} key={index}>
						// 			<div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
						// 			<div className="description">
						// 			<div className="priceGesture absolute" onClick={props.stopPropagation}>
						// 				<div className="price">{ "$" + monthly_price }</div>
						// 				<div className="gesture">
						// 					{ props.loveListStatus != undefined && props.loveListStatus[loveListStatusIndex].inList === true ? <FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} onClick={(e)=>{ props.removeFromLoveList(e, realEstate.id, realEstate) }}/>
						// 						: <FontAwesomeIcon className="icon" icon={['far','heart']} onClick={(e)=>{ props.putIntoLoveList(e, realEstate.id, realEstate) }}/>}
						// 					<FontAwesomeIcon className="icon" icon={['far','envelope']} onClick={(e)=>{ 					props.openEmailForm("",realEstate.id)}}/>
						// 					<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
						// 				</div>
						// 			</div>
						// 			<p>{realEstate.bedrooms} 間房間 · {realEstate.bathrooms} 間廁所 · {roomType}</p>
						// 			<p>{realEstate.district || realEstate.neighbourhood_cleansed}</p>
						// 			<p className="updateTime">2天前</p>
						// 			</div>
						// 		</div>		
						// )
					})
				}
			</div>
		</div>
	)	
}


export default LoveList;



