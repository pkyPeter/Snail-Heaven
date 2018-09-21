import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import { firebaseApp } from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Apartments from "./Apartments.js";
import "./style/common.css"
import "./style/index.css"



const RouterComponent = () => (
  <Router>	
  	<div>
      <Route exact path="/" component={App} />
      <Route path="/apartments" component={Apartments} />
    </div>		
  </Router>
);



class App extends React.Component {
    constructor() {
    super();	
    this.state = {
    	search: "",
        location: []
    };
  	firebaseApp.fBaseDB.getListing(data => {
		console.log(data);
		let location =[];
		for(let i = 0; i < data.length; i++ ) {
			let laAndLong = {latitude:"", longitude:""};
			laAndLong.latitude = data[i].latitude;
			laAndLong.longitude = data[i].longitude;
			location.push(laAndLong);
		}
			this.setState({location: location});
	}) 
  }
  componentDidMount() {
 	
  }
  render() {
    return (
    <div className="index">
    	<div className="background"></div>
      	<div className="formContainer">
      		<div className="form">
      			<div className="formItem">
      				<div className="snail"></div>
      				<h2>Snail Heaven</h2>
      			</div>
      			<h2 className="formItem">租房超簡單，大腦零負擔</h2>
      			<input type="text" placeholder="小蝸牛，想找哪裡的房子呢？"/>
      			<div className="districtContainer">
					<div className="district">
						<div className="background"></div>
						<h2>信義區</h2>
						<h4>35間夢想租屋</h4>
					</div>
      			</div>
      			<div className="formItem"><Link to="/apartments">Apartments Page</Link></div>
      		</div>
      	</div>     	
    </div>
    )
  }
}; 

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('googleMap'), {
	  center: {lat: -34.397, lng: 150.644},
	  zoom: 8
	});
}




ReactDOM.render(<RouterComponent />, document.querySelector("#RAPP"));
