import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header.js";
import "./style/common.css";
import "./style/header.css";
import "./style/Property.css";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faRegularHeart,faSolidHeart,faShareAlt, faCaretLeft);


class Property extends React.Component {
	constructor() {
		super();
		this.state = {
	    	goLoveList: false,
	    	toggleSimpleDetail: false
	    };
	}
	render() {
		return(
			<div className="properties">
				<Header goLoveListPage={this.goLoveList.bind(this)}/>
				<section className="property">
					<div className="propTitle">
						<div className="button">							
							<FontAwesomeIcon className="icon" icon={['fas','caret-left']}/>
							<div>回到搜尋結果</div>
						</div>
						<div className="sdRight">
							<div className="button">							
								<FontAwesomeIcon className="icon" icon={['fas','share-alt']}/>
								<div>分享</div>
							</div>
							<div className="button">							
								<FontAwesomeIcon className="icon" icon={['far','heart']}/>						
								<div>加入我的最愛</div>
							</div>
						</div>
					</div>
					<div className="propContent">
						<div className="left">
							<div className="name">黑白雙人房@南京復興站。小巨蛋斜對面。溫泉式浴缸。</div>
							<div className="address">110台北市信義區基隆路一段178號</div>
							<div className="checkAvailable">立即詢問</div>
							<div className="propGraphicInfo">
								<div className="tabs">
									<div className="tab active">照片</div>
									<div className="tab">地圖</div>
									<div className="tab">街景</div>
								</div>
								<div className="graphics">
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
										<div className="photoSelector">
											<div className="selector focus"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
											<div className="selector"></div>
										</div>
									</div>
									<div className="map"></div>
									<div className="streetView"></div>
								</div>
							</div>
							<div className="description">
							"私人衛浴大套房,距南京復興站走路2分鐘。面對7-11便利商店,旁邊就是南京微風百貨和IKEA. 小巨蛋過馬路就到。 洗脫烘衣機免費使用。機場有公車直達!"
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
						</div>
						<div className="right">
							<div className="profile">
								<div className="avatar"></div>
								<div className="description">
									<div className="title">Posted by:</div>
									<div className="name">Peter Pan PKY</div>
								</div>
							</div>
							<div className="checkAvailable">立即詢問</div>
							<div className="flag">檢舉這個物件</div>
						</div>
					</div>
					<div className="footer">
						&copy;
					</div>
				</section>
			</div>
		)
	}

	goLoveList(e) {
		this.props.history.push("/apartments?loveList");
	}
}

export default Property;