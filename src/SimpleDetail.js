import React from "react";
import PropTypes from "prop-types";
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import line_share from "./imgs/line_share.png";
import facebook from "./imgs/facebook.png";
//FontAwesome主程式
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

//FontAwesome引用圖片
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as faRegularThumbsDown } from "@fortawesome/free-regular-svg-icons";
import { faThumbsDown as faSolidThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
library.add(
  faLongArrowAltLeft,
  faShareAlt,
  faRegularHeart,
  faRegularThumbsDown,
  faSolidThumbsDown,
  faCaretRight,
  faCaretLeft
);
//Fontawesome設備區
import { faHotTub } from "@fortawesome/free-solid-svg-icons";
import { faSnowflake } from "@fortawesome/free-regular-svg-icons";

library.add(faHotTub, faSnowflake);

class SimpleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shareButtons: { buttonStyle: {}, isShown: false },
      currentAddress: ""
    };
    this.toggleShareButtons = this.toggleShareButtons.bind(this);
  }
  componentDidMount() {
    let lat = parseFloat(this.props.currentSimpleDetail.lat);
    let lng = parseFloat(this.props.currentSimpleDetail.lng);
    googleMap.init.setPanorama("#streetViewMap", { lat: lat, lng: lng });
    // // 怕收費，先 comment out
    googleMap.reverseGeocode(lat, lng, results => {
      this.setState({ currentAddress: results[0].formatted_address });
    });
  }
  componentDidUpdate() {
    let lat = parseFloat(this.props.currentSimpleDetail.lat);
    let lng = parseFloat(this.props.currentSimpleDetail.lng);
    googleMap.panorama.setPosition({ lat: lat, lng: lng });
  }
  render() {
    if (this.props.currentSimpleDetail != null) {
      let monthly_price = this.props.currentSimpleDetail.monthly_price.toLocaleString(
        "en"
      );
      let amenities = sortOutAmenities(
        this.props.currentSimpleDetail.amenities,
        [
          /Internet/gi,
          /Hot water/gi,
          /A\/C/gi,
          /Refrigerator/gi,
          /Laptop friendly workspace/gi,
          /washer/gi,
          /Pets allowed/gi
        ]
      );
      let otherAmenities = sortOutAmenities(
        this.props.currentSimpleDetail.amenities,
        [
          /Kitchen/gi,
          /Paid parking off premises/gi,
          /Free street parking/gi,
          /Elevator/gi,
          /Gym/gi
        ]
      );
      let TV =
        sortOutAmenities(this.props.currentSimpleDetail.amenities, [/TV/gi])
          .length === 2
          ? ["TV", "Cable TV"]
          : ["TV"]; //因為電視無法拆解
      let loveListStatusIndex = this.props.getloveListStatusIndex(
        this.props.currentSimpleDetail.id,
        this.props.loveListStatus
      );
      return (
        <div
          className="right"
          style={{ width: this.props.leftRightWidth.rightWidth }}
        >
          <div
            className="areaSizer"
            draggable="true"
            onDrag={this.props.changeAreaSize}
            onDragEnd={this.props.changeAreaSize}
            style={{ right: this.props.leftRightWidth.resizerRight }}
          />
          <div className="sdTitle">
            <div
              className="button return"
              onClick={() => {
                this.props.goSimpleDetail("back", {});
                this.props.selectedIndex !== -1 &&
                  this.props.changeSelecteIndex(
                    "remove",
                    this.props.selectedIndex
                  );
              }}
            >
              <FontAwesomeIcon
                className="icon"
                icon={["fas", "long-arrow-alt-left"]}
              />
              <div>回到搜尋結果</div>
            </div>
            <div className="sdRight">
              <div
                className="button share"
                style={this.state.shareButtons.buttonStyle}
                onMouseEnter={this.toggleShareButtons}
                onMouseLeave={this.toggleShareButtons}
              >
                {this.state.shareButtons.isShown ? (
                  <div>
                    <img
                      src={line_share}
                      style={{ width: "22px", marginRight: "5px" }}
                      onClick={() => {
                        window.open(
                          `https://social-plugins.line.me/lineit/share?url=https://snail-heaven-1537271625768.firebaseapp.com/property?id=${
                            this.props.currentSimpleDetail.id
                          }`
                        );
                      }}
                    />
                    <img
                      style={{ width: "22px" }}
                      onClick={() => {
                        FB.ui(
                          {
                            method: "share",
                            mobile_iframe: true,
                            href: `https://snail-heaven-1537271625768.firebaseapp.com/property?id=${
                              this.props.currentSimpleDetail.id
                            }`
                          },
                          function(response) {}
                        );
                      }}
                      src={facebook}
                    />
                  </div>
                ) : (
                  <FontAwesomeIcon
                    className="icon"
                    icon={["fas", "share-alt"]}
                  />
                )}
                {!this.state.shareButtons.isShown && <div>分享</div>}
              </div>
              {this.props.loveListStatus != undefined &&
              this.props.loveListStatus[loveListStatusIndex].inList === true ? (
                <div
                  className="button"
                  onClick={e => {
                    this.props.removeFromLoveList(
                      e,
                      this.props.currentSimpleDetail.id,
                      this.props.currentSimpleDetail
                    );
                  }}
                >
                  <FontAwesomeIcon
                    className="icon"
                    icon={["fas", "heart"]}
                    style={{ color: "red" }}
                  />
                  <div>收藏</div>
                </div>
              ) : (
                <div
                  className="button"
                  onClick={e => {
                    this.props.putIntoLoveList(
                      e,
                      this.props.currentSimpleDetail.id,
                      this.props.currentSimpleDetail
                    );
                  }}
                >
                  <FontAwesomeIcon className="icon" icon={["far", "heart"]} />
                  <div>收藏</div>
                </div>
              )}
              <div
                className="button"
                onClick={e => {
                  this.props.hideList(
                    e,
                    this.props.currentSimpleDetail.id,
                    this.props.selectedIndex
                  );
                }}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={["far", "thumbs-down"]}
                />
                <div>不想再見</div>
              </div>
            </div>
          </div>

          <div className="photoGallery">
            <div className="gallery">
              <div className="photos">
                <div
                  className="photo"
                  style={{
                    backgroundImage: `url(${
                      this.props.currentSimpleDetail.picture_url
                    })`
                  }}
                />
                <div
                  className="photo"
                  style={{
                    backgroundImage:
                      'url("https://a0.muscache.com/im/pictures/8824698/31a49dd7_original.jpg?aki_policy=large")'
                  }}
                />
                <div
                  className="photo"
                  style={{
                    backgroundImage:
                      'url("https://a0.muscache.com/im/pictures/10794157/4b52b591_original.jpg?aki_policy=large")'
                  }}
                />
              </div>
              <div
                className="leftSelector"
                onClick={e => {
                  changePhoto(e, "leftSelector");
                }}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={["fas", "caret-left"]}
                  onClick={e => {
                    changePhoto(e, "leftSelector");
                    stopPropagation(e);
                  }}
                />
              </div>
              <div
                className="rightSelector"
                onClick={e => {
                  changePhoto(e, "rightSelector");
                }}
              >
                <FontAwesomeIcon
                  className="icon"
                  icon={["fas", "caret-right"]}
                  onClick={e => {
                    changePhoto(e, "rightSelector");
                    stopPropagation(e);
                  }}
                />
              </div>
            </div>
            <div className="dotSelector">
              <button
                className="dot focus"
                data-order="0"
                onClick={e => {
                  changePhoto(e, "dot");
                }}
              />
              <button
                className="dot"
                data-order="1"
                onClick={e => {
                  changePhoto(e, "dot");
                }}
              />
              <button
                className="dot"
                data-order="2"
                onClick={e => {
                  changePhoto(e, "dot");
                }}
              />
            </div>
          </div>
          <div className="priceAddress">
            <div className="price">{"$" + monthly_price}</div>
            <span />
            <div className="address">
              <div className="cityDist">
                台北市
                {this.props.currentSimpleDetail.district}
              </div>
              <div className="street">{this.state.currentAddress}</div>
            </div>
          </div>
          <div
            className="checkAvailable"
            onClick={() => {
              this.props.openEmailForm(this.props.currentSimpleDetail);
            }}
          >
            立即詢問
          </div>
          <div className="description">
            <div className="title">房屋概述</div>
            <div className="content">
              {this.props.currentSimpleDetail.summary}
            </div>
          </div>
          {this.props.currentSimpleDetail.transit != "" && (
            <div className="description">
              <div className="title">周邊交通</div>
              <div className="content">
                {this.props.currentSimpleDetail.transit}
              </div>
            </div>
          )}

          <div className="time">
            <div className="title">更新時間</div>
            <div className="content">
              {this.props.currentSimpleDetail.updated}
            </div>
          </div>
          <div className="Amenities">
            <div className="title">房屋設備</div>
            <div className="content">
              {TV.map((TV, index) => {
                if (TV === "TV") {
                  TV = "電視";
                }
                if (TV === "Cable TV") {
                  TV = "第四臺";
                }
                return (
                  <div className="amenity" key={index}>
                    {TV}
                  </div>
                );
              })}
              {amenities.map((amenity, index) => {
                switch (amenity) {
                  case "Internet":
                    amenity = "網路";
                    break;
                  case "Hot water":
                    amenity = "熱水器";
                    break;
                  case "A/C":
                    amenity = "冷氣";
                    break;
                  case "Refrigerator":
                    amenity = "冰箱";
                    break;
                  case "Laptop friendly workspace":
                    amenity = "書桌/工作區";
                    break;
                  case "Washer":
                    amenity = "洗衣機";
                    break;
                  case "Pets allowed":
                    amenity = "可養寵物";
                    break;
                }

                return (
                  <div className="amenity" key={index}>
                    {amenity}
                  </div>
                );
              })}
            </div>
            <div className="title">其他設備</div>
            <div className="content">
              {otherAmenities.map((amenity, index) => {
                switch (amenity) {
                  case "Kitchen":
                    amenity = "廚房";
                    break;
                  case "Gym":
                    amenity = "健身房";
                    break;
                  case "Elevator":
                    amenity = "電梯";
                    break;
                  case "Paid parking off premises":
                    amenity = "付費停車場";
                    break;
                  case "Free street parking":
                    amenity = "周邊有路邊停車格";
                    break;
                }
                return (
                  <div className="amenity" key={index}>
                    {amenity}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{ width: "100%", marginTop: "20px", paddingBottom: "65%" }}
            className="streetViewMap"
            id="streetViewMap"
          />
          <div
            className="moreInfo"
            onClick={() => {
              this.props.goPropertyPage(this.props.currentSimpleDetail.id);
              this.props.recordCurrentStatus();
            }}
          >
            更多詳細資訊
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  toggleShareButtons() {
    if (this.state.shareButtons.isShown) {
      this.setState({ shareButtons: { buttonStyle: {}, isShown: false } });
    } else {
      this.setState({
        shareButtons: {
          buttonStyle: {
            marginRight: "5px",
            border: "none"
          },
          isShown: true
        }
      });
    }
  }
}

function stopPropagation(e) {
  e.stopPropagation();
  e.nativeEvent.stopImmediatePropagation();
}

function sortOutAmenities(data, ruleArray) {
  let amenities = [];
  for (let i = 0; i < ruleArray.length; i++) {
    let amenity = data.match(ruleArray[i]);
    if (amenity != null) {
      amenities = [...amenities, ...amenity];
    }
  }
  return amenities;
}

function changePhoto(e, target) {
  let photoArray = lib.func.getAll(".photos>.photo");
  let dotArray = lib.func.getAll(".dotSelector>.dot");
  let dotFocus = lib.func.get(".dotSelector>.focus");

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

export default SimpleDetail;
