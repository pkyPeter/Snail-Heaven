import React from "react";
import PropTypes from 'prop-types';
import lib from "./lib.js";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
library.add(faRegularHeart, faBuilding, faBars, faSolidHeart, faRegularBookmark,faSolidBookmark,faTimes);

class Header extends React.Component {
	render () {
		return (
			<header>
				<div className="left">
					<div className="burger" onClick={this.toggleRight.bind(this)}>
						<FontAwesomeIcon className="icon" icon={['fas','bars']}/>
					</div>
					<div className="logo">
						<div className="snail"></div>
						<h2>SNAIL HEAVEN</h2>
					</div>
					<input type="text" placeholder="小蝸牛想住哪？"/>
				</div>
				<div className="right">
					<div className="mobileClose" onClick={this.toggleRight.bind(this)}>
						<FontAwesomeIcon className="icon" icon={['fas','times']}/>
					</div>
					<div className="searchFav">
						<FontAwesomeIcon className="icon" icon={["far","bookmark"]}/>
						<p>儲存搜尋條件</p>
					</div>
					<div className="searchFav" onClick={this.props.goLoveListPage}>
						{ this.props.goLoveList === true 
						    ?<FontAwesomeIcon className="icon" icon={['fas','heart']} style={{ color: 'red' }}/>
						 	:<FontAwesomeIcon className="icon" icon={['far','heart']}/>
						 }
						<p>我的最愛</p>
					</div>
					<div className="postHouse">
						<FontAwesomeIcon className="icon" icon={['far','building']}/>
						<p>提供租屋</p>
						<div className="signButton">登入</div>
					</div>
				</div>
			</header>
		)
	}
	toggleRight(e) {
		let right = lib.func.get("header>.right");
		let searchFav = lib.func.getAll("header>.right>.searchFav"); 
		let postHouse = lib.func.get("header>.right>.postHouse");
		console.log(right);
		if (right.style.display === "flex") {
			for ( let i = 0 ; i < searchFav.length ; i ++ ) {
				searchFav[i].style.display = "none";
			}
			postHouse.style.display = "none";
			right.style.width = "0%";
			setTimeout(()=>{right.style.display = "none";}, 300)
			

		} else {
			right.style.display = "flex";
			setTimeout(()=>{
				right.style.width = "65%";
			}, 10)
			setTimeout(()=>{
				for ( let i = 0 ; i < searchFav.length ; i ++ ) {
					searchFav[i].style.display = "flex";
				}
				postHouse.style.display = "flex";
			}, 300)
		}
	}
}




export default Header;
