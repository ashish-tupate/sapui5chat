jQuery.sap.require("sap.ui.demo.myFiori.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.controller("sap.ui.demo.myFiori.view.Master", {

	onInit: function() {
		var person = prompt("Please enter your name", "Harry Potter");
		if (person != null) {
			//document.getElementById("demo").innerHTML =
			//"Hello " + person + "! How are you today?";
			loggedInUser = person;
		}

		masterController = this;
		//loggedInUser = "Shubham";
		flag=0;

		this.getView().byId("idPage").setTitle("Welcome: "+loggedInUser);
		var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});
		var oDate = new Date();
		var sDate = oFormat.format(oDate);		

		/*var aData=[];		
	    oModel = new sap.ui.model.json.JSONModel(aData);
	    sap.ui.getCore().byId("Detail--idTable").setModel(oModel);*/

		count=0;
		getUsers=0;

		webSocket = new WebSocket('wss://websocketp1692999389trial.hanatrial.ondemand.com/WebSocket/chatApp/'+loggedInUser);	    	    
		webSocket.onerror = function(evt) {  
			masterController.onError(evt);
		};  
		webSocket.onopen = function(evt) {  
			masterController.onOpen(evt); 
		};  
		webSocket.onmessage = function(evt) {  
			masterController.onMessage(evt);  
		};  
		
		$(document).keyup(function(e) {
			if(e.target.id == "Detail--fdIp-textArea-inner"){
				 e.which = e.which || e.keyCode;
				 if(e.which == 13) {
					 sap.ui.getCore().byId("Detail--fdIp").firePost();
					 sap.ui.getCore().byId("Detail--fdIp").setValue("");
				 }
			}			
		});
	},
	onOpen : function (evt){
		//alert("ON OPEN");
	},
	onError : function (evt){
		//alert("ON ERROR");
	},
	onClose : function (evt){
		alert("ON CLOSE");
	},
	onMessage : function (evt){		
		//When new user
		if(evt.data.substring(0,7)=="JOINED~" && getUsers!=0){
			var string = evt.data;
			string = string.substring(7,string.length);

			var flagFound=false;
			for(var index=0;index<aUserList.length;index++){
				if(aUserList[index].userName==string){
					flagFound=true;
				}			
			}
			if(flagFound==false){
				var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});
				var oDate = new Date();
				var sDate = oFormat.format(oDate);
				var tempData = [{
					Author : loggedInUser,
					AuthorPicUrl : "http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg",
					Type : "Reply",
					Date : "" + sDate,
					//Text : "Welcome: "+ resultString[index]
					Text : "Now you can start chatting!!"
				}];
				aUserList.push({userName: string, model: new sap.ui.model.json.JSONModel(tempData), unread: 0});
				sap.ui.getCore().byId("Master--list").getModel().updateBindings(false);				
			}
			var temp;
		}

		//For the first time, you want to get online users list
		if(getUsers==0){			
			webSocket.send("ACTION~GET_USERS_LIST|");
			getUsers++;
			count++;
		}

		//Below if true, when we called GET_USERS_LIST
		if(evt.data.substring(0, 12) == "ONLINEUSERS~"){
			var string = evt.data;
			string = string.replace("~","|");
			var resultString = string.split("|");

			aUserList=[]; //Global Variable
			var empty=[];

			var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			//In the loop you dont want 1st and last element
			for(var index=1;index<resultString.length-1;index++){
				//var tempData = [{text: "Welcome "+resultString[index]}];

				var tempData = [{
					Author : loggedInUser,
					AuthorPicUrl : "http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg",
					Type : "Reply",
					Date : "" + sDate,
					//Text : "Welcome: "+ resultString[index]
					Text : "Now you can start chatting!!"
				}];
				//If user is same as logged in user, then don't add it				
				if(resultString[index]!=loggedInUser){
					aUserList.push({userName: resultString[index], model: new sap.ui.model.json.JSONModel(tempData), unread: 0});
					//aUserList.push({userName: resultString[index]});
				}
			}			
			var modelMasterList = new sap.ui.model.json.JSONModel(aUserList);
			sap.ui.getCore().byId("Master--list").setModel(modelMasterList);

			//Now for detail screen
			//create model for each user
			/*var aModel=[];		    
		    for(var index=0;index<aUserList.length;index++){
		    	aModel.push(new sap.ui.model.json.JSONModel([]));
		    }*/

			//var aData=[];		
			//oModel = new sap.ui.model.json.JSONModel(aData);
			//sap.ui.getCore().byId("Detail--idTable").setModel(aModel[0]);
		}

		//When connection is closed
		if(evt.data.substring(0,7)=="CLOSED~"){
			var string = evt.data;
			string = string.substring(7,string.length);
			//now remove this user from the model
			for(var index=0;index<aUserList.length;index++){
				if(aUserList[index].userName==string){
					aUserList.splice(index,1);
					sap.ui.getCore().byId("Master--list").getModel().updateBindings(false);
					sap.ui.getCore().byId("Detail--idTable").getModel().setData([]);
					sap.ui.getCore().byId("Detail--idTable").getModel().updateBindings(false);
					break;
				}			
			}
			var context = null;
			this.nav.to("Empty", context);
		}

		//When receiving data
		if(evt.data.substring(0,13)=="RESPONSE~CHAT"){
			var string = evt.data.split("|");

			//string[0]="RESPONSE~CHAT";
			//string[1]="FROM~asdf";
			//string[2]="TO~shubham";
			//string[3]="MSG~HELLO";	
			var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});
			var oDate = new Date();
			var sDate = oFormat.format(oDate);

			var oData = {
					Author : string[1].substring(5,string[1].length),
					AuthorPicUrl : "http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg",
					Type : "Reply",
					Date : sDate,
					Text : string[3].substring(4,string[3].length)
			};
