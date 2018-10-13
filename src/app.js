import ReactDOM from "react-dom";
import React from "react";
import googleMap from "./GoogleMap.js";
import lib from "./lib.js"
import 'firebase/database';
import { firebaseApp } from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Apartments from "./Apartments.js";
import Property from "./Property.js";
import "./style/common.css"
import "./style/index.css"

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
      console.log("map loaded")
      googleMap.initAutocomplete(lib.func.get('.form>input'), "index");
      googleMap.addAutocompleteListener(googleMap.autocomplete.index, (place)=>{
          console.log(place);
          this.props.history.push({
          pathname:"/apartments",
          search: `?search=${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        }) 
      });

    });
  }
  componentDidMount() {
      // googleMap.load.then(()=>{
      //   googleMap.geocode("中正區", (results) => {
      //     console.log(results)
      //     console.log(results[0].geometry.bounds)
      //     console.log(results[0].geometry.location)
      //     console.log(results[0].geometry.location.lat())
      //     console.log(results[0].geometry.location.lng())
      //     console.log(results[0].geometry.viewport)
      //     console.log(results[0].geometry.viewport.getSouthWest())
      //     console.log(results[0].geometry.viewport.getSouthWest().lat())
      //     console.log(results[0].geometry.viewport.getSouthWest().lng())
      //     console.log(results[0].geometry.viewport.getNorthEast())          
      //     console.log(results[0].geometry.bounds)
      //     console.log(results[0].geometry.toJSON())
      //   });
      // })
 	    let districts = ["中正區","大同區","中山區","松山區","大安區","萬華區","信義區","士林區","北投區","內湖區","南港區","文山區"]; 
      let districtsAmount = [0,0,0,0,0,0,0,0,0,0,0,0];
      let districtsCombined = [];
      firebaseDB.ref("listings/").orderByChild("neighbourhood_cleansed").once('value',(snapshot)=>{
        let data = snapshot.val();
        for(let i = 0 ; i < data.length ; i++ ) {
          for (let j = 0 ; j < districts.length ; j++ ) {
            if ( data[i].neighbourhood_cleansed === districts[j] ) {
              districtsAmount[j] = districtsAmount[j]+1;
            }
          }
        }
        for (let i = 0; i < districts.length; i++) {
          let combineStuff = [districts[i],districtsAmount[i]];
          districtsCombined.push(combineStuff);
        }
          console.log(districtsCombined);
          console.log(districtsAmount);
          this.setState({district: districtsCombined});
      })

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
          			<input type="text" placeholder="小蝸牛，想找哪裡的房子呢？" onChange={this.searchHandler.bind(this)} onKeyDown={this.submitSearch.bind(this)}/>
          			<div className="districtContainer">
            			{
                    this.state.district.map((district, index)=>{
                      return (
                      <div className="district" key={index} onClick={(e)=>{this.clickDistrict(e, district[0])}}>
                        <div className="background"></div>
                        <h2>{district[0]}</h2>
                        <h4>{district[1]}間夢想租屋</h4>
                      </div>
                      )
                    })
                  }

          			</div>
          			<div className="formItem"><Link to="/apartments">Apartments Page</Link></div>
          		</div>
          	</div>     	
        </div>
        )

  }

  searchHandler(e) {
    // console.log(e.currentTarget);
    // console.log(e.keyCode);
    // console.log(e.currentTarget.value);
    if (e.keyCode === 13) {
      console.log('enter key press');
      this.setState({search: e.currentTarget.value});
    }
  }
  submitSearch(e) {
    console.log(e.target);
    console.log(e.currentTarget.value);
    console.log(e.keyCode);
    if (e.keyCode === 13) {
      console.log('enter key press');
      this.setState({search: e.currentTarget.value});

      // this.props.history.push("/apartments?position=" + e.target.value);
    }
  }

  clickDistrict(e, districtName) {
    console.log(e.target);
    console.log(districtName);
    googleMap.geocode(districtName, (results) => {
      console.log(results[0].geometry.location);
      let SWLat = results[0].geometry.viewport.getSouthWest().lat();
      let SWLng = results[0].geometry.viewport.getSouthWest().lng();
      let NELat = results[0].geometry.viewport.getNorthEast().lat();
      let NELng = results[0].geometry.viewport.getNorthEast().lng(); 
      let locationLat = results[0].geometry.location.lat();
      let locationLng = results[0].geometry.location.lng();
      // this.props.history.push("/apartments?location=" + locationLat + "," + locationLng)
      this.props.history.push({
        pathname:"/apartments",
        search: `?location=${locationLat},${locationLng}`,
        state: {detail: 123}
      }) 
      // this.props.history.push("/?view="+SWLat+","+SWLng+","+NELat+","+NELng)         
    });
    
  }

}; 

ReactDOM.render(<RouterComponent />, document.querySelector("#RAPP"));
