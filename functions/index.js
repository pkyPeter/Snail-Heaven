const functions = require('firebase-functions');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
const credentials = require('./credential/credential.js')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Express
const express = require("express");
const bodyParser = require("body-parser");
//因為這裡有這個，所以東西送過來不用在parse
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/exe/", function(req, res, next){
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
	res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
	res.set("Access-Control-Allow-Credentials", "true");
	next();
});

admin.initializeApp();

app.post("/exe/sendemail", (req, res)=>{
	let data = JSON.parse(req.body);
	console.log("進來哦你")
	console.log(data);
	console.log(data.loadgerName);
	if ( data && data.loadgerName ) {
		sendemail(data.loadgerName, data.lodgerEmail, data.lodgerPhone, data.landlordName, data.landlordEmail, data.visitTime, data.rentalPeriod, data.message, data.pictureUrl, data.propertyName);
		res.send({success: "You mail has been sent"});
	} else {
		res.send({ error: "您所填之資料不齊，請重新檢查後輸入"});
	}
});

let sendemail = function( loadgerName, lodgerEmail, lodgerPhone, landlordName, landlordEmail, visitTime, rentalPeriod, message, pictureUrl, propertyName ){
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.pass
        }
    });
	let options = {
		//寄件者
		from: 'snailheaventw@gmail.com',
		//收件者
		to: landlordEmail, 
		//副本
		cc: lodgerEmail,
		//密件副本
		bcc: '',
		//主旨
		subject: `來自${loadgerName}的詢問`, // Subject line
		//純文字
		text: 'Hello world2', // plaintext body
		//嵌入 html 的內文
		html: `<body>
  <div class="index" style="	position: relative;
	width: 100%;  background-image: url('https://firebasestorage.googleapis.com/v0/b/snail-heaven-1537271625768.appspot.com/o/r_056%20Shady%20Water.png?alt=media&token=de01d13f-ebd5-4b6e-a3c5-83079edd36fc'); background-size: cover; padding: 10% 0;">
    <div class="formContainer" style="	width: 100%;
	text-align: center;">
      <div class="form" style="
	width: 60%;
	margin: 0 auto;    justify-content: center;
	padding: 30px;
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 4px;
	box-shadow: 1px 1px 3px grey;
	position: relative;">
        <div class="infobox" style="width: 85%; margin: 0 auto;">
  <div class="snail" style="	width: 46px;
                                    margin: 0 auto;
	height: 46px;
	background-position: center;
	background-size: cover;
	background-image: url('https://firebasestorage.googleapis.com/v0/b/snail-heaven-1537271625768.appspot.com/o/snail.png?alt=media&token=e7573bab-8417-4575-baf5-b9a892293e3a');"></div>

        <h2 class="formItem" style="font-weight: 100;
	font-size: 1.8em;
  margin: 10px 0px 20px 0px;">看房需求函</h2>
          <div class="photo" style="  width: 100%;
  padding-bottom: 60%;
  margin-bottom: 20px;
  border-radius: 4px;
  background-size: cover;
  background-position: bottom;
  background-image: url(${pictureUrl});
  box-shadow: 1px 1px 3px grey;"> </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="  width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">房產名稱</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${propertyName}</p>
          </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="  width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">房客姓名</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${loadgerName}</p>
          </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="  width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">房東姓名</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${landlordName}</p>
          </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">房客電話</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${lodgerPhone}</p>
          </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="  width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">希望拜訪時間</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${visitTime}</p>
          </div>
          <div class="info" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;">
            <h4 style="  width: 50%;
  text-align: left;
  font-weight: 400;
  position: relative;
  font-size: 1em;  
  margin: 0px 0px;">租期</h4>
            <p style="  text-align: left;
  width: 50%;
  font-weight: 200;
  margin: 0px 0px;
">${rentalPeriod}</p>
          </div>
          <div class="info message" style="  width: 100%;
  text-align: center;  
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 10px; border-bottom: 0.5px rgb(208, 211, 212) solid">
            <h4 style="  width: 50%;
  margin: 0px; text-align: left; font-weight:400">簡易問候與備註</h4>
            <p style=" text-align: left;
                      margin:0px 0px 20px 0px;
  width: 50%;
  flex-shrink:0;
  font-weight: 200;
  word-break: break-all; " class="message">${message}</p>
          </div>
          <footer style="width: 100%; color: rgb(208, 211, 212); font-size: 0.6em; text-align: center; margin-top: 20px;">以上由 Snail Heaven 寄出，雙方可逕行聯絡，並請依需求締結房產合約，謝謝。<br />
        </footer> 
        <a style="width: 85%; color: rgb(208, 211, 212); font-size: 0.6em; text-align: center; margin-top: 20px;" href="https://snail-heaven-1537271625768.firebaseapp.com/">Snail Heaven 官網</a>
        </div>

      </div>
    </div>
  </div>
</body>`, 
	};

    transporter.sendMail(options, function(error, info){
        if(error){
            console.log(error);
            res.send({error:error})
        }else{
            console.log('訊息發送: ' + info.response);
            res.send({message: "You have sent out the message to the landlord."})
        }
    });

}

// html: `<h2>${visitTime}</h2> <h3>房客姓名：${loadgerName}</h3> <h3>房東姓名：${landlordName}</h3> <h3>房客電話：${lodgerPhone}</h3> <p>希望拜訪時間：${visitTime}<br />租期：${rentalPeriod}<br />給房東捎封信：${message}</p>`

exports.app=functions.https.onRequest(app);