import React from "react";
import PropTypes from 'prop-types';
import Header from "./Header.js";
import lib from "./lib.js";
import "./style/common.css";
import "./style/header.css";
import "./style/Property.css";
import "./style/email.css";
//FontAwesome主程式
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
//FontAwesome引用圖片;
import { faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes);


class Email extends React.Component {
	constructor() {
		super();
		this.state = {
	
	    };
	}

	render() {
		if (this.props.toggleEmail.open === true ) {
			return (
				<div className="email">
					<div className="background">
						<div className="form">
							<div className="close" onClick={(e)=>{this.props.openEmailForm("","","close")}}>
								<FontAwesomeIcon className="icon" icon={['fas','times']}/>
							</div>
							<div className="title">寄信給 {this.props.toggleEmail.currentDetail.host_name}</div>
							<form id="checkAvailability">
								<input className="name formChild" type="text" placeholder="請輸入姓名" required/>
								<input className="senderEmail formChild" type="email" placeholder="Email" required/>
								<input className="phone formChild" type="tel" placeholder="電話"/>
								<input className="date formChild" type="date" placeholder="預計起租日期："/>
								<input className="visitTime formChild" placeholder="希望拜訪時間"/>
								<textarea className="message formChild"form="checkAvailability" placeholder="簡易打招呼訊息"></textarea>
								<div className="remind"></div>
								<input className="submit" type="submit" value="寄送email" onClick={this.sendEmail.bind(this)}/>
							</form>
						</div>
					</div>
				</div>
			)
		} else {return <div></div>}
	
	}

	sendEmail(e) {
		e.preventDefault();
		let loadgerName = lib.func.get(".name").value;
		let lodgerEmail = lib.func.get(".senderEmail").value;
		let lodgerPhone = lib.func.get(".phone").value;
		let landlordName = this.props.toggleEmail.currentDetail.host_name;
		let landlordEmail = "snailheaventw@gmail.com";
		let visitTime = lib.func.get(".visitTime").value;
		let rentalPeriod = lib.func.get(".date").value;
		let message = lib.func.get(".message").value;
		let pictureUrl = this.props.toggleEmail.currentDetail.picture_url;
		let propertyName = this.props.toggleEmail.currentDetail.name;
		let info = {loadgerName: loadgerName, lodgerEmail: lodgerEmail, lodgerPhone: lodgerPhone, landlordName: landlordName, landlordEmail: landlordEmail, visitTime: visitTime, rentalPeriod: rentalPeriod, message: message, pictureUrl: pictureUrl, propertyName: propertyName
		}
		if ( loadgerName && lodgerEmail && lodgerPhone && visitTime && rentalPeriod ) {
			fetch("https://us-central1-snail-heaven-1537271625768.cloudfunctions.net/app/exe/sendemail", {
			    body: JSON.stringify(info), // must match 'Content-Type' header
			    method: 'POST', // *GET, POST, PUT, DELETE, etc.
			})
			.then(response => { return response.json() } )
			.then(data=>{ 
				alert("已為您寄出信件，可至您的email查看，謝謝"); 
				lib.func.get(".remind").innerHTML = "";
				this.props.openEmailForm("","","close");
			})
		} else {
			let message ="";
			if ( !loadgerName ) { message += "姓名  "}
			if ( !lodgerEmail ) { message += "Email  "}
			if ( !lodgerPhone ) { message += "電話  "}
			if ( !visitTime ) { message += "預計拜訪時間  "}
			if ( !rentalPeriod )  { message += "預計起租日期  "}
			lib.func.get(".remind").innerHTML = `以下欄位均為必填：<br />${message}，謝謝您。`;
			lib.func.get(".remind").style.color = "red"; 
			lib.func.get(".remind").style.fontSize = "10px";
		}


	}


}

export default Email;