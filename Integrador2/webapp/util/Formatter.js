jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([

    "Integrador2/Integrador2/util/Constants",

], function(Constants) {
    'use strict';
    return{

        formatPrecio: function(nPrecio){
            if(!nPrecio){
                return;
            }else{
                let pValor = Math.floor(nPrecio* 100) / 100;
                return pValor+" USD";
            }
        },

        formatStock: function(nStock){
            if(nStock === 0){
                return "Out Stock"
            }else if(nStock >= 1 && nStock < 20){
                return "Little Stock"
            }else{
                return "In Stock"
            }
        },

        formatStockColor: function(nStock){
            if(nStock === 0){
                return "Error"
            }else if(nStock >= 1 && nStock < 10){
                return "Warning"
            }else{
                return "Success"
            }                
        },       

}}, true);