import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import {firebaseApp} from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Header from "./Header.js";
import List from "./listPage.js"
import lib from "./lib.js";
// import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import "./style/likeList.css";


class Apartments extends React.Component {
	constructor() {
	    super();	
	    this.state = {
	    	resultAreaDisplayType: ["resultArea","results"],
	    	goLoveList: true
	    };
  	}
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
			<Header goLoveListPage={this.goLoveList.bind(this)}/>
			<List goLoveList={this.state.goLoveList}
			resultAreaDisplayType={this.state.resultAreaDisplayType}
			changeAreaSize={this.changeAreaSize.bind(this)} 
			changeToList={this.changeToList.bind(this)}
			changeToRowBlocks={this.changeToRowBlocks.bind(this)}
			changeToBlocks={this.changeToBlocks.bind(this)}/>
		</div>
		)
	}
	changeAreaSize(e) {
		let left = document.querySelector(".apartments>section>.left");
		let right = document.querySelector(".apartments>section>.right");
		let resizer = document.querySelector(".apartments>section>.right>.areaSizer ");
		if ( e.type === "drag" && e.clientX != 0 && window.innerWidth - e.clientX >= 600) {
				left.style.width = e.clientX;
				right.style.width = window.innerWidth - e.clientX;
				resizer.style.right = window.innerWidth - e.clientX;	
		}
		if ( e.type === "dragend") {
			if (( window.innerWidth - e.clientX ) >= 600 ) {
				left.style.width = e.clientX;
				right.style.width = window.innerWidth - e.clientX;
				resizer.style.right = window.innerWidth - e.clientX;
			} else {
				left.style.width = `calc(100% - 600px)`;
				right.style.width = `600px`;
				resizer.style.right = "600px";
			}
		} 
	}
	changeToList(e) {
		//先移除RowBlocks的class，再把自己的放進去
		lib.func.toggleClass("remove",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsFlex"]);	
		lib.func.toggleClass("toggle",".resultArea>.results", ["resultsList"]);	
		this.setState({resultAreaDisplayType: ["resultArea","results resultsList"]});
	}	
	changeToRowBlocks(e) {
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsList"]);
		lib.func.toggleClass("toggle",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("toggle",".resultArea>.results", ["resultsFlex"]);
		this.setState({resultAreaDisplayType: ["resultArea resultAreaFlex","results resultsFlex"]});	
	}	
	changeToBlocks(e) {
		lib.func.toggleClass("remove",".resultArea", ["resultAreaFlex"]);
		lib.func.toggleClass("remove",".resultArea>.results", ["resultsFlex", "resultsList"]);	
		this.setState({resultAreaDisplayType: ["resultArea","results"]});
	}
	goLoveList(e) {
		this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
	}
}

export default Apartments;

