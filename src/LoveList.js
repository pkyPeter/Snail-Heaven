import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
import RoomPreviewCard from "./RoomPreviewCard.js"
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
// import { faHeart as faRegularHeart, faThumbsDown, faEnvelope } from '@fortawesome/free-regular-svg-icons';
// import { faSearch, faCaretLeft, faListUl, faThLarge, faSquare } from "@fortawesome/free-solid-svg-icons";
// library.add(faRegularHeart, faThumbsDown, faEnvelope, faSearch, faCaretLeft, faListUl, faThLarge, faSquare);

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
					})
				}
			</div>
		</div>
	)
}


export default LoveList;
