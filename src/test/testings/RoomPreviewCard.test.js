import React from "react";
import { shallow, mount, render } from "enzyme";
import { createSerializer } from "enzyme-to-json";
import renderer from "react-test-renderer";
import RoomPreviewCard from "../../../src/RoomPreviewCard.js";
import List from "../../../src/List.js";
import { firebaseApp } from "../../../src/firebaseApp.js";
import data  from "./testing_data/data.js";
expect.addSnapshotSerializer( createSerializer( { mode: "deep" } ) );

//test whether roomPreviewCard render correctly
jest.mock( "./imgs/airbnb.png", () => "airbnb.png" );


describe ( "RoomPreviewCard relevant tests", () => {
  it( "data is acquired from firebase correctly", done => {
    firebaseApp.fBaseDB.getDetailByIDWithPromise(data.realEstate.id)
    .then( ( dataFromFB ) => {
      // console.log(dataFromFB);
      expect(typeof dataFromFB).toBe("object");
      expect(dataFromFB["8251"].id).toBe(data.realEstate.id)
      expect(dataFromFB["8251"].price).toBe(data.realEstate.price + ".00");
      done();
    })
  })
	it( "roomPreviewCard renders correctly" , () => {
	  const wrapper = mount(
      <RoomPreviewCard 
      realEstate = {data.realEstate}
      resultAreaDisplayType = {data.resultAreaDisplayType}
      changeSelecteIndex = { () => {} }
      removeFromLoveList = { () => {} }
      putIntoLoveList = { ()=>{} }
      loveListStatus = { data.loveListStatus }
      getloveListStatusIndex={ ()=>{return 0} }
      openEmailForm = { ()=>{} }
      hideList = { ()=>{} }
      />
	  );
    let price = wrapper.find(".price").text();
    expect(price).toEqual("$2,212");
	  expect(wrapper).toMatchSnapshot();
	})
})
















// it( "List is rendered correctly", () => {
//   const wrapper = mount(
//     <List 
//       goLoveList= {false}
//       goLoveListPage={()=>{}}
//       completeList={realEstate}
//       loveListStatus={loveListStatus}
//       loveListDetail={[realEstate]}
//       openEmailForm={()=>{}}
//       selectedIndex={-1}
//       goPropertyPage={false}
//       changeSelecteIndex={()=>{}}
//       addSelectedIndex={()=>{}}
//       removeSelectedIndex={()=>{}}
//       putIntoLoveList={()=>{}}
//       removeFromLoveList={()=>{}}
//       getloveListStatusIndex={()=>{return 0;}}
//       currentViewData={realEstate}
//       filteredData={[realEstate]}
//       changeFilters={()=>{}}
//       filters={ filters }
//     />
//   );

//   // wrapper.instance().goSimpleDetail(realEstate.id, realEstate);
//   // wrapper.update();
//   // console.log(wrapper.state().toggleSimpleDetail)

//   // expect(wrapper.props().selectedIndex).toEqual(true);
//   // wrapper.setState({toggleSimpleDetail: true, currentSimpleDetail: realEstate})
//   // expect( wrapper ).toMatchSnapshot();
//  	  expect(wrapper).toMatchSnapshot();
// });
