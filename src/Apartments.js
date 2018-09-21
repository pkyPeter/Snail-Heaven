import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import {firebaseApp} from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
library.add(faRegularHeart, faBookmark, faBuilding);


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
					<div className="title"></div>
					<div className="filterArea">
						<div className="filterType">
							<p></p>
							<div className="filterDetail"></div>
						</div>
						<div className="filterType">

						</div>
						<div className="filterType">

						</div>
						<div className="filterType">

						</div>
					</div>
				</div>
			</section>
		</div>
		)
	}
}

export default Apartments;



