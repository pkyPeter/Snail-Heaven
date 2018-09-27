import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";

//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

//FontAwesome引用圖片
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faLongArrowAltLeft,faShareAlt,faRegularHeart,faThumbsDown,faCaretRight
,faCaretLeft);

const SimpleDetail = props => {
	return (
		<div className="right">
			<div className="areaSizer" draggable="true" onDrag={props.changeAreaSize} onDragEnd={props.changeAreaSize}></div>
			<div className="sdTitle">
				<div className="button return" onClick={props.goSimpleDetail}>							
					<FontAwesomeIcon className="icon" icon={['fas','long-arrow-alt-left']}/>
					<div>回到搜尋結果</div>
				</div>
				<div className="sdRight">
					<div className="button">							
						<FontAwesomeIcon className="icon" icon={['fas','share-alt']}/>
						<div>分享</div>
					</div>
					<div className="button">							
						<FontAwesomeIcon className="icon" icon={['far','heart']}/>
						<div>收藏</div>
					</div>
					<div className="button">							
						<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
						<div>不想再見</div>
					</div>
				</div>
			</div>

			<div className="photoGallery">
				<div className="gallery">
					<div className="photos">
						<div className="photo"></div>
					</div>
					<div className="leftSelector">
						<FontAwesomeIcon className="icon" icon={['fas','caret-left']}/>
					</div>
					<div className="rightSelector">
						<FontAwesomeIcon className="icon" icon={['fas','caret-right']}/>
					</div>
				</div>
				<div className="dotSelector">
					<button className="dot focus"></button>
					<button className="dot"></button>
					<button className="dot"></button>
					<button className="dot"></button>
					<button className="dot"></button>
					<button className="dot"></button>
					<button className="dot"></button>
					<button className="dot"></button>
				</div>
			</div>
			<div className="priceAddress">
				<div className="price">$3,000</div>
				<span></span>
				<div className="address">
					<div className="cityDist">台北市文山區</div>
					<div className="street">新光路二段三十三號</div>
				</div>
			</div>
			<div className="checkAvailable">立即詢問</div>
			<div className="description">
				<div className="title">房屋概述</div>
				<div className="content">"私人衛浴大套房,距南京復興站走路2分鐘。面對7-11便利商店,旁邊就是南京微風百貨和IKEA.  小巨蛋過馬路就到。 洗脫烘衣機免費使用。機場有公車直達!"</div>
			</div>
				
			<div className="time">
				<div className="title">更新時間</div>
				<div className="content">2018-08-31</div>
			</div>
			<div className="Amenities">
				<div className="title">房屋設備</div>
				<div className="content">
					<div className="amenity">洗碗機</div>
					<div className="amenity">木頭地板</div>
					<div className="amenity">洗衣機</div>
					<div className="amenity">電視機</div>	
					<div className="amenity">木頭地板</div>
					<div className="amenity">洗衣機</div>
					<div className="amenity">電視機</div>
				</div>
			</div>
			<div className="streetViewMap">
			</div>
			<div className="moreInfo" onClick={props.goPropertyPage}>更多詳細資訊</div>			
		</div>
	)
}

export default SimpleDetail;