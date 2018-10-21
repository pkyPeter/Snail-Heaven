import ReactDOM from "react-dom";
import React from "react";
import "firebase/database";
import { firebaseApp } from "./firebaseApp.js";
import Header from "./Header.js";
import List from "./listPage.js";
import Email from "./Email.js";
import lib from "./lib.js";
import googleMap from "./GoogleMap.js";
import "./style/common.css";
import "./style/header.css";
import "./style/body.css";
import "./style/LoveList.css";
import "./style/SimpleDetail.css";
import data from "./result_export.json";
import snail_face from "./imgs/snail_cousin_white.png";

class Apartments extends React.Component {
  constructor() {
    super();	
    this.state = {
      goLoveList: false,
      loveListStatus: null,
      loveListDetail: lib.func.getLocalStorageJSON("loveList") !== null ?  lib.func.getLocalStorageJSON("loveList") : [],
      completeList: data,//10/6：原本應該是[]，暫時改成data測試
      currentViewData: [],
      filteredData:[],
      filters: { priceFloor:0 , priceCeiling: 100000, roomAmount: [], roomType:[], district:[], photoRequired: false, amenities: []},
      amenitiesList: null,
      currentLocation: [25.0484402,121.5278391],
      currentDistrict: null,
      latLng: [],
      toggleEmail: {open: false, currentDetail: null},
      selectedIndex: -1,
      hiddenMarkerIndex: []
    };
    this.goIndex = this.goIndex.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
    this.doFilter = this.doFilter.bind(this);
    this.goLoveList = this.goLoveList.bind(this);
    this.openEmailForm = this.openEmailForm.bind(this);
    this.goPropertyPage=this.goPropertyPage.bind(this);
    this.addSelectedIndex=this.addSelectedIndex.bind(this);
    this.removeSelectedIndex=this.removeSelectedIndex.bind(this);
    this.putIntoLoveList=this.putIntoLoveList.bind(this);
    this.removeFromLoveList=this.removeFromLoveList.bind(this);
    this.getloveListStatusIndex=this.getloveListStatusIndex.bind(this);
    this.getFilteredData = this.getFilteredData.bind(this);

    firebaseApp.sortAmenity().then((amenitiesList)=>{
      // console.log(amenitiesList);
      // console.log(amenitiesList.length);
      this.setState({ amenitiesList: amenitiesList})
    })

    firebaseApp.fBaseDB.getListing(dataFromFB => {
      for ( let i = 0 ; i<dataFromFB.length ; i++ ) { dataFromFB[i].index = i; }
      this.setState({ completeList: dataFromFB });
      this.setState({ loveListStatus: this.createLoveListStatus(dataFromFB) });
      for ( let i = 0 ; i<data.length ; i++ ) { data[i].index = i; }
      //製作給marker使用的state
      let location = firebaseApp.sortLatLng(dataFromFB);
      this.setState({latLng: location});
      //等google map相關程序完成，再進行後續動作
      Promise.all([googleMap.load])
        .then(()=>{
          let queryLocation = [ false , false ];
          let zoom;
          if ( lib.func.getQueryStringAndSearch("location") ) {
            let latLng= window.location.search.split("&")[0].split("=")[1].split(",");
            queryLocation[0] = parseFloat(latLng[0]);
            queryLocation[1] = parseFloat(latLng[1]);
            zoom = 15;
          } else if (lib.func.getQueryStringAndSearch("search")) {
            let latLng= window.location.search.split("&")[0].split("=")[1].split(",");
            queryLocation[0] = parseFloat(latLng[0]);
            queryLocation[1] = parseFloat(latLng[1]);
            zoom = 17;
          } else {
            zoom = 12;
          }
          let lat = queryLocation[0] || this.state.currentLocation[0];
          let lng = queryLocation[1] || this.state.currentLocation[1];

          // console.log(zoom, lat, lng);
          //製作地圖的promise，以及接連進行的一系列動作
          googleMap.init.initMapPromise( zoom, lat, lng ,"googleMap" )
            .then((map)=>{
              let markers = googleMap.makeMarkers(this.state.latLng, true);
              let initAutocomplete = googleMap.initAutocomplete(lib.func.get("header>.left>input"), "apartments");
              let autocompleteListener = googleMap.addAutocompleteListener(googleMap.autocomplete.apartments);
              let markersAndMap = [map,markers];
              return markersAndMap;
            })
            .then((markersAndMap)=>{
              googleMap.enableCluster(markersAndMap[0],[]);
              return markersAndMap[1];
            })
            .then((markers)=>{
              //點擊marker，就改變state，這個state會連動影響，把state改成index是因completeList相對應的資料就是在同一個位置
              markers.map(( marker, i ) => {
                google.maps.event.addListener(marker, "click", ()=>{
                  marker.setIcon(googleMap.produceMarkerStyle(true, 64));
                  this.setState({selectedIndex: i});
                });
                google.maps.event.addListener(marker, "visible_changed", function(){
                  if ( marker.getVisible() ) {
                    // console.log(i, marker.getVisible())
                    googleMap.markerclusterer.addMarker(marker, false);
                  } else {
                    googleMap.markerclusterer.removeMarker(marker, false);
                  }  
                });
              });
              //如果點擊地圖的其他地方，則將原本focus的點釋放
              google.maps.event.addListener( googleMap.map,"click", ()=>{
                console.log("click");
                let Index = this.state.selectedIndex;
                if ( Index != -1 ) {
                  googleMap.markers[Index].setIcon(googleMap.produceMarkerStyle("rgb(240, 243, 244)", 38));
                  this.removeSelectedIndex(Index);
                }
              });

              //隨時偵測地圖的動態
              google.maps.event.addListener( googleMap.map, "idle", ()=>{
                // console.log("bounds_changed");
                googleMap.markerclusterer.clearMarkers();
                console.log("idle");
                let completeList = this.state.completeList;
                let currentLocation = googleMap.customArea ? googleMap.customArea : googleMap.map.getBounds();
                let currentViewData = [];
                for ( let i = 0 ; i< this.state.latLng.length ; i++ ) {
                  let latLng = new google.maps.LatLng(parseFloat(this.state.latLng[i].lat),parseFloat(this.state.latLng[i].lng));
                  let inside = false;
                  if ( googleMap.customArea ) { 
                    inside = google.maps.geometry.poly.containsLocation(latLng, currentLocation);
                  } else {
										inside = currentLocation.contains(latLng);
                  }
                  if ( inside ) {
                    currentViewData.push(completeList[i]);
                    googleMap.markerclusterer.addMarker(googleMap.markers[i], false);
                  }
                }

                // this.setState({currentViewData: currentViewData });
                if( this.state.currentViewData.length && (this.state.filters.roomAmount.length || this.state.filters.roomType.length || this.state.filters.district.length || this.state.filters.amenities.length) ) {
	              	this.setState({currentViewData: currentViewData});
	                this.getFilteredData();
	              } else {
	              	this.setState({currentViewData: currentViewData, filteredData: currentViewData});
	              }
              });
            });
        });
    });



  }
  componentDidMount() {
    // console.log("componentDidMount");
    if ( lib.func.getQueryStringAndSearch("dis") ) {
      let dis = decodeURIComponent(window.location.search.split("=")[1]);
      // let viewBox = [view.split(",")[0].split("=")[1],...[view.split(",")[1],view.split(",")[2],view.split(",")[3]]];
      this.setState({currentDistrict: dis});
    }
    // if ( lib.func.getLocalStorageJSON("screenInfo") ) {
    //   let filters = lib.func.getLocalStorageJSON("screenInfo").filters;
    //   let zoom = lib.func.getLocalStorageJSON("screenInfo").zoom
    //   let center = lib.func.getLocalStorageJSON("screenInfo").center
    //   console.log(filters);
    //   // googleMap.map.setCenter(center);
    //   // googleMap.map.setZoom(zoom);
    //   // this.setState({});
    // }
    //製作完整各 amenty 底下的所屬 id array    
  }
  componentDidUpdate() {
    // console.log("apartment componentDidUpdate");
    if ( this.state.loveListStatus && lib.func.getQueryStringAndSearch("loveList") === true ) {
      this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
      this.setState({toggleSimpleDetail: false});
      window.history.replaceState({}, document.title, "/apartments");
    }
    //偵測如果都 load 完，並且 currentViewData 內已經沒有東西了，就可以執行這邊的程式碼
    if ( lib.func.getLocalStorageJSON("screenInfo") && this.state.amenitiesList && this.state.currentViewData.length ) {
      let filters = lib.func.getLocalStorageJSON("screenInfo").filters;
      let zoom = lib.func.getLocalStorageJSON("screenInfo").zoom
      let center = lib.func.getLocalStorageJSON("screenInfo").center
      console.log(filters);
      console.log("zoom",zoom)
      console.log("center",center)
      googleMap.map.setCenter(center);
      googleMap.map.setZoom(zoom);
      this.setState({filters: filters});
      localStorage.removeItem("screenInfo");
    }
    if ( this.state.filteredData.length !== 0 && lib.func.get(".apartments>.loading") ) {
      if (document.documentElement.clientWidth > 900 ) {
        lib.func.get(".apartments>.loading").style.opacity = "0";
        setTimeout(()=>{      
          lib.func.get(".apartments>.loading").style.zIndex = "0";
          lib.func.get(".apartments>.loading").remove();
        }, 1000)
      } else {
        if ( !lib.func.get(".apartments>.loading").style.opacity || lib.func.get(".apartments>section>.right").style.display === "unset") {
          lib.func.get(".apartments>.loading").style.opacity = "0";
          setTimeout(()=>{      
          lib.func.get(".apartments>.loading").remove();
          }, 1000)
        }
      }
    }

  }
  render() {
    // console.log(259, "apartment render");			
    return(
      <div className="apartments">
        <div className="loading">
          <img src={snail_face}  />
          <div className="description">LOADING</div>
        </div>
        <Header goLoveList={this.state.goLoveList} 
          goLoveListPage={this.goLoveList}
          goIndex={this.goIndex}
			 />
        <Email toggleEmail={this.state.toggleEmail}
          openEmailForm={this.openEmailForm}
        />
        <List goLoveList={this.state.goLoveList}
          goLoveListPage={this.goLoveList}
          completeList={this.state.completeList}
          loveListStatus={this.state.loveListStatus}
          loveListDetail={this.state.loveListDetail}
          openEmailForm={this.openEmailForm}
          selectedIndex={this.state.selectedIndex}
          goPropertyPage={this.goPropertyPage}
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
  addSelectedIndex(currentMarkerIndex) {
    console.log(244,currentMarkerIndex);
    // googleMap.markers[currentMarkerIndex].setAnimation(null);
    googleMap.markers[currentMarkerIndex].setIcon(googleMap.produceMarkerStyle(true, 48));
    this.setState({selectedIndex: currentMarkerIndex});
  }
  removeSelectedIndex(currentMarkerIndex){
    console.log(250,currentMarkerIndex);
    this.setState({selectedIndex: -1});
    googleMap.markers[currentMarkerIndex].setAnimation(null);
    googleMap.markers[currentMarkerIndex].setIcon(googleMap.produceMarkerStyle(false, 30));
  }

  goIndex(e) {
    this.props.history.push("/");
  }

  goLoveList(e) {
    this.setState((currentState,currentProps) => ({goLoveList: !currentState.goLoveList}));
    // this.setState({toggleSimpleDetail: false})		
  }
  goPropertyPage(e, id) {
    window.open(`/property?id=${id}`);
    // this.props.history.push(`/property?id=${id}`);
   //  this.props.history.push({
	  //   pathname:"/property",
	  //   search: `?id=${id}`,
	  //   state: { completeList: this.state.completeList}
	  // }); 
  }
  openEmailForm(currentDetail, id, close) {
    console.log("open form");
    if (close === "close") {
        let toggleEmail = this.state.toggleEmail;
        toggleEmail.open = false;
        toggleEmail.currentDetail = null;
        this.setState({toggleEmail: toggleEmail});

    } else {
      if (id) {
        console.log("使用id")
        firebaseApp.fBaseDB.getData("details",(detail)=>{
          let toggleEmail = this.state.toggleEmail;
          let objectKey = parseInt(Object.keys(detail)[0]);
          let currentDetail = detail[objectKey];
          toggleEmail.open = !toggleEmail.open;
          toggleEmail.currentDetail = currentDetail;
          this.setState({toggleEmail: toggleEmail});
        }, "id", id );  
      } else {
        console.log("使用currentDetail")
        let toggleEmail = this.state.toggleEmail;
        toggleEmail.open = !toggleEmail.open;
        toggleEmail.currentDetail = currentDetail;
        this.setState({toggleEmail: toggleEmail});
      }
    }


  }
  createLoveListStatus(ObjectArray) {
    let loveListStatus = [];
    let JSONforRenew = lib.func.getLocalStorageJSON("loveList")!= null ? lib.func.getLocalStorageJSON("loveList") : [];
    for ( let j = 0 ; j < ObjectArray.length ; j ++ ) {
      if ( JSONforRenew !== null || JSONforRenew.length > 0) {
        let item = {id: ObjectArray[j].id, inList:false};
        for ( let i = 0 ; i< JSONforRenew.length; i++) {
          if ( JSONforRenew[i].id === ObjectArray[j].id ) {
            item.inList = true;
            break;
          } else {
            item.inList = false;
          }
        }
        loveListStatus.push(item);
      } else {
        let item = {id: ObjectArray[j].id, inList:false};
        loveListStatus.push(item);
      }
    }
    return loveListStatus;
  }
  putIntoLoveList(e, id, realEstate) {
    // console.log(id);
    let currentLoveList = this.state.loveListStatus;
    for (let i = 0 ; i < currentLoveList.length ; i++ ) {
      if (currentLoveList[i].id === id) {
        currentLoveList[i].inList = true;
      }
    }
    this.setState({ loveListStatus: currentLoveList});

    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");
    if( JSONforRenew === null ) {
      JSONforRenew = [];
    } 
    JSONforRenew.push(realEstate);
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({loveListDetail: JSONforRenew});
  }
  removeFromLoveList(e, id, realEstate) {
    // console.log(id);
    let currentLoveList = this.state.loveListStatus;
    for (let i = 0 ; i < currentLoveList.length ; i++ ) {
      if (currentLoveList[i].id === id) {
        currentLoveList[i].inList = false;
      }
    }
    this.setState({ loveListStatus: currentLoveList});

    let JSONforRenew = lib.func.getLocalStorageJSON("loveList");

    for ( let i = 0 ; i < JSONforRenew.length ; i++ ) {
      if ( JSONforRenew[i].id === realEstate.id ) {
        JSONforRenew.splice(i,1);
      }
    }
    localStorage.setItem("loveList", JSON.stringify(JSONforRenew));
    this.setState({loveListDetail: JSONforRenew});		
  }
  getloveListStatusIndex( targetID, source ) {
    let targetIDPositionIndex;
    for ( let i = 0 ; i < source.length ; i++ ) {
      if ( targetID === source[i].id ) {
        targetIDPositionIndex = i;
        return targetIDPositionIndex;
      }
    }
  }

  changeFilters(filter, value) {
    // console.log(filter,value);
    if(filter === "photoRequired") {
      let currentState = this.state.filters;
      // console.log(currentState["photoRequired"]);
      if (currentState["photoRequired"]===true) { currentState["photoRequired"] = false; } else {currentState["photoRequired"] = true;}
      this.setState({filters: currentState});
    } else if (filter === "priceFloor" || filter === "priceCeiling") {
      let currentState = this.state.filters;
      if (filter === "priceFloor") { currentState["priceFloor"] = value; }
      else {currentState["priceCeiling"] = value;}
      this.setState({filters: currentState});
    } else {
      let currentState = this.state.filters;
      if (currentState[filter].length > 0) {
        // console.log("something inside");
        let existed = false;
        let currentIndex;
        for ( let i = 0 ; i < currentState[filter].length ; i++ ) {
          // console.log(filter);
          // console.log(currentState[filter][i]);
          if (currentState[filter][i] === value) {
            existed = true;
            currentIndex = i;
          }
        }
        if (existed) {
          currentState[filter].splice(currentIndex,1);
        } else if (!existed) {
          currentState[filter].push(value);	
        }
      } else {
        currentState[filter].push(value);	
      }
      this.setState({filters: currentState});
    }
    googleMap.map.setZoom(googleMap.map.getZoom());
  }
  doFilter (type, filter, dataForFilter) {
    let data = [];
    for ( let i = 0 ; i < filter.length; i++) {
      for ( let j = 0 ; j < dataForFilter.length ; j++ ) {
      	  	// console.log(type);
        if (type === "roomAmount") {
          if ( parseInt(dataForFilter[j].bedrooms) === filter[i] ) {
            data.push(dataForFilter[j]);
          } 
        } else {
          if ( dataForFilter[j][type] === filter[i] ) {
            data.push(dataForFilter[j]);
          } 
        }
      }
    }
    return data;
  }

  getFilteredData () {
  			// console.log(this.state.currentViewData)
	      console.log("start filter");
	      googleMap.markerclusterer.clearMarkers();
	      let filters = this.state.filters;
	      // console.log(filters);
	      let dataForFilter = this.state.currentViewData;
	      //roomAmount
	      if ( filters.roomAmount.length  ) {
	        dataForFilter = this.doFilter("roomAmount",filters.roomAmount, dataForFilter);
	      } 
	      //roomType
	      if ( filters.roomType.length ) {
	        dataForFilter = this.doFilter("room_type",filters.roomType, dataForFilter);
	      }
	      //District  neighbourhood_cleansed
	      if ( filters.district.length ) {
	        // dataForFilter = this.doFilter("neighbourhood_cleansed",filters.district, dataForFilter);
          let data = [];
          for ( let i = 0 ; i < filters.district.length ; i ++ ) {
            let filterOne = dataForFilter.filter((estate)=>{
              return estate.district === filters.district[i];
            })
            data = [...data, ... filterOne];
          }
          dataForFilter = data;
	      }
	      //photoRequired
	      if ( filters.photoRequired != false ) {
	        let dataAfterPhotoRequiredFilter = [];
	        for ( let i = 0 ; i < dataForFilter.length ; i ++ ) {
	          if ( dataForFilter[i].picture_url != "" ) {
	            dataAfterPhotoRequiredFilter.push(dataForFilter[i]);
	          }  
	        }
	        dataForFilter = dataAfterPhotoRequiredFilter;
	      }
        // console.log(dataForFilter)
        //amenity
        // console.log("amenities list", this.state.amenitiesList);

        if (filters.amenities.length && this.state.amenitiesList ) {
          let amenitiesEN = ["Internet","Hot water","A/C","Refrigerator","Laptop friendly workspace","Washer","Pets allowed","Kitchen","Gym","Elevator","Paid parking off premises","Free street parking"]
          let dataAfterAmenity = [];
          for ( let i = 0 ; i < dataForFilter.length ; i ++) {
              let shouldShow = false;
              for ( let j = 0 ; j < filters.amenities.length ; j++ ) {
                let index = amenitiesEN.indexOf(filters.amenities[j]);
                let amenitiesList = this.state.amenitiesList[index];
                let insideAmenities = amenitiesList.indexOf(dataForFilter[i].id);
                if (insideAmenities != -1) {
                  shouldShow = true;
                } else {
                  shouldShow = false;
                  break;
                }
                // console.log("should show")
              }
              if ( !shouldShow ) {
                continue;
              } else {
                dataAfterAmenity.push(dataForFilter[i]);
              }
          }
          dataForFilter = dataAfterAmenity;
        }
        // console.log(dataForFilter);
	      //hideList 
	      let hiddenList = lib.func.getLocalStorageJSON("hiddenList");
	      if ( hiddenList ) {
	        let dataAfterHideList = [];
	        for ( let i = 0; i < dataForFilter.length ; i++ ) {
	          let shouldShow = true;
	          for ( let j = 0 ; j < hiddenList.length ; j++ ) {
	            if ( dataForFilter[i].id === hiddenList[j] ) {
	              shouldShow = false;
	            }
	          }
	          if (shouldShow) { dataAfterHideList.push(dataForFilter[i]); }
	        }
          // console.log(dataAfterHideList,"dataAfterHideList")
	        dataForFilter = dataAfterHideList;
	      }
	      let hiddenMarker = [];
	
				for ( let i = 0 ; i < dataForFilter.length ; i++ ) {
					// console.log("該顯示顯示");
					googleMap.markerclusterer.addMarker(googleMap.markers[dataForFilter[i].index]);
				}
        //10/22 拼上線 先硬加
        if ( this.state.filters.priceCeiling != 100000 || this.state.filters.priceFloor != 0 ) {
          let filters = this.state.filters;
          let priceArray = [];
          let dataAfterPriceFilter =[];
          dataForFilter.map((realEstate, index)=>{
            if (realEstate.monthly_price != "") {
              let monthly_price = parseInt(realEstate.monthly_price.split(".")[0].split("$")[1].replace(/\,/g,""));
              priceArray.push(monthly_price);
            } else {
              let daily_price = parseInt(realEstate.price.split(".")[0].split("$")[1].replace(",",""))*30;
              priceArray.push(daily_price);
            }
          });
          //如果資料的價格介於priceCeilig以及priceFloor之間，就進行篩選
            for ( let i = 0 ; i < dataForFilter.length ; i++ ) {
              if ( filters.priceFloor < priceArray[i] && priceArray[i] <= filters.priceCeiling ) {
              } else {
                googleMap.markerclusterer.removeMarker(googleMap.markers[dataForFilter[i].index]);
              }
            }
         } 


        // console.log("進不進去",this.state.filteredData.length !== dataForFilter.length)
	      if ( this.state.filteredData.length !== dataForFilter.length ) {
	      	// console.log("hiddenMarker", hiddenMarker)
	      	this.setState({filteredData: dataForFilter});
	      }
			
		}


}


export default Apartments;

