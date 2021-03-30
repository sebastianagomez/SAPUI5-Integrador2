sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/Fragment",
        "Integrador2/Integrador2/util/Formatter",
        "Integrador2/Integrador2/util/Constants"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, JSONModel, MessageToast, MessageBox, Fragment, Formatter, Constants) {
		"use strict";

		return Controller.extend("Integrador2.Integrador2.controller.Detail", {
			onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this._onRoutedMatched, this)                
            },

            Formatter: Formatter,

            _onRoutedMatched: function (oEvent){
                this._productId = oEvent.getParameter("arguments")._productId;
            },
            
            onOpenDialog : function(){
                const oView = this.getView();

                if (!this._oFragment) {
                    Fragment.load({
                        id: oView.getId(),
                        name: Constants.routes.FRAGMENTS.tabDialog,
                        controller: this
                    }).then(function (oDialog) {
                        this._oFragment = oDialog;
                        this.getView().addDependent(this._oFragment);
                        this._oFragment.open();
                }.bind(this));
                    return;
                }
                this._oFragment.open();
            },

            onCloseDialog : function(){
                this.byId(Constants.ids.FRAGMENTS.tabDialog).close();
            },

            funcCancel: function () {
			    MessageBox.confirm("¿Está seguro que desea borrar?");
            },
            
            funcCopy: function () {
			    MessageBox.success("¡Copiado en el portapapeles!");
		    }
		});
	});
