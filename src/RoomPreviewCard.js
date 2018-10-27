import React from "react";
import PropTypes from "prop-types";
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import airbnb from "./imgs/airbnb.png";
//FontAwesome主程式
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
//FontAwesome引用圖片
import { faHeart as faRegularHeart, faSave, faThumbsDown, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart, faListUl, faThLarge, faSquare, faMapMarkedAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faRegularHeart, faSolidHeart, faSave, faListUl, faThLarge, faSquare, faThumbsDown
  ,faEnvelope, faMapMarkedAlt);

class RoomPreviewCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.stopPropagation = this.stopPropagation.bind(this);
    this.getMarkerBounce = this.getMarkerBounce.bind(this);
    this.stopMarkerBounce = this.stopMarkerBounce.bind(this);
  }
  componentDidMount() {

  }
  componentDidUpdate() {
  
  }
  render() {
    let realEstate = this.props.realEstate;
    let monthly_price = realEstate.monthly_price.toLocaleString("en");
    let loveListStatusIndex = this.props.loveListStatus != null && this.props.getloveListStatusIndex(realEstate.id, this.props.loveListStatus);
    let roomType;
    switch(realEstate.room_type) {
      case "EHA":
      roomType = "整層住家";
      break;
      case "PR":
      roomType = "獨立套房";
      break;
      case "SR":
      roomType = "分租套房";
      break;
    }
    return (
      <div 
      key={this.props.index} 
      className={this.props.resultAreaDisplayType[1]} 
      onClick={(e)=> { this.props.changeSelecteIndex("add",realEstate.index) } } 
      onMouseEnter={(e)=>{ this.getMarkerBounce(e, loveListStatusIndex) }} 
      onMouseLeave={(e)=>{ this.stopMarkerBounce(e, loveListStatusIndex) }}
      >
        <div className="airbnbContainer">
          <img className="airbnb" src={airbnb}></img>
          Airbnb
        </div>
        <div className="img" style={{backgroundImage: `url(${realEstate.picture_url})`}}></div>
        <div className="description">
          <div className="priceGesture absolute">
            <div className="price">{"$" + monthly_price}</div>
            <div className="gesture" onClick={this.stopPropagation}>
              { 
              this.props.loveListStatus[loveListStatusIndex].inList === true 
              ? <FontAwesomeIcon className="icon" icon={["fas","heart"]} style={{ color: "red" }} onClick={(e)=>{ this.props.removeFromLoveList(e, realEstate.id, realEstate); }}/>
              : <FontAwesomeIcon className="icon" icon={["far","heart"]} onClick={(e)=>{ this.props.putIntoLoveList(e, realEstate.id, realEstate); }}/>
              }
              <FontAwesomeIcon className="icon" icon={["far","envelope"]} onClick={()=>{this.props.openEmailForm("",realEstate.id) }}/>
              <FontAwesomeIcon className="icon" icon={["far","thumbs-down"]} onClick={(e)=>{this.props.hideList(e, realEstate.id, realEstate.index);}} />
            </div>
          </div>
          <p>{realEstate.bedrooms} 間房間 · {realEstate.bathrooms} 間廁所 · {roomType}</p>
          <p>{realEstate.district}</p>
          <p className="updateTime">{realEstate.updated}</p>
        </div>
      </div>
    );
  }
  stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
  getMarkerBounce(e, index) {
    e.stopPropagation();
    let currentIndex = parseInt(index);
    googleMap.markers[currentIndex].setAnimation(google.maps.Animation.BOUNCE);
  }
  stopMarkerBounce(e, index) {
    let currentIndex = parseInt(index);
    googleMap.markers[currentIndex].setAnimation(null);
  }
}

export default RoomPreviewCard;