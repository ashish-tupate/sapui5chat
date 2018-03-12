jQuery.sap.declare("sap.ui.demo.myFiori.util.Formatter");

sap.ui.demo.myFiori.util.Formatter = {

		formatDecimal : function(sValue){
			var val = parseFloat(sValue).toFixed(1);
			return val;
		}
};