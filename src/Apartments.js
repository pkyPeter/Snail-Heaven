import ReactDOM from "react-dom";
import React from "react";
import "firebase/database";
import { firebaseApp } from "./firebaseApp.js";
import Header from "./Header.js";
import List from "./List.js";
import Email from "./Email.js";
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import "./style/LoveList.css";
import "./style/SimpleDetail.css";
import snail_face from "./imgs/snail_cousin_white.png";

class Apartments extends React.Component {
  constructor() {
    super();
    this.state = {
      goLoveList: false,
      loveListStatus: null,
      loveListDetail:
        lib.func.getLocalStorageJSON("loveList") !== null
          ? lib.func.getLocalStorageJSON("loveList")
          : [],
      completeList: [],
      currentViewData: [],
      filteredData: [],
      filters: {
        priceFloor: 0,
        priceCeiling: 100000,
        roomAmount: [],
        roomType: [],
        district: [],
        photoRequired: false,
        amenities: []
      },
      amenitiesList: null,
      currentLocation: [25.0484402, 121.5278391],
      latLng: [],
      toggleEmail: { open: false, currentDetail: null },
      selectedIndex: -1
    };
    this.transferPriceIntoNumber = this.transferPriceIntoNumber.bind(this);
    this.goIndex = this.goIndex.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
    this.doFilter = this.doFilter.bind(this);
    this.goLoveList = this.goLoveList.bind(this);
    this.openEmailForm = this.openEmailForm.bind(this);
    this.goPropertyPage = this.goPropertyPage.bind(this);
    this.changeSelecteIndex = this.changeSelecteIndex.bind(this);
    this.addSelectedIndex = this.addSelectedIndex.bind(this);
    this.removeSelectedIndex = this.removeSelectedIndex.bind(this);
    this.putIntoLoveList = this.putIntoLoveList.bind(this);
    this.removeFromLoveList = this.removeFromLoveList.bind(this);
    this.confirmLoveListIndex = this.confirmLoveListIndex.bind(this);
    this.getloveListStatusIndex = this.getloveListStatusIndex.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);
    this.showLoveListOnly = this.showLoveListOnly.bind(this);
    this.showPreviousView = this.showPreviousView.bind(this);
  }
  componentDidMount() {
    // retrieve amenity list and complete list from database, and start google
    // map after all data is loaded
    Promise.all([
      firebaseApp.sortAmenity(),
      firebaseApp.fBaseDB.getDataNew("listings")
    ])
      .then(amenityAndCompleteList => {
        this.setState({ amenitiesList: amenityAndCompleteList[0] });
        return amenityAndCompleteList[1];
      })
      .then(dataFromFB => {
        for (let i = 0; i < dataFromFB.length; i++) {
          dataFromFB[i].index = i;
        }
        //製作給marker使用的經緯度資料檔
        let location = firebaseApp.sortLatLng(dataFromFB);
        this.transferPriceIntoNumber(dataFromFB);
        this.confirmLoveListIndex(this.state.loveListDetail, dataFromFB);
        this.setState({
          completeList: dataFromFB,
          loveListStatus: this.createLoveListStatus(dataFromFB),
          latLng: location
        });
        //等google map相關程序完成，再進行後續動作
        googleMap.load.then(() => {
          let queryLocation = [false, false];
          let zoom;
          if (
            lib.func.getQueryStringAndSearch("location") ||
            lib.func.getQueryStringAndSearch("search")
          ) {
            let latLng = window.location.search
              .split("&")[0]
              .split("=")[1]
              .split(",");
            queryLocation = [parseFloat(latLng[0]), parseFloat(latLng[1])];
            zoom = 15;
            if (lib.func.getQueryStringAndSearch("search")) {
              zoom = 17;
            }
          } else {
            zoom = 12;
          }
          let lat = queryLocation[0] || this.state.currentLocation[0];
          let lng = queryLocation[1] || this.state.currentLocation[1];
          //製作地圖的promise，以及接連進行的一系列動作
          googleMap.init
            .initMapPromise(zoom, lat, lng, "googleMap")
            .then(map => {
              let markers = googleMap.makeMarkers(this.state.latLng, true);
              let initAutocomplete = googleMap.initAutocomplete(
                lib.func.get("header>.left>input"),
                "apartments"
              );
              let autocompleteListener = googleMap.addAutocompleteListener(
                googleMap.autocomplete.apartments
              );
              googleMap.enableCluster(map, []);
              return markers;
            })
            .then(markers => {
              //點擊marker，就改變state，這個state會連動影響，把state改成index是因completeList相對應的資料就是在同一個位置
              markers.map((marker, i) => {
                google.maps.event.addListener(marker, "click", () => {
                  marker.setIcon(googleMap.produceMarkerStyle(true, 64));
                  this.setState({ selectedIndex: i });
                });
                google.maps.event.addListener(marker, "visible_changed", () => {
                  if (marker.getVisible()) {
                    googleMap.markerclusterer.addMarker(marker, false);
                  } else {
                    googleMap.markerclusterer.removeMarker(marker, false);
                  }
                });
              });
              //如果點擊地圖的其他地方，則將原本focus的點釋放
              google.maps.event.addListener(googleMap.map, "click", () => {
                let Index = this.state.selectedIndex;
                if (Index != -1) {
                  googleMap.markers[Index].setIcon(
                    googleMap.produceMarkerStyle("rgb(240, 243, 244)", 38)
                  );
                  this.removeSelectedIndex(Index);
                }
              });

              //隨時偵測地圖的動態
              google.maps.event.addListener(googleMap.map, "idle", () => {
                googleMap.markerclusterer.clearMarkers();
                let completeList = this.state.completeList;
                let currentLocation = googleMap.customArea
                  ? googleMap.customArea
                  : googleMap.map.getBounds();
                let currentViewData = [];
                let currentViewMarkers = [];
                for (let i = 0; i < this.state.latLng.length; i++) {
                  let latLng = new google.maps.LatLng(
                    parseFloat(this.state.latLng[i].lat),
                    parseFloat(this.state.latLng[i].lng)
                  );
                  let inside = false;
                  if (googleMap.customArea) {
                    inside = google.maps.geometry.poly.containsLocation(
                      latLng,
                      currentLocation
                    );
                  } else {
                    inside = currentLocation.contains(latLng);
                  }
                  if (inside) {
                    currentViewData.push(completeList[i]);
                    currentViewMarkers.push(googleMap.markers[i]);
                  }
                }
                googleMap.enableCluster(googleMap.map, currentViewMarkers);

                if (this.state.goLoveList) {
                  this.showLoveListOnly();
                  this.setState({ filteredData: this.state.loveListDetail });
                } else if (
                  (this.state.currentViewData.length &&
                    (this.state.filters.roomAmount.length ||
                      this.state.filters.roomType.length ||
                      this.state.filters.district.length ||
                      this.state.filters.amenities.length)) ||
                  (this.state.filters.priceCeiling != 100000 ||
                    this.state.filters.priceFloor != 0)
                ) {
                  this.setState({ currentViewData: currentViewData });
                  this.getFilteredData();
                } else {
                  this.setState({
                    currentViewData: currentViewData,
                    filteredData: currentViewData
                  });
                }
              });
            });
        });
      });
  }
  componentDidUpdate(prevState) {
    if (
      this.state.loveListStatus &&
      lib.func.getQueryStringAndSearch("loveList") === true
    ) {
      this.setState((currentState, currentProps) => ({
        goLoveList: !currentState.goLoveList
      }));
      this.setState({ toggleSimpleDetail: false });
      window.history.replaceState({}, document.title, "/apartments");
    }
    //偵測如果都 load 完，並且 currentViewData 內已經沒有東西了，就可以執行這邊的程式碼
    if (
      lib.func.getLocalStorageJSON("screenInfo") &&
      this.state.amenitiesList &&
      this.state.currentViewData.length
    ) {
      this.showPreviousView();
    }
    if (
      this.state.filteredData.length !== 0 &&
      lib.func.get(".apartments>.loading")
    ) {
      if (document.documentElement.clientWidth > 900) {
        lib.func.get(".apartments>.loading").style.opacity = "0";
        setTimeout(() => {
          lib.func.get(".apartments>.loading").style.zIndex = "0";
          lib.func.get(".apartments>.loading").remove();
        }, 1000);
      } else {
        if (
          !lib.func.get(".apartments>.loading").style.opacity ||
          lib.func.get(".apartments>section>.right").style.display === "unset"
        ) {
          lib.func.get(".apartments>.loading").style.opacity = "0";
          setTimeout(() => {
            lib.func.get(".apartments>.loading").remove();
          }, 1000);
        }
      }
    }
  }
  render() {
    return (
      <div className="apartments">
        <div className="loading">
          <img src={snail_face} />
          <div className="description">LOADING</div>
        </div>
        <Header
          goLoveList={this.state.goLoveList}
          goLoveListPage={this.goLoveList}
          goIndex={this.goIndex}
        />
        <Email
          toggleEmail={this.state.toggleEmail}
          openEmailForm={this.openEmailForm}
        />
        <List
          goLoveList={this.state.goLoveList}
          goLoveListPage={this.goLoveList}
          completeList={this.state.completeList}
          loveListStatus={this.state.loveListStatus}
          loveListDetail={this.state.loveListDetail}
          openEmailForm={this.openEmailForm}
          selectedIndex={this.state.selectedIndex}
          goPropertyPage={this.goPropertyPage}
          changeSelecteIndex={this.changeSelecteIndex}
          addSelectedIndex={this.addSelectedIndex}
          removeSelectedIndex={this.removeSelectedIndex}
          putIntoLoveList={this.putIntoLoveList}
          removeFromLoveList={this.removeFromLoveList}
          getloveListStatusIndex={this.getloveListStatusIndex}
          currentViewData={this.state.currentViewData}
          filteredData={this.state.filteredData}
          changeFilters={this.changeFilters}
          filters={this.state.filters}
        />
      </div>
    );
  }
  transferPriceIntoNumber(list) {
    list.forEach(realEstate => {
      if (realEstate.monthly_price != "") {
        let monthly_price = parseInt(
          realEstate.monthly_price
            .split(".")[0]
            .split("$")[1]
            .replace(/\,/g, "")
        );
        realEstate.monthly_price = monthly_price;
      } else {
        let daily_price_to_month =
          parseInt(
            realEstate.price
              .split(".")[0]
              .split("$")[1]
              .replace(",", "")
          ) * 30;
        realEstate.monthly_price = daily_price_to_month;
      }
    });
  }
  changeSelecteIndex(action, currentMarkerIndex) {
    if (action === "add") this.addSelectedIndex(currentMarkerIndex);
    else if (action === "remove") this.removeSelectedIndex(currentMarkerIndex);
  }
  addSelectedIndex(currentMarkerIndex) {
    googleMap.markers[currentMarkerIndex].setIcon(
      googleMap.produceMarkerStyle(true, 48)
    );
    this.setState({ selectedIndex: currentMarkerIndex });
  }
  removeSelectedIndex(currentMarkerIndex) {
    this.setState({ selectedIndex: -1 });
    googleMap.markers[currentMarkerIndex].setAnimation(null);
    googleMap.markers[currentMarkerIndex].setIcon(
      googleMap.produceMarkerStyle(false, 30)
    );
  }

  goIndex(e) {
    this.props.history.push("/");
  }

  goLoveList(e) {
    if (googleMap.map) {
      googleMap.setMapOptions(13, {
        lat: this.state.currentLocation[0],
        lng: this.state.currentLocation[1]
      });
      googleMap.markerclusterer.setGridSize(1);
    }
    this.setState((currentState, currentProps) => ({
      goLoveList: !currentState.goLoveList
    }));
  }
  goPropertyPage(e, id) {
    window.open(`/property?id=${id}`);
  }
  showPreviousView() {
    let screenInfo = lib.func.getLocalStorageJSON("screenInfo");
    let filters = screenInfo.filters;
    let zoom = screenInfo.zoom;
    let center = screenInfo.center;
    googleMap.setMapOptions(zoom, center);
    this.setState({ filters: filters });
    localStorage.removeItem("screenInfo");
  }
  openEmailForm(currentDetail, id, close) {
    if (close === "close") {
      let toggleEmail = this.state.toggleEmail;
      toggleEmail.open = false;
      toggleEmail.currentDetail = null;
      this.setState({ toggleEmail: toggleEmail });
    } else {
      if (id) {
        firebaseApp.fBaseDB.getData(
          "details",
          detail => {
            let toggleEmail = this.state.toggleEmail;
            let objectKey = parseInt(Object.keys(detail)[0]);
            let currentDetail = detail[objectKey];
            toggleEmail.open = !toggleEmail.open;
            toggleEmail.currentDetail = currentDetail;
            this.setState({ toggleEmail: toggleEmail });
          },
          "id",
          id
        );
      } else {
        let toggleEmail = this.state.toggleEmail;
        toggleEmail.open = !toggleEmail.open;
        toggleEmail.currentDetail = currentDetail;
        this.setState({ toggleEmail: toggleEmail });
      }
    }
  }
  createLoveListStatus(ObjectArray) {
    let loveListStatus = [];
    let JSONforRenew =
      lib.func.getLocalStorageJSON("loveList") != null
        ? lib.func.getLocalStorageJSON("loveList")
        : [];
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
  confirmLoveListIndex(loveListData, compareDataList) {
    for (let i = 0; i < loveListData.length; i++) {
      for (let j = 0; j < compareDataList.length; j++) {
        if (loveListData[i].id === compareDataList[j].id) {
          loveListData[i].index = compareDataList[j].index;
          continue;
        }
      }
    }
  }
  updateLocalStorageLoveList(e, id, realEstate, action) {
    if (action === "add") {
      this.putIntoLoveList(e, id, realEstate);
    } else if (action === "remove") {
      this.removeFromLoveList(e, id, realEstate);
    }
  }
  putIntoLoveList(e, id, realEstate) {
    let currentLoveList = this.state.loveListStatus;
    for (let i = 0; i < currentLoveList.length; i++) {
      if (currentLoveList[i].id === id) {
        currentLoveList[i].inList = true;
      }
    }
    this.setState({ loveListStatus: currentLoveList });

    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
    if (JSONforRenew === null) {
      JSONforRenew = [];
    }
    if (this.state.selectedIndex !== -1) {
      realEstate.index = this.state.selectedIndex;
    }
    JSONforRenew.push(realEstate);
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({ loveListDetail: JSONforRenew });
  }
  removeFromLoveList(e, id, realEstate) {
    let currentLoveList = this.state.loveListStatus;
    for (let i = 0; i < currentLoveList.length; i++) {
      if (currentLoveList[i].id === id) {
        currentLoveList[i].inList = false;
      }
    }
    this.setState({ loveListStatus: currentLoveList });
    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
    for (let i = 0; i < JSONforRenew.length; i++) {
      if (JSONforRenew[i].id === realEstate.id) {
        JSONforRenew.splice(i, 1);
      }
    }
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({ loveListDetail: JSONforRenew });
    if (this.state.goLoveList) {
      googleMap.markerclusterer.removeMarker(
        googleMap.markers[realEstate.index]
      );
    }
  }
  getloveListStatusIndex(targetID, source) {
    let targetIDPositionIndex;
    for (let i = 0; i < source.length; i++) {
      if (targetID === source[i].id) {
        targetIDPositionIndex = i;
        return targetIDPositionIndex;
      }
    }
  }

  changeFilters(filter, value) {
    if (filter === "photoRequired") {
      let currentState = this.state.filters;
      if (currentState["photoRequired"] === true) {
        currentState["photoRequired"] = false;
      } else {
        currentState["photoRequired"] = true;
      }
      this.setState({ filters: currentState });
    } else if (filter === "priceFloor" || filter === "priceCeiling") {
      let currentState = this.state.filters;
      if (filter === "priceFloor") {
        currentState["priceFloor"] = value;
      } else {
        currentState["priceCeiling"] = value;
      }
      this.setState({ filters: currentState });
    } else {
      let currentState = this.state.filters;
      if (currentState[filter].length > 0) {
        let existed = false;
        let currentIndex;
        for (let i = 0; i < currentState[filter].length; i++) {
          if (currentState[filter][i] === value) {
            existed = true;
            currentIndex = i;
          }
        }
        if (existed) {
          currentState[filter].splice(currentIndex, 1);
        } else if (!existed) {
          currentState[filter].push(value);
        }
      } else {
        currentState[filter].push(value);
      }
      this.setState({ filters: currentState });
    }
    googleMap.map.setZoom(googleMap.map.getZoom());
  }
  doFilter(type, filter, dataForFilter) {
    let data = [];
    for (let i = 0; i < dataForFilter.length; i++) {
      for (let j = 0; j < filter.length; j++) {
        if (type === "roomAmount") {
          if (parseInt(dataForFilter[i].bedrooms) === filter[j]) {
            data.push(dataForFilter[i]);
            break;
          }
        } else {
          if (dataForFilter[i][type] === filter[j]) {
            data.push(dataForFilter[i]);
            break;
          }
        }
      }
    }
    return data;
  }
  showLoveListOnly() {
    let markers = [];
    let loveList = this.state.loveListDetail;
    let completeList = this.state.completeList;
    googleMap.markerclusterer.clearMarkers();
    for (let i = 0; i < loveList.length; i++) {
      for (let j = 0; j < completeList.length; j++) {
        if (loveList[i].id === completeList[j].id) {
          markers.push(googleMap.markers[j]);
          break;
        }
      }
    }
    googleMap.enableCluster(googleMap.map, markers);
  }

  getFilteredData() {
    googleMap.markerclusterer.clearMarkers();
    let filters = this.state.filters;
    let dataForFilter = this.state.currentViewData;
    //roomAmount
    if (filters.roomAmount.length) {
      dataForFilter = this.doFilter(
        "roomAmount",
        filters.roomAmount,
        dataForFilter
      );
    }
    //roomType
    if (filters.roomType.length) {
      dataForFilter = this.doFilter(
        "room_type",
        filters.roomType,
        dataForFilter
      );
    }
    //District
    if (filters.district.length) {
      dataForFilter = this.doFilter(
        "district",
        filters.district,
        dataForFilter
      );
    }
    //photoRequired
    if (filters.photoRequired != false) {
      let dataAfterPhotoRequiredFilter = [];
      for (let i = 0; i < dataForFilter.length; i++) {
        if (dataForFilter[i].picture_url != "") {
          dataAfterPhotoRequiredFilter.push(dataForFilter[i]);
        }
      }
      dataForFilter = dataAfterPhotoRequiredFilter;
    }
    //amenity
    if (filters.amenities.length && this.state.amenitiesList) {
      let amenitiesEN = [
        "Internet",
        "Hot water",
        "A/C",
        "Refrigerator",
        "Laptop friendly workspace",
        "Washer",
        "Pets allowed",
        "Kitchen",
        "Gym",
        "Elevator",
        "Paid parking off premises",
        "Free street parking"
      ];
      let dataAfterAmenity = [];
      for (let i = 0; i < dataForFilter.length; i++) {
        let shouldShow = false;
        for (let j = 0; j < filters.amenities.length; j++) {
          let index = amenitiesEN.indexOf(filters.amenities[j]);
          let amenitiesList = this.state.amenitiesList[index];
          let insideAmenities = amenitiesList.indexOf(dataForFilter[i].id);
          if (insideAmenities != -1) {
            shouldShow = true;
          } else {
            shouldShow = false;
            break;
          }
        }
        if (!shouldShow) {
          continue;
        } else {
          dataAfterAmenity.push(dataForFilter[i]);
        }
      }
      dataForFilter = dataAfterAmenity;
    }
    //hideList
    let hiddenList = lib.func.getLocalStorageJSON("hiddenList");
    if (hiddenList) {
      let dataAfterHideList = [];
      for (let i = 0; i < dataForFilter.length; i++) {
        let shouldShow = true;
        for (let j = 0; j < hiddenList.length; j++) {
          if (dataForFilter[i].id === hiddenList[j]) {
            shouldShow = false;
          }
        }
        if (shouldShow) {
          dataAfterHideList.push(dataForFilter[i]);
        }
      }
      dataForFilter = dataAfterHideList;
    }
    let markers = [];
    if (
      this.state.filters.priceCeiling != 100000 ||
      this.state.filters.priceFloor != 0
    ) {
      for (let i = 0; i < dataForFilter.length; i++) {
        if (
          filters.priceFloor < dataForFilter[i].monthly_price &&
          dataForFilter[i].monthly_price <= filters.priceCeiling
        ) {
          markers.push(googleMap.markers[dataForFilter[i].index]);
        }
      }
    } else {
      for (let i = 0; i < dataForFilter.length; i++) {
        markers.push(googleMap.markers[dataForFilter[i].index]);
      }
    }
    //這邊重新 enable 而非 addMarkers，是效能上這邊用 enable 速度比較快
    googleMap.enableCluster(googleMap.map, markers);
    if (this.state.filteredData.length !== dataForFilter.length) {
      this.setState({ filteredData: dataForFilter });
    }
  }
}

export default Apartments;
