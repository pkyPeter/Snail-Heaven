import React from "react";
// import "./setupEnzyme.js";
import { shallow, mount, render } from "enzyme";
import { createSerializer } from "enzyme-to-json";
import renderer from "react-test-renderer";
import Apartments from "../../../src/Apartments.js";
import { firebaseApp } from "../../../src/firebaseApp.js";
import data from "./testing_data/data.js";
import googleMap from "../../../src/GoogleMap.js";
expect.addSnapshotSerializer( createSerializer( { mode: "deep" } ) );
jest.mock( "./imgs/airbnb.png", () => "airbnb.png" );

describe( "Apartments relevant tests", () => {
  const wrapper = mount( <Apartments /> );
  let instance = wrapper.instance();
  let realEstateArray = [data.realEstate];
  // wrapper.setState({filteredData: data.realEstateForFilter});
  wrapper.update();
  it( "Apartments is rendered correctly" , () => { 
    expect(wrapper).toMatchSnapshot();
  });

  it( "Get Complete Detail from firebase Successfully" , ( done ) => {
    // jest.setTimeout( 100000 );
    // firebaseApp.fBaseDB.getDataNew( "listings" )
    // .then( ( dataFromFB ) => {
    //   expect( typeof dataFromFB ).toBe( "object" );
    //   setTimeout( ()=>done(), 5000 );
    // })
    done();
  })

  it( "Confirm Price Transfer Into Number" , () => {
      let realEstateList = data.realEstateForFilter;
      instance.transferPriceIntoNumber(realEstateList);
      let priceIsNumber = false;
      for ( let i = 0 ; i < realEstateList.length ; i ++ ) {
        if ( typeof realEstateList[i].monthly_price === "number" ) {
          priceIsNumber = true;
        }
      }  
      expect(priceIsNumber).toBe(true);
  })

  it( "Open Love List, goLoveList will open" , ()=>{
    let searchFav = wrapper.find(".searchFav");
    searchFav.simulate("click");
    wrapper.update();
    expect(wrapper.state().goLoveList).toEqual(true);
    expect(wrapper.find(".filterType").length).toEqual(0);
    expect(wrapper).toMatchSnapshot();
  })

  it( "Open Email Form" , ()=>{
    instance.openEmailForm(data.realEstate);
    expect(wrapper.state().toggleEmail.open).toEqual(true);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  })

  //test whether filter could function with different types
  it( "Do Room Amount Filter Successfully" , () => {
    let filteredData = instance.doFilter("roomAmount", [1], data.realEstateForFilter);
    let RoomofFilteredDataEqualToOne = false;
    for ( let i = 0 ; i < filteredData.length ; i ++ ) {
      if ( filteredData[i].bedrooms ===  "1") {
        RoomofFilteredDataEqualToOne = true;
      }
    }  
    expect(RoomofFilteredDataEqualToOne).toBe(true);
  })
  it( "Do Room Type Filter Successfully" , () => {
    let filteredData = instance.doFilter("room_type", ["SR"], data.realEstateForFilter);
    let RoomofFilteredDataEqualToSR = false;
    for ( let i = 0 ; i < filteredData.length ; i ++ ) {
      if ( filteredData[i].room_type ===  "SR") {
        RoomofFilteredDataEqualToSR = true;
      }
    }  
    expect(RoomofFilteredDataEqualToSR).toBe(true);
  })
  it( "Do District Filter Successfully" , () => {
    let filteredData = instance.doFilter("district", ["大安區"], data.realEstateForFilter);
    let RoomofFilteredDataEqualToDistrict = false;
    for ( let i = 0 ; i < filteredData.length ; i ++ ) {
      if ( filteredData[i].district ===  "大安區") {
        RoomofFilteredDataEqualToDistrict = true;
      }
    }  
    expect(RoomofFilteredDataEqualToDistrict).toBe(true);
  })
})
