import React from "react";
import PropTypes from "prop-types";
import lib from "./lib.js";
import PriceChart from "./PriceChart.js";
import googleMap from "./GoogleMap.js";
import RoomPreviewCard from "./RoomPreviewCard.js";
import airbnb from "./imgs/airbnb.png";
import filterCriteria from "./const.js";
//FontAwesome專用區域
import { bedroom } from "./imgs/bedroom.jpg";
//FontAwesome主程式
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
//FontAwesome引用圖片
import { faSave } from "@fortawesome/free-regular-svg-icons";
import {
  faListUl,
  faThLarge,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
library.add(faSave, faListUl, faThLarge, faSquare);

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDataLength: 0, //這個完全是流程控制，因為只要 filterdata 數量一樣，價格篩選都應該只要執行一次，主要是因為需要在 componentDidUpdate 的時候去做，但是因為不是每次 update 都有變動 filterdata 的數量
      completeDataForRender: [],
      currentLoadAmount: 3,
      currentLoad: []
    };
    this.showMoreFilter = this.showMoreFilter.bind(this);
    this.loadMoreCards = this.loadMoreCards.bind(this);
    this.getMarkerBounce = this.getMarkerBounce.bind(this);
    this.stopMarkerBounce = this.stopMarkerBounce.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidMount() {
    //剛進來第一次要初始化Origin data，並且進行初步印製
    this.setState({ completeDataForRender: this.props.filteredData });
    if (this.props.filteredData < 3) {
      this.setState({ currentLoad: this.props.filteredData });
    } else {
      this.loadMoreCards(this.props.filteredData, this.state.currentLoadAmount);
    }
  }
  componentDidUpdate() {
    console.log("searchResult.js component did update");
    //價格篩選 或 有排序條件
    if (this.props.filteredData.length >= 0) {
      let dataForFilter = this.props.filteredData;
      let filters = this.props.filters;
      if (filters.priceCeiling != 100000 || filters.priceFloor != 0) {
        let dataAfterPriceFilter = [];
        //如果資料的價格介於priceCeilig以及priceFloor之間，就進行篩選
        for (let i = 0; i < dataForFilter.length; i++) {
          if (
            filters.priceFloor < dataForFilter[i].monthly_price &&
            dataForFilter[i].monthly_price <= filters.priceCeiling
          ) {
            dataAfterPriceFilter.push(dataForFilter[i]);
          }
        }
        if (this.props.filteredData.length !== dataAfterPriceFilter.length) {
          dataForFilter = dataAfterPriceFilter;
        }
      }
      if (this.props.sort) {
        let dataAfterSort = dataForFilter;
        let options = lib.func.getAll("select>option");
        switch (this.props.sort) {
          case "default":
            break;
          case "lowest":
            options[1].selected = "selected";
            dataAfterSort.sort((a, b) => {
              return a.monthly_price - b.monthly_price;
            });
            break;
          case "highest":
            options[2].selected = "selected";
            dataAfterSort.sort((a, b) => {
              return b.monthly_price - a.monthly_price;
            });
            break;
        }
        dataForFilter = dataAfterSort;
      }
      //首次資料進入會不同，已經在componentDidMount中，將completeDataForRender設為dataForFilter，並呼叫loadMoreCards來印製畫面。
      //completeDataForRender將作為比較值讓當次的render不會重新呼叫loadMoreCards，但當資料有更新時，還是會執行一次
      if (
        dataForFilter.length !== this.state.completeDataForRender.length ||
        this.props.readyForSort
      ) {
        this.setState({ completeDataForRender: dataForFilter });
        this.props.getSelect("", "disable");
        this.loadMoreCards(dataForFilter, this.state.currentLoadAmount);
      }
    }
  }
  render() {
    let filters = this.props.filters;
    return (
      <div
        className="right"
        style={{ width: this.props.leftRightWidth.rightWidth }}
        onScroll={e => {
          this.scrollToBottom(e);
        }}
      >
        <div
          className="areaSizer"
          draggable="true"
          onDragEnd={this.props.changeAreaSize}
          style={{ right: this.props.leftRightWidth.resizerRight }}
        />
        <div className="title">
          <div>台北市</div>
          <div> > </div>
          <div>行政區</div>
        </div>
        <div className="filterArea">
          <div className="filterType">
            <p>月租金</p>
            <PriceChart
              completeList={this.props.completeList}
              currentViewData={this.props.currentViewData}
              changeFilters={this.props.changeFilters}
              filteredData={this.props.filteredData}
              filters={this.props.filters}
            />
          </div>
          <div className="filterType">
            <p>房間數量</p>
            <div className="filterDetail">
              {filterCriteria.roomAmount.map((criterion, index) => {
                let roomAmountNumber = parseInt(criterion);
                let classes = lib.func.searchInsideArray(
                  filters.roomAmount,
                  criterion
                )
                  ? "roomAmount active"
                  : "roomAmount";
                return (
                  <div
                    key={index}
                    className={classes}
                    onClick={() => {
                      this.props.changeFilters("roomAmount", roomAmountNumber);
                    }}
                  >
                    {criterion}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="filterType">
            <p>房屋類型</p>
            <div className="filterDetail">
              {filterCriteria.roomType.map((criterion, index) => {
                let classes = lib.func.searchInsideArray(
                  filters.roomType,
                  criterion.roomTypeEN
                )
                  ? "roomType active"
                  : "roomType";
                return (
                  <div
                    key={index}
                    className={classes}
                    onClick={() => {
                      this.props.changeFilters(
                        "roomType",
                        criterion.roomTypeEN
                      );
                    }}
                  >
                    {criterion.roomTypeTC}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="filterType districts hidden">
            <p>行政區</p>
            <div className="filterDetail">
              {filterCriteria.district.map((criterion, index) => {
                let classes = lib.func.searchInsideArray(
                  filters.district,
                  criterion
                )
                  ? "district active"
                  : "district";
                return (
                  <div
                    key={index}
                    className={classes}
                    onClick={() => {
                      this.props.changeFilters("district", criterion);
                    }}
                  >
                    {criterion}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="filterType hidden">
            <p>有無房屋照片</p>
            <div className="filterDetail">
              {filters.photoRequired ? (
                <div
                  className="required active"
                  onClick={() => {
                    this.props.changeFilters("photoRequired", true);
                  }}
                >
                  必須有照片
                </div>
              ) : (
                <div
                  className="required"
                  onClick={() => {
                    this.props.changeFilters("photoRequired", true);
                  }}
                >
                  必須有照片
                </div>
              )}
            </div>
          </div>
          <div className="filterType amenities hidden">
            <p>必備設備</p>
            <div className="filterDetail">
              {filterCriteria.amenities.map((criterion, index) => {
                let classes = lib.func.searchInsideArray(
                  filters.amenities,
                  criterion.amenityEN
                )
                  ? "amenity active"
                  : "amenity";
                return (
                  <div
                    key={index}
                    className={classes}
                    onClick={() => {
                      this.props.changeFilters(
                        "amenities",
                        criterion.amenityEN
                      );
                    }}
                  >
                    {criterion.amenityTC}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="filterType buttons">
            <div className="button" style={{ display: "none" }}>
              <FontAwesomeIcon className="icon" icon={["far", "save"]} />
              儲存篩選組合
            </div>
            <div className="button" onClick={this.showMoreFilter}>
              更多條件
            </div>
          </div>
        </div>
        <div className="resultTitle">
          <div className="showLogic">
            <select
              onChange={e => {
                this.props.getSelect(e, "select");
              }}
            >
              <option value="default">預設排序</option>
              <option value="lowest">最低價優先</option>
              <option value="highest">最高價優先</option>
            </select>
          </div>
          <p>
            {this.state.completeDataForRender.length}
            筆結果
          </p>
          <div className="displayLogic">
            <div
              className="displayType"
              onClick={() => {
                this.props.switchDisplayMode("list");
              }}
            >
              <FontAwesomeIcon icon={["fas", "list-ul"]} />
            </div>
            <div
              className="displayType"
              onClick={() => {
                this.props.switchDisplayMode("rowBlocks");
              }}
            >
              <FontAwesomeIcon icon={["fas", "th-large"]} />
            </div>
            <div
              className="displayType"
              onClick={() => {
                this.props.switchDisplayMode("blocks");
              }}
            >
              <FontAwesomeIcon icon={["fas", "square"]} />
            </div>
          </div>
        </div>
        <div className={this.props.resultAreaDisplayType[0]}>
          {this.state.currentLoad.map((realEstate, index) => {
            let hidden = false;
            if (this.props.hiddenList != null) {
              for (let i = 0; i < this.props.hiddenList.length; i++) {
                if (realEstate.id === this.props.hiddenList[i]) {
                  hidden = true;
                }
              }
            }
            if (hidden === false) {
              return (
                <RoomPreviewCard
                  key={realEstate.index}
                  realEstate={realEstate}
                  resultAreaDisplayType={this.props.resultAreaDisplayType}
                  changeSelecteIndex={this.props.changeSelecteIndex}
                  removeFromLoveList={this.props.removeFromLoveList}
                  putIntoLoveList={this.props.putIntoLoveList}
                  loveListStatus={this.props.loveListStatus}
                  getloveListStatusIndex={this.props.getloveListStatusIndex}
                  openEmailForm={this.props.openEmailForm}
                  hideList={this.props.hideList}
                />
              );
            }
          })}
        </div>
      </div>
    );
  }
  showMoreFilter(e) {
    let filterTypes = lib.func.getAll(".filterType");
    let filterbutton = lib.func.getAll(".buttons>.button");
    if (document.body.clientWidth > 900) {
      filterTypes[3].classList.toggle("hidden");
      filterTypes[4].classList.toggle("hidden");
      filterTypes[5].classList.toggle("hidden");
      filterbutton[0].classList.toggle("hidden");
      filterbutton[1].textContent === "更多條件"
        ? (filterbutton[1].textContent = "收合條件")
        : (filterbutton[1].textContent = "更多條件");
    } else {
      filterTypes[3].classList.remove("hidden");
      filterTypes[4].classList.remove("hidden");
      filterTypes[5].classList.remove("hidden");
      for (let i = 0; i < filterTypes.length - 1; i++) {
        if (
          filterTypes[i].style.display === "" ||
          filterTypes[i].style.display === "none"
        ) {
          filterTypes[i].style.display = "flex";
        } else {
          filterTypes[i].style.display = "none";
        }
      }
      filterbutton[0].classList.toggle("hidden");
      filterbutton[1].textContent === "更多條件"
        ? (filterbutton[1].textContent = "收合條件")
        : (filterbutton[1].textContent = "更多條件");
    }
  }
  loadMoreCards(dataForFilter, loadingAmount) {
    if (dataForFilter.length > 3) {
      setTimeout(() => {
        let hasMore = this.state.currentLoad.length < loadingAmount;
        this.setState((prev, props) => ({
          currentLoad: dataForFilter.slice(
            0,
            prev.currentLoad.length + loadingAmount
          )
        }));
        if (hasMore) {
          this.loadMoreCards(dataForFilter, loadingAmount);
        }
      }, 10);
    } else {
      this.setState((prev, props) => ({
        currentLoad: dataForFilter.slice(0, 4)
      }));
    }
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
  scrollToBottom(e) {
    let scrollHeight = e.currentTarget.scrollHeight;
    let scrollTop = e.currentTarget.scrollTop;
    let clientHeight = e.currentTarget.clientHeight;
    if (scrollHeight - scrollTop < clientHeight + 600) {
      if (this.state.completeDataForRender.length < 3) {
        setTimeout(() => {
          this.loadMoreCards(this.state.completeDataForRender, 1);
        }, 0);
      } else {
        setTimeout(() => {
          this.loadMoreCards(
            this.state.completeDataForRender,
            this.state.currentLoadAmount
          );
        }, 0);
      }
    }
  }
}

export default SearchResult;
