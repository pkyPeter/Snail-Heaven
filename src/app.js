import ReactDOM from "react-dom";
import React from "react";
import 'firebase/database';
import { firebaseApp } from "./firebaseApp.js";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Apartments from "./Apartments.js";
import "./style/common.css"
import "./style/index.css"



const RouterComponent = () => (
  <Router>	
  	<div>
      <Route exact path="/" component={Apartments} />
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
          			<input type="text" placeholder="小蝸牛，想找哪裡的房子呢？" onChange={this.searchHandler.bind(this)} onKeyDown={this.submitSearch.bind(this)}/>
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

  searchHandler(e) {
    // console.log(e.currentTarget);
    // console.log(e.keyCode);
    // console.log(e.currentTarget.value);
    if (e.keyCode === 13) {
      consoole.log('enter key press');
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
      this.props.history.push("/apartments?position=" + e.target.value);
    }
  }

}; 

ReactDOM.render(<RouterComponent />, document.querySelector("#RAPP"));
