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
//Fontawesome設備區
import { faHotTub } from '@fortawesome/free-solid-svg-icons';
import { faSnowflake } from '@fortawesome/free-regular-svg-icons';

library.add(faHotTub,faSnowflake);


const SimpleDetail = props => {
	console.log(props.currentSimpleDetail);
	let monthly_price = props.currentSimpleDetail.monthly_price.split(".")[0];
	let daily_price = parseInt(props.currentSimpleDetail.price.split(".")[0].split("$")[1].replace(",",""))*30;
	let daily_price_pureN = daily_price.toLocaleString("en");
	let amenities = sortOutAmenities(props.currentSimpleDetail.amenities,[/Internet/ig, /Hot water/ig, /Air conditioning/ig, /Refrigerator/ig,/Laptop friendly workspace/ig,  /washer/ig, /Pets allowed/ig]);
	let otherAmenities = sortOutAmenities(props.currentSimpleDetail.amenities,[/Kitchen/ig,/Paid parking off premises/ig, /Free street parking/ig, /Elevator/ig, /Gym/ig]);
	let TV = sortOutAmenities(props.currentSimpleDetail.amenities, [/TV/ig]).length === 2 ? ["TV", "Cable TV"] : ["TV"];//因為電視無法拆解
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
						{ props.loveListStatus != undefined && props.loveListStatus[props.currentSimpleDetail.index].love === true ? <FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} onClick={(e)=>{ props.removeFromLoveList(e, currentSimpleDetail.index, realEstate) }}/>
						: <FontAwesomeIcon className="icon" icon={['far','heart']} onClick={(e)=>{ props.putIntoLoveList(e, currentSimpleDetail.index, realEstate) }}/>}
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
						<div className="photo" style={{backgroundImage: `url(${props.currentSimpleDetail.picture_url})`}}></div>
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
				<div className="price">{monthly_price != "" ? monthly_price : "$"+daily_price_pureN }</div>
				<span></span>
				<div className="address">
					<div className="cityDist">台北市{props.currentSimpleDetail.neighbourhood_cleansed}</div>
					<div className="street">新光路二段三十三號</div>
				</div>
			</div>
			<div className="checkAvailable">立即詢問</div>
			<div className="description">
				<div className="title">房屋概述</div>
				<div className="content">{props.currentSimpleDetail.summary}</div>
			</div>
			{	props.currentSimpleDetail.transit != "" && (
					<div className="description">
						<div className="title">周邊交通</div>
						<div className="content">{props.currentSimpleDetail.transit}</div>
					</div>
				)
			}

			<div className="time">
				<div className="title">更新時間</div>
				<div className="content">{props.currentSimpleDetail.calendar_updated}</div>
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
				<div className="title">其他設備</div>
				<div className="content">
					{
						otherAmenities.map((amenity, index)=>{
							if ( amenity === "Kitchen") { amenity = "廚房" }
							if ( amenity === "Gym") { amenity = "健身房" }
							if ( amenity === "Elevator") { amenity = "電梯" }
							if ( amenity === "Paid parking off premises") { amenity = "付費停車場" }
							if ( amenity === "Free street parking") { amenity = "周邊有路邊停車格" }
							return(<div className="amenity" key={index}>{amenity}</div>)
						})
					}
					
				</div>
			</div>
			<div className="streetViewMap">
			</div>
			<div className="moreInfo" onClick={props.goPropertyPage}>更多詳細資訊</div>			
		</div>
	)
}

function sortOutAmenities ( data, ruleArray) {
	let amenities = [];
	for (let i = 0; i<ruleArray.length; i++) {
		let amenity = data.match(ruleArray[i]);
		if (amenity != null) {
			amenities = [...amenities, ...amenity];
		}	
	}
	return amenities;
}

export default SimpleDetail;