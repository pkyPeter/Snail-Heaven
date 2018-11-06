import React from "react";
import Header from "./Header.js";
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/Property.css";
import "./style/loading.css";
import Email from "./Email.js";
import { firebaseApp } from "./firebaseApp.js";
import racing from "./imgs/racing.svg";
import snail_face from "./imgs/snail_face.png";
import line_share from "./imgs/line_share.png";
import facebook from "./imgs/facebook.png";
import image from "./imgs/image.png";
//FontAwesome主程式
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
//FontAwesome引用圖片
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

library.add(faRegularHeart, faSolidHeart, faShareAlt, faCaretLeft);

class Property extends React.Component {
  constructor() {
    super();
    this.state = {
      goLoveList: false,
      toggleSimpleDetail: false,
      // loveListStatus: this.createLoveListStatus(data),
      loveListDetail: lib.func.getLocalStorageJSON("loveList"),
      currentList: {},
      currentAddress: null,
      toggleEmail: { open: false, currentDetail: null },
    };
    this.goIndex = this.goIndex.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.openEmailForm = this.openEmailForm.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.changePhoto = this.changePhoto.bind(this);
  }
  componentDidMount() {
    this.getQueryStringID((outputArray) => {
      let targetID = outputArray[0];
      firebaseApp.fBaseDB.getDetailByID(targetID, (data) => {
        let objectKey = parseInt(Object.keys(data)[0]);
        let currentList = data[objectKey];
        if (currentList.monthly_price != "") {
          let monthly_price = parseInt(currentList.monthly_price.split(
            ".")[0].split("$")[1].replace(/\,/g, ""));
          currentList.monthly_price = monthly_price;
        } else {
          let daily_price_to_month = parseInt(currentList.price.split(
            ".")[0].split("$")[1].replace(",", "")) * 30;
          currentList.monthly_price = daily_price_to_month;
        }
        this.setState({ currentList: currentList });
        let zoom = 18;
        let lat = parseFloat(currentList.lat);
        let lng = parseFloat(currentList.lng);
        googleMap.init.initMapPromise(zoom, lat, lng, "googleMap")
          .then((map) => {
            let initAutocomplete = googleMap.initAutocomplete(lib
              .func.get("header>.left>input"), "property");
            let autocompleteListener = googleMap.addAutocompleteListener(
              googleMap.autocomplete.property, (place) => {
                this.props.history.push({
                  pathname: "/apartments",
                  search: `?search=${place.geometry.location.lat()},${place.geometry.location.lng()}`,
                  state: { lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng() }
                });
              });
            googleMap.style[5].stylers[0].visibility =
              "simplified";
            googleMap.style[9].stylers[0].visibility =
              "simplified";
            googleMap.map.setOptions({ styles: googleMap.style });
            let markers = googleMap.makeMarkers([{ lat: lat, lng: lng }],
              true);
            markers[0].setMap(googleMap.map);
            markers[0].setIcon(googleMap.produceMarkerStyle(true,
              64));
          });
        let panorama = new google.maps.StreetViewPanorama(
          lib.func.get("#streetView"), {
            position: { lat: lat, lng: lng },
            addressControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_CENTER
            },
            linksControl: false,
            panControl: false,
            enableCloseButton: false
          });
        googleMap.reverseGeocode(lat, lng, (results) => {
          this.setState({ currentAddress: results[0].formatted_address });
        });
      });
    });
  }
  render() {
    if (Object.keys(this.state.currentList).length) {
      let monthly_price = this.state.currentList.monthly_price.toLocaleString(
        "en");
      let amenities = this.sortOutAmenities(this.state.currentList.amenities,
        [/Internet/ig, /Hot water/ig, /A\/C/ig, /Refrigerator/ig,
          /Laptop friendly workspace/ig, /washer/ig, /Pets allowed/ig
        ]);
      let otherAmenities = this.sortOutAmenities(this.state.currentList.amenities,
        [/Kitchen/ig, /Paid parking off premises/ig,
          /Free street parking/ig, /Elevator/ig, /Gym/ig
        ]);
      let TV = this.sortOutAmenities(this.state.currentList.amenities, [
        /TV/ig
      ]).length === 2 ? ["TV", "Cable TV"] : ["TV"]; //因為電視無法拆
      let loveListStatusIndex = this.getloveListStatusIndex(this.state.currentList
        .id, this.state.loveListDetail);
      return (
        <div className="properties">
          <Header goLoveListPage={this.goLoveList.bind(this)} goIndex={this.goIndex}/>
          <Email toggleEmail={this.state.toggleEmail}
            openEmailForm={this.openEmailForm}
          />
          <section className="property">
            <div className="propTitle">
              <div className="button" onClick={this.goBackToSearch.bind(this)}>             
                <FontAwesomeIcon className="icon" icon={["fas","caret-left"]}/>
                <div>回到搜尋結果</div>
              </div>
              <div className="sdRight">
                <div className="button share" style={{marginRight: "5px", border: "none"}}>
                  <img src={line_share} style={{width: "28px", marginRight:"5px"}} onClick={(e)=>{ window.open(`https://social-plugins.line.me/lineit/share?url=https://snail-heaven-1537271625768.firebaseapp.com/property?id=${this.state.currentList.id}`); }}>
                  </img>
                  <img style={{width: "28px"}}
                    onClick={()=>{FB.ui({
                      method: "share",
                      mobile_iframe: true,
                      href: `https://snail-heaven-1537271625768.firebaseapp.com/property?id=${this.state.currentList.id}`,
                    }, function(response){});}}
                    src={facebook}
                  >
                  </img>
              
                </div>  
                { 
                  loveListStatusIndex != undefined && loveListStatusIndex != null 
                    ? (
                      <div className="button" onClick={(e)=>{ this.removeFromLoveList(e, this.state.currentList.id, this.state.currentList); }}>
                        <FontAwesomeIcon className="icon" icon={["fas","heart"]} style={{ color: "red" }} />
                        <div>收藏</div>
                      </div>
                    )
                    : (
                      <div className="button" onClick={(e)=>{ this.putIntoLoveList(e, this.state.currentList.id, this.state.currentList); }}>
                        <FontAwesomeIcon className="icon" icon={["far","heart"]}/>
                        <div>收藏</div>
                      </div>
                    )
                }
              </div>
            </div>
            <div className="propContent">
              <div className="left">
                <div className="price">{"$" + monthly_price }</div>
                <div className="name">{this.state.currentList.name}</div>
                <div className="address">{this.state.currentAddress}</div>
                <div className="checkAvailable" onClick={()=>{this.openEmailForm(this.state.currentList);}}>立即詢問</div>
                <div className="propGraphicInfo">
                  <div className="tabs">
                    <div className="tab active" onClick={(e)=>{this.switchTab(e, "photoGallery");}}>照片</div>
                    <div className="tab" onClick={(e)=>{this.switchTab(e, "map");}}>地圖</div>
                    <div className="tab" onClick={(e)=>{this.switchTab(e, "streetView");}}>街景</div>
                  </div>
                  <div className="graphics">
                    <div className="photoGallery">
                      <div className="gallery">
                        <div className="photos">
                          <div className="photo" style={{backgroundImage: `url(${this.state.currentList.picture_url})` ,backgroundSize: "cover"}}></div>
                          <div className="photo" style={{backgroundImage: `url(${image})`}}></div>
                          <div className="photo" style={{backgroundImage: `url(${image})`}}></div>
                          <div className="photo" style={{backgroundImage: `url(${image})`}}></div>
                          <div className="photo" style={{backgroundImage: `url(${image})`}}></div>
                        </div>
                        <div className="leftSelector" onClick={(e)=>{this.changePhoto(e, "leftSelector");}}>
                          <FontAwesomeIcon className="icon" icon={["fas","caret-left"]} onClick={(e)=>{this.changePhoto(e, "leftSelector"); this.stopPropagation(e);}}/>
                        </div>
                        <div className="rightSelector" onClick={(e)=>{this.changePhoto(e , "rightSelector");}}>
                          <FontAwesomeIcon className="icon" icon={["fas","caret-right"]} onClick={(e)=>{this.changePhoto(e , "rightSelector"); this.stopPropagation(e);}}/>
                        </div>
                      </div>
                      <div className="photoSelector">
                        <div className="selector focus" data-order="0" style={{backgroundImage: `url(${this.state.currentList.picture_url})`, backgroundSize: "100%"}} onClick={(e)=>{this.changePhoto(e, "dot");}}></div>
                        <div className="selector" data-order="1" onClick={(e)=>{this.changePhoto(e, "dot");}}></div>
                        <div className="selector" data-order="2" onClick={(e)=>{this.changePhoto(e, "dot");}}></div>
                        <div className="selector" data-order="3" onClick={(e)=>{this.changePhoto(e, "dot");}}></div>
                        <div className="selector" data-order="4" onClick={(e)=>{this.changePhoto(e, "dot");}}></div>
                      </div>
                    </div>
                    <div className="map" id="googleMap"></div>
                    <div className="streetView" id="streetView"></div>
                  </div>
                </div>
                <div className="description">
                  {this.state.currentList.description}
                </div>
                <div className="Amenities">
                  <div className="title">房屋設備</div>
                  <div className="content">
                    {
                      TV.map((TV,index)=>{
                        if ( TV === "TV") { TV = "電視"; }
                        if ( TV === "Cable TV") { TV = "第四臺"; }
                        return(<div className="amenity" key={index}>{TV}</div>);
                      })
                    }
                    {
                      amenities.map((amenity, index)=>{
                        if ( amenity === "Internet") { amenity = "網路"; }
                        if ( amenity === "Hot water") { amenity = "熱水器"; }
                        if ( amenity === "A/C") { amenity = "冷氣"; }
                        if ( amenity === "Refrigerator") { amenity = "冰箱"; }
                        if ( amenity === "Laptop friendly workspace") { amenity = "書桌/工作區"; }
                        if ( amenity === "Washer") { amenity = "洗衣機"; }
                        if ( amenity === "Pets allowed") { amenity = "可養寵物"; }
                        return(<div className="amenity" key={index}>{amenity}</div>);
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="right">
                <div className="details">
                  <h1>詳細資訊</h1>
                  <div className="detail">
                    <h3>月租金</h3>
                    <p>{ "$" + monthly_price }</p>
                  </div>
                  <div className="detail">
                    <h3>押金</h3>
                    <p>{this.state.currentList.security_deposit ? this.state.currentList.security_deposit : "-"}</p>
                  </div>
                  <div className="detail">
                    <h3>房屋種類</h3>
                    <p>{this.state.currentList.property_type}</p>
                  </div>
                  <div className="detail">
                    <h3>坪數</h3>
                    <p>{this.state.currentList.square_feet ? this.state.currentList.square_feet : "-"}</p>
                  </div>
                  <div className="detail">
                    <h3>房間數量</h3>
                    <p>{this.state.currentList.bedrooms}</p>
                  </div>
                  <div className="detail">
                    <h3>廁所數量</h3>
                    <p>{this.state.currentList.bathrooms}</p>
                  </div>
                </div>
                <div className="profile">
                  <div className="avatar" style={{backgroundImage: `url(${this.state.currentList.host_picture_url})`}}></div>
                  <div className="description">
                    <div className="title">Posted by:</div>
                    <div className="name">{this.state.currentList.host_name}</div>
                  </div>
                </div>
                <div className="checkAvailable" onClick={()=>{this.openEmailForm(this.state.currentList);}}>立即詢問</div>
              </div>
            </div>
            <div className="footer">
            </div>
          </section>
        </div>
      );
    } else {
      return (
        <div className="loading">
          <div className="loadingContainer" >
            <img className="snail"src={snail_face}  />
            <img className="car" src={racing}  />
            <div className="description"  >立刻為您取得房況中......</div>
          </div>
        </div>
      );
    }
  }
  goIndex(e) {
    this.props.history.push("/");
  }

  goLoveList(e) {
    this.props.history.push("/apartments?loveList");
  }
  goBackToSearch(e) {
    this.props.history.push("/apartments");
  }
  openEmailForm(currentDetail, id, close) {
    if (close === "close") {
      let toggleEmail = this.state.toggleEmail;
      toggleEmail.open = false;
      toggleEmail.currentDetail = null;
      this.setState({ toggleEmail: toggleEmail });

    } else {
      if (id) {
        firebaseApp.fBaseDB.getData("details", (detail) => {
          let toggleEmail = this.state.toggleEmail;
          let objectKey = parseInt(Object.keys(detail)[0]);
          let currentDetail = detail[objectKey];
          toggleEmail.open = !toggleEmail.open;
          toggleEmail.currentDetail = currentDetail;
          this.setState({ toggleEmail: toggleEmail });
        }, "id", id);
      } else {
        let toggleEmail = this.state.toggleEmail;
        toggleEmail.open = !toggleEmail.open;
        toggleEmail.currentDetail = currentDetail;
        this.setState({ toggleEmail: toggleEmail });
      }
    }
  }
  getQueryStringID(callback) {
    let queryString = window.location.search;
    let splitByAnd = queryString.split("&");
    let outputArray = [];
    for (let i = 0; i < splitByAnd.length; i++) {
      let splitByEuqal = splitByAnd[i].split("=");
      outputArray.push(splitByEuqal[1]);
    }
    if (callback) {
      callback(outputArray);
    }
  }
  getloveListStatusIndex(targetID, source) {
    let targetIDPositionIndex;
    if (source) {
      for (let i = 0; i < source.length; i++) {
        if (targetID === source[i].id) {
          targetIDPositionIndex = i;
          return targetIDPositionIndex;
        }
      }
    } else {
      return null;
    }

  }
  createLoveListStatus(ObjectArray) {
    let loveListStatus = [];

    let JSONforRenew = lib.func.getLocalStorageJSON("loveList") != null ?
      lib.func.getLocalStorageJSON("loveList") : [];

    // let JSONforRenew = current != null ? JSON.parse(current) : [];
    for (let j = 0; j < ObjectArray.length; j++) {
      if (JSONforRenew !== null || JSONforRenew.length > 0) {
        let item = { id: ObjectArray[j].id, inList: false };
        for (let i = 0; i < JSONforRenew.length; i++) {
          if (JSONforRenew[i].id === ObjectArray[j].id) {
            item.inList = true;
            break;
          } else {
            item.inList = false;
          }
        }
        loveListStatus.push(item);
      } else {
        let item = { id: ObjectArray[j].id, inList: false };
        loveListStatus.push(item);
      }
    }
    return loveListStatus;
  }

  sortOutAmenities(data, ruleArray) {
    let amenities = [];
    for (let i = 0; i < ruleArray.length; i++) {
      let amenity = data.match(ruleArray[i]);
      if (amenity != null) {
        amenities = [...amenities, ...amenity];
      }
    }
    return amenities;
  }
  putIntoLoveList(e, id, realEstate) {
    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
    if (JSONforRenew === null) {
      JSONforRenew = [];
    }
    JSONforRenew.push(realEstate);
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({ loveListDetail: JSONforRenew });
  }
  removeFromLoveList(e, id, realEstate) {
    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");

    for (let i = 0; i < JSONforRenew.length; i++) {
      if (JSONforRenew[i].id === realEstate.id) {
        JSONforRenew.splice(i, 1);
      }
    }
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({ loveListDetail: JSONforRenew });
  }
  switchTab(e, tabClicked) {
    let photoGallery = lib.func.get(".photoGallery");
    let map = lib.func.get(".map");
    let streetView = lib.func.get(".streetView");
    let tab = lib.func.getAll(".tabs>.tab");
    for (let i = 0; i < tab.length; i++) {
      tab[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    if (tabClicked === "photoGallery") {
      photoGallery.style.zIndex = 2;
      map.style.zIndex = 1;
      streetView.style.zIndex = 1;
    }
    if (tabClicked === "map") {
      photoGallery.style.zIndex = 1;
      map.style.zIndex = 2;
      streetView.style.zIndex = 1;
    }
    if (tabClicked === "streetView") {
      photoGallery.style.zIndex = 1;
      map.style.zIndex = 1;
      streetView.style.zIndex = 2;
    }
  }
  stopPropagation(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }
  changePhoto(e, target) {
    let photoArray = lib.func.getAll(".photos>.photo");
    let dotArray = lib.func.getAll(".photoSelector>.selector");
    let dotFocus = lib.func.get(".photoSelector>.focus");
    // 這邊做的是
    if (target === "dot") {
      let dotFocusOrder = parseInt(dotFocus.dataset.order);
      let eTargetOrder = parseInt(e.target.dataset.order);
      for (let j = eTargetOrder; j < dotArray.length; j++) {
        photoArray[j].style.left = "100%";
      }
      for (let j = eTargetOrder; j > -1; j--) {
        photoArray[j].style.left = "-100%";
      }
      photoArray[eTargetOrder].style.left = "0";
      e.target.classList.toggle("focus");
      dotFocus.classList.toggle("focus");
    } else {
      let order = parseInt(dotFocus.dataset.order);
      if (target === "leftSelector") {
        if (order > 0) {
          photoArray[order].style.left = "100%";
          photoArray[order - 1].style.left = "0%";
          dotArray[order].classList.toggle("focus");
          dotArray[order - 1].classList.toggle("focus");
        }
      }
      if (target === "rightSelector") {
        if (order < photoArray.length - 1) {
          photoArray[order].style.left = "-100%";
          photoArray[order + 1].style.left = "0%";
          dotArray[order].classList.toggle("focus");
          dotArray[order + 1].classList.toggle("focus");
        }
      }
    }
  }
}

export default Property;