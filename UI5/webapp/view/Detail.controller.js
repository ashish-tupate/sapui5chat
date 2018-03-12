jQuery.sap.require("sap.ui.demo.myFiori.util.Formatter");

sap.ui.controller("sap.ui.demo.myFiori.view.Detail", {
	onInit : function(){
		
		if( jQuery.device.is.phone == true){
			sap.ui.getCore().byId("Detail--pageDetails").setShowNavButton(true);
		}
	},
	
	handleNavButtonPress : function (evt) {
		this.nav.back("Master");
		sap.ui.getCore().byId("Master--list").setSelectedItemById(sap.ui.getCore().byId("Master--list").getSelectedItem().sId,false);
	},
	
	onPost: function (oEvent) {
	    var oFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({style: "medium"});
	    var oDate = new Date();
	    var sDate = oFormat.format(oDate);
	    // create new entry
	    var sValue = sap.ui.getCore().byId("Detail--fdIp").getValue();
	    var oEntry = {
	      Author : loggedInUser,
	      AuthorPicUrl : "http://upload.wikimedia.org/wikipedia/commons/a/aa/Dronning_victoria.jpg",
	      Type : "Reply",
	      Date : "" + sDate,
	      Text : sValue
	    };

	    // update model	
	    var oModel = sap.ui.getCore().byId("Detail--idTable").getModel();
	    //var oModel = sap.ui.getCore().byId("Master--list").getModel().getData()[rowNum].model;
	    var aEntries = oModel.getData();
	    aEntries.push(oEntry);
	    oModel.setData(aEntries);
	    oModel.updateBindings();	    
	    //sap.ui.getCore().byId("Detail--idTable").setModel(oModel);
	    
	    //Now send the message to the server
	    //webSocket.send("ACTION~CHAT|FROM~"+ loggedInUser +"|TO~shalvi|MSG~"+sValue);	    
	    webSocket.send("ACTION~CHAT|FROM~"+ loggedInUser +"|TO~" + aUserList[rowNum].userName + "|MSG~"+sValue);
	  }
});