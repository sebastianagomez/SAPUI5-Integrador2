jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([

    "Integrador2/Integrador2/util/Constants",

], function(Constants) {
    'use strict';
    return{

        formatColor: function(nPeso){

            if(!nPeso){
                return;
            } else{
                nPeso = parseFloat(nPeso);
                if(nPeso < 1){
                    return "Success"
                } else if (nPeso >= 1 && nPeso <= 2){
                    return "Warning"
                } else {
                    return "Error";
                }
            }
        },

}}, true);