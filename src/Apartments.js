import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import {firebaseApp} from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import { bedroom } from "./imgs/bedroom.jpg";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faListUl} from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

library.add(faRegularHeart, faBookmark, faBuilding, faSave, faListUl, faThLarge, faSquare, faThumbsDown
,faEnvelope);
console.log(fas);

class Apartments extends React.Component {
	// componentDidMount() {
	// 	googleMap.load.then(
	// 		()=>{
	// 		console.log("SUCCESS");
	// 		googleMap.init.initMap(12,25.0484402,121.5278391,"googleMap");
	// 		}
	// 	).catch(()=>{alert('WRONG!')})
	// }
	render() {
		return(
		<div className="apartments">
			<header>
				<div className="left">
					<div className="logo">
						<div className="snail"></div>
		  				<h2>SNAIL HEAVEN</h2>
					</div>
					<input type="text" placeholder="小蝸牛，想住哪？"/>
				</div>
				<div className="right">
					<div className="searchFav">
						<FontAwesomeIcon className="icon" icon={["far","bookmark"]}/>
						<p>儲存搜尋條件</p>
					</div>
					<div className="searchFav">
						<FontAwesomeIcon className="icon" icon={['far','heart']}/>
						<p>我的最愛</p>
					</div>
					<div className="postHouse">
						<FontAwesomeIcon className="icon" icon={['far','building']}/>
						<p>提供租屋</p>
						<div className="signButton">登入</div>
					</div>
				</div>
			</header>
			<section>
				<div className="left">
					<div id="googleMap" style={{height: "100%", width: "100%"}}></div>	
				</div>
				<div className="right">
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
							<div className="button">更多條件</div>
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
							<div className="displayType"><FontAwesomeIcon icon={['fas','list-ul']}/></div>
							<div className="displayType"><FontAwesomeIcon icon={['fas','th-large']}/></div>
							<div className="displayType"><FontAwesomeIcon icon={['fas','square']}/></div>
						</div>
					</div>
					<div className="resultArea">
						<div className="results">
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
								<p class="updateTime">2天前</p>
							</div>
						</div>
						<div className="results">
							<div className="img"></div>
							<div className="description"></div>
						</div>
						<div className="results">
							<div className="img"></div>
							<div></div>
						</div>

					</div>
				</div>
			</section>
		</div>
		)
	}
}

export default Apartments;

