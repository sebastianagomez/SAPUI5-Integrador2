sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/Device",
        "sap/ui/model/json/JSONModel",
        "Integrador2/Integrador2/util/Services",
        "Integrador2/Integrador2/util/Formatter",
        "Integrador2/Integrador2/util/Constants",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageToast",
	    "sap/m/MessageBox"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Device, JSONModel, Services, Formatter, Constants, Filter, FilterOperator, MessageToast, MessageBox) {
		"use strict";

		return Controller.extend("Integrador2.Integrador2.controller.Main", {
			onInit: function () {

                const oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                sap.ui.getCore().getConfiguration().setLanguage("ES"); 

                let that = this;
                this.loadServiceModel().then(function(){ // Crear funcion para que cargue el primer producto en la vista
                    let oItemSeleccionado = that.getView().getModel(Constants.names.Models.modelProduct).getProperty("/value/0");
                    
                    let oModelSelectedProduct = new JSONModel();
                    oModelSelectedProduct.setData(oItemSeleccionado);
                    that.getOwnerComponent().setModel(oModelSelectedProduct,Constants.names.Models.modelSelect);
                });
                
            },
                Formatter: Formatter,

            // Crear Modelo de Productos

                loadServiceModel: async function(){

                    const oComponent = this.getOwnerComponent();

                    let oResponseProducto =  await Services.getProducts();
                    let oDataProducto = oResponseProducto[0];

                    var oModelProducto = new JSONModel();
                    oModelProducto.setData(oDataProducto);

                    oComponent.setModel(oModelProducto, Constants.names.Models.modelProduct);

                    oComponent.getRouter().getRoute("RouteMain").attachPatternMatched(this._onRouteMatched, this);
                    
                },    

                _onRouteMatched: function(oEvent) {
                    
                    this.getOwnerComponent().getRouter().navTo("RouteDetail", {productId:"0"}, true);                    
                },

            // Funcion para buscar nombre de los productos

                onSearch: function(oEvent){

                    var aFilters = [];
                    var sQuery = oEvent.getSource().getValue();
                    if (sQuery && sQuery.length > 0){

                        var oFilter = new Filter ("ProductName", FilterOperator.Contains, sQuery);
                        aFilters.push(oFilter);

                        var oFilters = new Filter (aFilters);

                    }

                    var oTable = this.getView().byId("idListProducts");
                    var oBindingInfo = oTable.getBinding("items");
                    oBindingInfo.filter(oFilters, "Application");
                },
            
            // Seleccionar Item y mostrar en el Detail creando nuevo modelo

                onSelectionChange: function(oEvent) {

                    let oItem = oEvent.getSource().getSelectedItem().getBindingContext(Constants.names.Models.modelProduct);
                    let oModel = this.getOwnerComponent().getModel(Constants.names.Models.modelProduct);
                    let oItemSeleccionado = oModel.getProperty(oItem.getPath());
                    
                    let oModelSelectedProduct = new JSONModel();
                    oModelSelectedProduct.setData(oItemSeleccionado);
                    this.getOwnerComponent().setModel(oModelSelectedProduct,Constants.names.Models.modelSelect );
                    
                    var oItemID = oItemSeleccionado.ProductID;
                    this.loadServiceModel2(oItemID);

                    var oItemID2 = oItemSeleccionado.ProductID;
                    this.loadServiceModel3(oItemID2);
                },

            // Crear los dos siguientes modelos (Category y Supplier)

                loadServiceModel2: async function(sParam){

                    const oComponent = this.getOwnerComponent();
                    let oResponseProducto = await Services.getProductsCat(sParam);
                    let oDataProductoCat = oResponseProducto[0];

                    var oModelProductoCat = new JSONModel();
                    oModelProductoCat.setData(oDataProductoCat);
                    oComponent.setModel(oModelProductoCat, Constants.names.Models.modelProductCat);
                },

                loadServiceModel3: async function(sParam1){

                    const oComponent = this.getOwnerComponent();
                    let oResponseProducto = await Services.getProductsSup(sParam1);
                    let oDataProductoSup = oResponseProducto[0];

                    var oModelProductoSup = new JSONModel();
                    oModelProductoSup.setData(oDataProductoSup);
                    oComponent.setModel(oModelProductoSup, Constants.names.Models.modelProductSup);
                },
		});
	});