//			var data = sap.ui.getCore().byId("Detail--idTable").getModel().getData();

			var selUname = sap.ui.getCore().byId("Master--list")._oSelectedItem; //.mProperties.title
			if(selUname != null){
				selUname = selUname.mProperties.title;
			}

			var sender = string[1].split("~");
			sender = sender[1];
			var model = null;
			for(var index=0;index<aUserList.length;index++){
				if(aUserList[index].userName == sender){
					model = aUserList[index].model;
					data = model.getData();
					if(selUname != sender){
						aUserList[index].unread = aUserList[index].unread+1;
						break;
					}	
				}
			}

			data.push(oData);
			if(selUname == sender){
				sap.ui.getCore().byId("Detail--idTable").setModel(model);
				sap.ui.getCore().byId("Detail--idTable").getModel().updateBindings();
				$("#Detail--pageDetails-scroll").scrollTop(500);
			}
			sap.ui.getCore().byId("Master--list").getModel().updateBindings();

			var temp;
		}
	},
	onClose : function (evt){
		alert("ON CLOSE");
	},	
	handleListItemPress : function (oEvent) {
		var context = oEvent.getSource().getBindingContext();
		this.nav.to("Detail", context);
	},
	handleListSelect : function (evt) {
		var context = evt.getSource().getBindingContext();
		this.nav.to("Detail", context);

		var arrayA = evt.mParameters.listItem.sId.split("-");		
		rowNum = arrayA.pop();
		var object = sap.ui.getCore().byId("Master--list").getModel().getData()[rowNum].model;
		sap.ui.getCore().byId("Master--list").getModel().getData()[rowNum].unread = 0;
		sap.ui.getCore().byId("Detail--idTable").setModel(object);
		sap.ui.getCore().byId("Master--list").getModel().updateBindings(false);

		/*var tempModel =  new sap.ui.model.json.JSONModel([]);
		if(object.getData().length==1 && flag==0){			
			sap.ui.getCore().byId("Detail--idTable").setModel(tempModel);
		}else if(flag==0){
			flag=1;
			//object.getData().splice(0,1);
			sap.ui.getCore().byId("Detail--idTable").setModel(object);		
		}*/		


		//var aData=[];		
		//oModel = new sap.ui.model.json.JSONModel(aData);
		//sap.ui.getCore().byId("Detail--idTable").setModel(oModel);

		//var context = evt.getParameter("listItem").getBindingContext();
		//this.nav.to("Detail", context);
	},
	handleSearch : function (oEvent) {
		// create model filter
		var oFilter = null
		// get list binding
		var oList = this.getView().byId("list");
		var oBinding = oList.getBinding("items");
		var sQuery = oEvent.getParameter("query");
		if (sQuery && sQuery.length > 0) {
			oFilter = new sap.ui.model.Filter("SalesOrderId", sap.ui.model.FilterOperator.Contains, sQuery);
			oBinding.filter([oFilter]);
		}
		else {
			oBinding.filter(null);
		}
	},
	liveChangeSearchField : function(evt){
		var query = evt.mParameters.newValue;	
		//var data = oJsonModelPO.getData();
		var data = aUserList;
		
		var filterArray = [], count=0;
		for (var i = 0; i < data.length; i++){		  
		  if (data[i].userName.indexOf(query)>-1){
			  //Mil Gya
			  filterArray[count++] = data[i];			  
		  }
		}
		
		var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(filterArray);
	    sap.ui.getCore().byId("Master--list").setModel(oModel);
	    oModel.updateBindings(false);		
	},
});