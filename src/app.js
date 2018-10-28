import ReactDOM from "react-dom";
import React from "react";
import googleMap from "./GoogleMap.js";
import lib from "./lib.js";
import "firebase/database";
import { firebaseApp } from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Apartments from "./Apartments.js";
import Property from "./Property.js";
import "./style/common.css";
import "./style/index.css";
import "./imgs/close.png";

let firebaseDB = firebaseApp.fBase.database();
const RouterComponent = () => (
  <Router>
  	<div>
      <Route exact path="/" component={App} />
      <Route path="/apartments" component={Apartments} />
      <Route path="/property" component={Property} />
    </div>
  </Router>
);



class App extends React.Component {
  constructor() {
    super();
    this.state = {
      search: "",
      location: [],
      district: []
    };
    googleMap.load.then(()=>{
      googleMap.initAutocomplete(lib.func.get(".form>input"), "index");
      googleMap.addAutocompleteListener(googleMap.autocomplete.index, (place)=>{
        this.props.history.push({
          pathname:"/apartments",
          search: `?search=${place.geometry.location.lat()},${place.geometry.location.lng()}`,
          state: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
        });
      });

    });
  }
  componentDidMount() {
 	    let districts = ["中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區"];
    let districtsAmount = [0,0,0,0,0,0,0,0,0,0,0,0];
    let districtLatLng = [
      {lat: 25.0421407,lng: 121.51987159999999},
      {lat: 25.0627243,lng: 121.51130639999997},
      {lat: 25.0792018,lng: 121.54270930000007},
      {lat: 25.0541591,lng: 121.56386210000005},
      {lat: 25.0261583,lng: 121.54270930000007},
      {lat: 25.0262857,lng: 121.49702939999997},
      {lat: 25.0287024,lng: 121.57695719999992},
      {lat: 25.0950492,lng: 121.52460769999993},
      {lat: 25.1151759,lng: 121.51501800000005},
      {lat: 25.0689422,lng: 121.59090270000002},
      {lat: 25.0312347,lng: 121.61119489999999},
      {lat: 24.9929212,lng: 121.57124999999996}];
    let districtsCombined = [];
    firebaseDB.ref("districts/").once("value",(snapshot)=>{
      console.log(snapshot.val());
      let data = snapshot.val();
      for ( let i = 0 ; i < districts.length ; i ++ ) {
        let districtsAmout = data[districts[i]];
        let districtDetail = [districts[i], districtsAmout, districtLatLng[i]];
        districtsCombined.push(districtDetail);
      }
      this.setState({district: districtsCombined});
    });
  }
  render() {
    return (
      <div className="index">
        	<div className="background"></div>
        <div className="background"></div>
          	<div className="formContainer">
          		<div className="form">
          			<div className="formItem">
          				<div className="snail"></div>
          				<h2>SNAIL HEAVEN</h2>
          			</div>
          			<h2 className="formItem">租房超簡單，大腦零負擔</h2>
          			<input type="text" placeholder="小蝸牛，想找哪裡的房子呢？" onChange={this.searchHandler.bind(this)}/>
          			<div className="districtContainer">
            			{
                this.state.district.map((district, index)=>{
                  return (
                    <div className="district" key={index} onClick={()=>{this.clickDistrict( district[2] );}}>
                      <div className="background"></div>
                      <h2>{district[0]}</h2>
                      <h4>{district[1]} 間夢想租屋</h4>
                    </div>
                  );
                })
              }
          			</div>
          			<div className="formItem close"><Link to="/apartments"></Link></div>
          		</div>
          	</div>
      </div>
    );

  }

  searchHandler(e) {
    if (e.keyCode === 13) {
      this.setState({search: e.currentTarget.value});
    }
  }
  submitSearch(e) {
    if (e.keyCode === 13) {
      this.setState({search: e.currentTarget.value});
    }
  }

  clickDistrict( districtInfo ) {
    let lat = districtInfo.lat;
    let lng = districtInfo.lng;
    this.props.history.push({
      pathname:"/apartments",
      search: `?location=${lat},${lng}`,
      state: {lat: lat, lng: lng}
    });

  }

}

ReactDOM.render(<RouterComponent />, document.querySelector("#RAPP"));
