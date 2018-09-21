import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import {firebaseApp} from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class Apartments extends React.Component {
	render() {
		return(
		<div>
			Hello! this is apartments page.
			<div><Link to="/">Index</Link></div>
			<div id="googleMap" style={{height: "150px", width: "150px"}}>
      	</div>
		</div>
		)
	}
}

export default Apartments;