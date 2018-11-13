import React from "react";
import PropTypes from "prop-types";
import lib from "./lib.js";
import "./style/priceChart.css";

let originXLeft;
let originXRight;
let left = null;
let right = null;

class PriceChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      right: 0,
      leftMoney: 0,
      rightMoney: 100000,
      originXLeft: 0,
      originXRight: 0,
      priceCeiling: 100000,
      priceFloor: 0,
      price: []
    };
    this.currentLeft = this.currentLeft.bind(this);
    this.confirmLeft = this.confirmLeft.bind(this);
    this.currentRight = this.currentRight.bind(this);
    this.confirmRight = this.confirmRight.bind(this);
    this.startToMove = this.startToMove.bind(this);
    this.mergeMoney = this.mergeMoney.bind(this);
    this.defineChartRange = this.defineChartRange.bind(this);
  }
  componentDidMount() {
    if (
      (this.props.filters.priceCeiling !== this.state.priceCeiling ||
        this.props.filters.priceFloor !== this.state.priceFloor) &&
      this.state.priceCeiling === 100000
    ) {
      let width = lib.func.get(".control").offsetWidth;
      let left = Math.round(
        (this.props.filters.priceFloor / 500) * ((width - 16) / 200)
      );
      let right =
        lib.func.get(".control").offsetWidth -
        Math.round(
          (this.props.filters.priceCeiling / 500) * ((width + 16) / 200)
        );
      let front = lib.func.get(".control>.front");
      front.style.width = width - left - right + "px";
      front.style.left = left + "px";
      this.setState({
        priceFloor: this.props.filters.priceFloor,
        priceCeiling: this.props.filters.priceCeiling,
        left: left,
        right: right,
        leftMoney: this.props.filters.priceFloor,
        rightMoney: this.props.filters.priceCeiling
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {}

  render() {
    let priceArray = [];
    let rangeAmountOfPrice = [];
    let maxLength = 0;
    this.props.filteredData.map((realEstate, index) => {
      priceArray.push(realEstate.monthly_price);
    });
    // 這邊把所有資產分門別類的２００個區間內
    for (let i = 0; i < 99501; i += 500) {
      let priceContent;
      if (i === 99500) {
        priceContent = priceArray.filter(price => price > i);
      } else {
        priceContent = priceArray.filter(
          price => price > i && price <= i + 500
        );
      }
      let length = priceContent.length;
      rangeAmountOfPrice.push(length);
      if (length > maxLength) {
        maxLength = length;
      }
    }

    return (
      <div className="filterDetail priceChart">
        <div className="bars">
          {priceArray.length !== 0 &&
            rangeAmountOfPrice.map((count, index) => {
              let heightPerUnit = 61 / maxLength;
              let height = rangeAmountOfPrice[index] * heightPerUnit;
              let currentPrice = 500 + index * 500;
              if (
                currentPrice > this.state.priceFloor &&
                currentPrice <= this.state.priceCeiling
              ) {
                return (
                  <div
                    className="cashBar"
                    style={{ height: `${height}px` }}
                    key={index}
                  />
                );
              } else {
                return (
                  <div
                    className="cashBar"
                    style={{
                      height: `${height}px`,
                      backgroundColor: "#DEE2E3"
                    }}
                    key={index}
                  />
                );
              }
            })}
        </div>
        <div className="control">
          <div
            className="circle left"
            style={{ left: this.state.left }}
            onMouseDown={this.startToMove}
            onTouchStart={this.startToMove}
          >
            <span className="money">{this.state.leftMoney}</span>
          </div>
          <div className="bottomLine front" />
          <div className="bottomLine grey" />
          <div
            className="circle right"
            style={{ right: this.state.right }}
            onMouseDown={this.startToMove}
            onTouchStart={this.startToMove}
          >
            <span className="money">{this.state.rightMoney}</span>
          </div>
        </div>
      </div>
    );
  }

  startToMove(e) {
    if (e.type === "mousedown") {
      if (e.currentTarget.classList[1] === "left") {
        this.setState({ originXLeft: e.screenX });
        document.addEventListener("mouseup", this.currentLeft);
        document.addEventListener("mousemove", this.confirmLeft);
      } else if (e.currentTarget.classList[1] === "right") {
        this.setState({ originXRight: e.screenX });
        document.addEventListener("mouseup", this.currentRight);
        document.addEventListener("mousemove", this.confirmRight);
      }
    } else if (e.type === "touchstart") {
      if (e.currentTarget.classList[1] === "left") {
        this.setState({ originXLeft: e.touches[0].screenX });
        document.addEventListener("touchend", this.currentLeft);
        document.addEventListener("touchmove", this.confirmLeft);
      } else if (e.currentTarget.classList[1] === "right") {
        this.setState({ originXRight: e.touches[0].screenX });
        document.addEventListener("touchend", this.currentRight);
        document.addEventListener("touchmove", this.confirmRight);
      }
    }
  }

  currentLeft(event) {
    // 首先把位置以及價錢做出
    let width = lib.func.get(".control").offsetWidth;
    let screenX =
      event.type === "mouseup"
        ? event.screenX
        : event.changedTouches[0].screenX;
    let finalLeft = this.state.left + (screenX - this.state.originXLeft);
    //這邊的２２是width加上border
    if (finalLeft < 0) {
      finalLeft = 0;
    } else if (finalLeft > width - 16) {
      finalLeft = width - 16;
    }
    //顯示區間數字，將區間數字轉換為５００為單位
    let moveCashTranform =
      Math.round((finalLeft - 0) / ((width - 16) / 200)) * 500;
    lib.func.get(
      ".priceChart>.control>.left>.money"
    ).innerHTML = moveCashTranform;
    // lib.func.get(".priceChart>.control>.left").style.left = finalLeft + "px";
    document.removeEventListener("mousemove", this.confirmLeft);
    document.removeEventListener("mouseup", this.currentLeft);
    document.removeEventListener("touchmove", this.confirmLeft);
    document.removeEventListener("touchend", this.currentLeft);
    this.setState({ left: finalLeft, leftMoney: moveCashTranform });
    // 接著setState，判斷天花板/地板，也要同時注意是否左右已經換邊
    if (this.state.rightMoney > moveCashTranform) {
      this.setState({
        priceCeiling: this.state.rightMoney,
        priceFloor: moveCashTranform
      });
      this.props.changeFilters("priceFloor", moveCashTranform);
      this.props.changeFilters("priceCeiling", this.state.rightMoney);
    } else if (this.state.rightMoney < moveCashTranform) {
      this.setState({
        priceCeiling: moveCashTranform,
        priceFloor: this.state.rightMoney
      });
      this.props.changeFilters("priceFloor", this.state.rightMoney);
      this.props.changeFilters("priceCeiling", moveCashTranform);
    }
    // 這邊是針對底線的部分進行變色判斷，判斷底線寬度；如果換邊則邏輯也會不一樣
    this.defineChartRange();
    //針對價錢
    this.mergeMoney();
  }
  confirmLeft(event) {
    let width = lib.func.get(".control").offsetWidth;
    let screenX =
      event.type === "mousemove"
        ? event.screenX
        : event.changedTouches[0].screenX;
    let finalLeft = this.state.left + (screenX - this.state.originXLeft);
    //這邊的16是width加上border
    if (finalLeft < 0) {
      finalLeft = 0;
    } else if (finalLeft > width - 16) {
      finalLeft = width - 16;
    }
    //顯示區間數字，將區間數字轉換為５００為單位
    let moveCashTranform =
      Math.round((finalLeft - 0) / ((width - 16) / 200)) * 500;
    lib.func.get(
      ".priceChart>.control>.left>.money"
    ).innerHTML = moveCashTranform;
    lib.func.get(".priceChart>.control>.left").style.left = finalLeft + "px";
    this.mergeMoney();
  }

  currentRight(event) {
    let width = lib.func.get(".control").offsetWidth;
    let screenX =
      event.type === "mouseup"
        ? event.screenX
        : event.changedTouches[0].screenX;
    let finalRight = this.state.right + (this.state.originXRight - screenX);
    if (finalRight < 0) {
      finalRight = 0;
    } else if (finalRight > width - 16) {
      finalRight = width - 16;
    }
    //顯示區間數字，將區間數字轉換為５００為單位
    let moveCashTranform =
      100000 - Math.round((finalRight - 0) / ((width - 16) / 200)) * 500;
    lib.func.get(
      ".priceChart>.control>.right>.money"
    ).innerHTML = moveCashTranform;
    lib.func.get(".priceChart>.control>.right").style.right = finalRight + "px";
    if (event.type === "mouseup") {
      document.removeEventListener("mousemove", this.confirmRight);
      document.removeEventListener("mouseup", this.currentRight);
    } else {
      document.removeEventListener("touchmove", this.confirmRight);
      document.removeEventListener("touchend", this.currentRight);
    }

    this.setState({ right: finalRight, rightMoney: moveCashTranform });

    if (this.state.leftMoney > moveCashTranform) {
      this.setState({
        priceCeiling: this.state.leftMoney,
        priceFloor: moveCashTranform
      });
      this.props.changeFilters("priceFloor", moveCashTranform);
      this.props.changeFilters("priceCeiling", this.state.leftMoney);
    } else if (this.state.leftMoney < moveCashTranform) {
      this.setState({
        priceCeiling: moveCashTranform,
        priceFloor: this.state.leftMoney
      });
      this.props.changeFilters("priceFloor", this.state.leftMoney);
      this.props.changeFilters("priceCeiling", moveCashTranform);
    }
    this.defineChartRange();
    //距離太近時，價錢進行合併
    this.mergeMoney();
  }

  confirmRight(event) {
    let width = lib.func.get(".control").offsetWidth;
    let screenX =
      event.type === "mousemove"
        ? event.screenX
        : event.changedTouches[0].screenX;
    let finalRight = this.state.right + (this.state.originXRight - screenX);
    if (finalRight < 0) {
      finalRight = 0;
    } else if (finalRight > width - 16) {
      finalRight = width - 16;
    }
    let moveCashTranform =
      100000 - Math.round((finalRight - 0) / ((width - 16) / 200)) * 500;
    lib.func.get(
      ".priceChart>.control>.right>.money"
    ).innerHTML = moveCashTranform;
    lib.func.get(".priceChart>.control>.right").style.right = finalRight + "px";
    this.mergeMoney();
  }

  mergeMoney() {
    let left = lib.func.get(".priceChart>.control>.left");
    let right = lib.func.get(".priceChart>.control>.right");
    let leftMoney = lib.func.get(".priceChart>.control>.left>.money");
    let rightMoney = lib.func.get(".priceChart>.control>.right>.money");
    let LeftX = left.getBoundingClientRect().x;
    let RightX = right.getBoundingClientRect().x;
    let separatePrice = false;
    if (LeftX < RightX) {
      if (LeftX + 90 > RightX) {
        leftMoney.innerHTML =
          this.state.priceFloor + "-" + this.state.priceCeiling;
        rightMoney.style.visibility = "hidden";
        leftMoney.style.left = "-30px";
      } else if (rightMoney.style.visibility === "hidden") {
        separatePrice = true;
      }
    } else if (LeftX > RightX) {
      if (RightX + 90 > LeftX) {
        leftMoney.innerHTML =
          this.state.priceFloor + "-" + this.state.priceCeiling;
        rightMoney.style.visibility = "hidden";
        leftMoney.style.right = "-30px";
      } else if (rightMoney.style.visibility === "hidden") {
        separatePrice = true;
      }
    }
    if (separatePrice === true) {
      leftMoney.innerHTML = this.state.leftMoney;
      rightMoney.style.visibility = "visible";
      leftMoney.style.left = "auto";
      leftMoney.style.right = "auto";
    }
  }

  defineChartRange() {
    // 這邊是針對底線的部分進行變色判斷，判斷底線寬度；如果換邊則邏輯也會不一樣
    let front = lib.func.get(".control>.front");
    let width = lib.func.get(".control").offsetWidth;
    let leftOfLeft = lib.func.get(".priceChart>.control>.left").offsetLeft;
    let rightOfLeft = width - leftOfLeft; //因為Left circle的 position right從來沒有定義過，所以永遠抓不到，幫哭
    let leftOfRight = lib.func.get(".priceChart>.control>.right").offsetLeft;
    let rightOfRight =
      parseInt(lib.func.get(".priceChart>.control>.right").style.right) || 0;
    let leftX = lib.func
      .get(".priceChart>.control>.left")
      .getBoundingClientRect().x;
    let rightX = lib.func
      .get(".priceChart>.control>.right")
      .getBoundingClientRect().x;
    front.style.width = width - leftOfLeft - rightOfRight + "px";
    front.style.left = leftOfLeft + "px";
    if (rightX - leftX <= 0) {
      front.style.width = width - leftOfRight - rightOfLeft + "px";
      front.style.left = leftOfRight + "px";
    }
  }
}

export default PriceChart;
