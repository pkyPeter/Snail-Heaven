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
import { faThumbsDown as faRegularThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faThumbsDown as faSolidThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
library.add(faLongArrowAltLeft,faShareAlt,faRegularHeart,faRegularThumbsDown,
faSolidThumbsDown,faCaretRight
,faCaretLeft);
//Fontawesome設備區
import { faHotTub } from '@fortawesome/free-solid-svg-icons';
import { faSnowflake } from '@fortawesome/free-regular-svg-icons';

library.add(faHotTub,faSnowflake);


const SimpleDetail = props => {
	console.log(props.currentSimpleDetail.id);
	console.log(props.selectedIndex);
	if ( props.currentSimpleDetail != null ) {
		let monthly_price = props.currentSimpleDetail.monthly_price.split(".")[0];
			let daily_price = parseInt(props.currentSimpleDetail.price.split(".")[0].split("$")[1].replace(",",""))*30;
			let daily_price_pureN = daily_price.toLocaleString("en");
			let amenities = sortOutAmenities(props.currentSimpleDetail.amenities,[/Internet/ig, /Hot water/ig, /Air conditioning/ig, /Refrigerator/ig,/Laptop friendly workspace/ig,  /washer/ig, /Pets allowed/ig]);
			let otherAmenities = sortOutAmenities(props.currentSimpleDetail.amenities,[/Kitchen/ig,/Paid parking off premises/ig, /Free street parking/ig, /Elevator/ig, /Gym/ig]);
			let TV = sortOutAmenities(props.currentSimpleDetail.amenities, [/TV/ig]).length === 2 ? ["TV", "Cable TV"] : ["TV"];//因為電視無法拆解
			let loveListStatusIndex = props.getloveListStatusIndex(props.currentSimpleDetail.id, props.loveListStatus);
			return (
				<div className="right" style={{width: props.leftRightWidth.rightWidth}}>
					<div className="areaSizer" draggable="true" onDrag={props.changeAreaSize} onDragEnd={props.changeAreaSize} style={{right: props.leftRightWidth.resizerRight}}></div>
					<div className="sdTitle">
						<div className="button return" 
						onClick={
						(e)=>{
						props.goSimpleDetail("back",{}); 
						props.selectedIndex !== -1 &&
						props.removeSelectedIndex(props.selectedIndex)}}
						>							
							<FontAwesomeIcon className="icon" icon={['fas','long-arrow-alt-left']}/>
							<div>回到搜尋結果</div>
						</div>
						<div className="sdRight">
							<div className="button">							
								<FontAwesomeIcon className="icon" icon={['fas','share-alt']}/>
								<div>分享</div>
							</div>						
							{ 
								props.loveListStatus != undefined && props.loveListStatus[loveListStatusIndex].inList === true 
								? (
								<div className="button" onClick={(e)=>{ props.removeFromLoveList(e, props.currentSimpleDetail.id, props.currentSimpleDetail) props.recordCurrentStatus}}>
									<FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }} />
									<div>收藏</div>
								</div>
								)
								: (
								<div className="button" onClick={(e)=>{ props.putIntoLoveList(e, props.currentSimpleDetail.id, props.currentSimpleDetail) }}>
									<FontAwesomeIcon className="icon" icon={['far','heart']}/>
									<div>收藏</div>
								</div>
								)
							}
							<div className="button" onClick={(e)=>{
								console.log('hidden');
								props.hideList(e, props.currentSimpleDetail.id, props.currentSimpleDetail.index)}}>							
								<FontAwesomeIcon className="icon" icon={['far','thumbs-down']}/>
								<div>不想再見</div>
							</div>
						</div>
					</div>

					<div className="photoGallery">
						<div className="gallery">
							<div className="photos">
								<div className="photo" style={{backgroundImage: `url(${props.currentSimpleDetail.picture_url})`} }></div>
								<div className="photo" style={{backgroundImage: `url("https://a0.muscache.com/im/pictures/8824698/31a49dd7_original.jpg?aki_policy=large")`}}></div>
								<div className="photo" style={{backgroundImage: `url("https://a0.muscache.com/im/pictures/10794157/4b52b591_original.jpg?aki_policy=large")`}}></div>
							</div>
							<div className="leftSelector" onClick={(e)=>{changePhoto(e, "leftSelector");}}>
								<FontAwesomeIcon className="icon" icon={['fas','caret-left']} onClick={(e)=>{changePhoto(e, "leftSelector"); stopPropagation(e);}}/>
							</div>
							<div className="rightSelector" onClick={(e)=>{changePhoto(e , "rightSelector");}}>
								<FontAwesomeIcon className="icon" icon={['fas','caret-right']} onClick={(e)=>{changePhoto(e , "rightSelector"); stopPropagation(e);}}/>
							</div>
						</div>
						<div className="dotSelector">
							<button className="dot focus" data-order="0" onClick={(e)=>{changePhoto(e, "dot");}}></button>
							<button className="dot" data-order="1" onClick={(e)=>{changePhoto(e, "dot");}}></button>
							<button className="dot" data-order="2" onClick={(e)=>{changePhoto(e, "dot");}}></button>
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
					<div className="checkAvailable" onClick={props.openEmailFrom}>立即詢問</div>
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
									switch (amenity) {
										case "Internet": amenity = "網路"; break;
										case "Hot water": amenity = "熱水器"; break;
										case "Air conditioning": amenity = "冷氣"; break;
										case "Refrigerator": amenity = "冰箱"; break;
										case "Laptop friendly workspace": amenity = "書桌/工作區"; break;
										case "Washer": amenity = "洗衣機"; break;
										case "Pets allowed": amenity = "可養寵物"; break;
									}

									return(<div className="amenity" key={index}>{amenity}</div>)
								})
							}
						</div>
						<div className="title">其他設備</div>
						<div className="content">
							{
								otherAmenities.map((amenity, index)=>{
									switch (amenity) {
										case "Kitchen": amenity = "廚房"; break;
										case "Gym": amenity = "健身房"; break;
										case "Elevator": amenity = "電梯"; break;
										case "Paid parking off premises": amenity = "付費停車場"; break;
										case "Free street parking": amenity = "周邊有路邊停車格"; break;
									}
									return(<div className="amenity" key={index}>{amenity}</div>)
								})
							}
							
						</div>
					</div>
					<div className="streetViewMap">
					</div>
					<div className="moreInfo" onClick={ (e)=>{props.goPropertyPage(e, props.currentSimpleDetail.id)} }>更多詳細資訊</div>
				</div>
			)
	} else {
		return <div></div>
	}


}

