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
library.add(faRegularHeart, faThumbsDown, faEnvelope, faSearch);

const LoveList = props => {
	console.log(props.resultAreaDisplayType);
	return  (
		<div className="right">
			<div className="areaSizer" draggable="true" onDrag={props.changeAreaSize} onDragEnd={props.changeAreaSize}></div>
			<div className="favTitle">
				<div className="return">							
					<FontAwesomeIcon className="icon" icon={['fas','search']}/>
					<div>回到搜尋結果</div>
				</div>
				<div className="title">共５個喜愛標的</div>
			</div>
			<div className={props.resultAreaDisplayType[0]}>
				<div className={props.resultAreaDisplayType[1]}>
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
	)	
}


export default LoveList;



