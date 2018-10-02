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
		if (this.props.toggleEmail===true) {
			return (
				<div className="email">
					<div className="background">
						<div className="form">
							<div className="close" onClick={this.props.openEmailForm}>
								<FontAwesomeIcon className="icon" icon={['fas','times']}/>
							</div>
							<div className="title">寄信給某某某</div>
							<form id="checkAvailability">
								<input className="name formChild" type="text" placeholder="請輸入姓名" required/>
								<input className="senderEmail formChild" type="email" placeholder="Email" required/>
								<input className="phone formChild" type="tel" placeholder="電話"/>
								<input className="date formChild" type="date" placeholder="預計遷入時間"/>
								<input className="visitTime formChild" placeholder="希望拜訪時間"/>
								<textarea className="message formChild"form="checkAvailability" placeholder="簡易打招呼訊息"></textarea>
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
	}


}

export default Email;