function stopPropagation(e) {
	e.stopPropagation();
	e.nativeEvent.stopImmediatePropagation();
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

function changePhoto(e, target) {

	let photoArray = lib.func.getAll(".photos>.photo");
	let dotArray = lib.func.getAll(".dotSelector>.dot");
	let dotFocus = lib.func.get(".dotSelector>.focus");
	console.log(dotFocus);
	console.log(dotFocus.dataset.order);
	// 這邊做的是
	if ( target === "dot" ) {
		let dotFocusOrder = parseInt(dotFocus.dataset.order);
		let eTargetOrder = parseInt(e.target.dataset.order);
		for ( let j = eTargetOrder ; j< dotArray.length; j++) {
			photoArray[j].style.left = "100%";
		}
		for ( let j = eTargetOrder ; j> -1; j--) {
			photoArray[j].style.left = "-100%";
		}
		photoArray[eTargetOrder].style.left = "0";
		e.target.classList.toggle("focus");
		dotFocus.classList.toggle("focus");
	} else {
		let order = parseInt(dotFocus.dataset.order);
		if (target === "leftSelector") {
			if ( order > 0 ) {
				photoArray[order].style.left = "100%";
				photoArray[order-1].style.left = "0%";
				dotArray[order].classList.toggle("focus");
				dotArray[order-1].classList.toggle("focus");
			}
		}
		if (target === "rightSelector")	{
			if ( order < photoArray.length-1 ) {
				photoArray[order].style.left = "-100%";
				photoArray[order+1].style.left = "0%";
				dotArray[order].classList.toggle("focus");
				dotArray[order+1].classList.toggle("focus");
			}
		}
		// for (let i = 0 ; i < photoArray.length; i++) {
		// 	let left = parseInt( lib.func.getStyle(photoArray[i],"left") );
		// 	if ( target === "leftSelector" ) {
		// 		if ( left === 0 && i > 0 ) {
		// 			photoArray[i].style.left = "100%";
		// 			photoArray[i-1].style.left = "0%";
		// 			dotArray[i].classList.toggle("focus");
		// 			dotArray[i-1].classList.toggle("focus");
		// 		}
		// 	}
		// 	if ( target === "rightSelector" ) {
		// 		if ( left === 0 && i < photoArray.length-1 ) {
		// 			photoArray[i].style.left = "-100%";
		// 			photoArray[i+1].style.left = "0%";
		// 			dotArray[i].classList.toggle("focus");
		// 			dotArray[i+1].classList.toggle("focus");
		// 		}
		// 	}
		// }
	}
}



export default SimpleDetail;