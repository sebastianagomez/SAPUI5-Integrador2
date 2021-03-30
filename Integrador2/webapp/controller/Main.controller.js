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
        "sap/m/MessageBox",
        "sap/ui/model/Sorter",
        'sap/m/ViewSettingsItem',
        "sap/m/library"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, Device, JSONModel, Services, Formatter, Constants, Filter, FilterOperator, MessageToast, MessageBox, Sorter, ViewSettingsItem, mLibrary) {
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

                    that.getOwnerComponent().getRouter().navTo("RouteDetail");
                });

                this._mViewSettingsDialogs = {};

                //Group Table - arma los criterios de agrupación para el dialog de agrupamiento
                // Nombre de las funciones de los grupos tienen que ser la misma que las de las key 
                this.mGroupFunctions = {

                    ProductName: function (oContext) {
                        var sProductName = oContext.getProperty("ProductName");
                        return {
                            key: sProductName,
                            text: "Agrupado por: " + sProductName
                        };
                    },
                    
                    UnitPrice: function (oContext) {
                        var sUnitPrice = oContext.getProperty("UnitPrice");
                        return {
                            key: sUnitPrice,
                            text: "Agrupado por: " + sUnitPrice
                        };
                    },
                };
                
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

                    var oProductsLength = oModelProducto.getProperty("/value/").length;

                    let oModelLength = new JSONModel();
                    oModelLength.setData(oProductsLength);
                    oComponent.setModel(oModelLength, Constants.MODELS.ProductsLength)                    
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

                    let oProductsLength = oBindingInfo.getLength();
                    let oModelLength = new JSONModel();
                    oModelLength.setData(oProductsLength);
                    this.getOwnerComponent().setModel(oModelLength, Constants.MODELS.ProductsLength);
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

            // ------------ FILTROS ------------ //  

                // Crear Filtros

                onSort: function(){
                    this.createViewSettingsDialog("Integrador2.Integrador2.fragments.SortDialog").open();
                },
                onFilter: function (oEvent) {
                    this.createViewSettingsDialog("Integrador2.Integrador2.fragments.FilterDialog").open();
                },

            // Funcion principal para tener varios dialogs  

                createViewSettingsDialog: function (sDialogFragmentName) {
                    var oDialog;
                    oDialog = this._mViewSettingsDialogs[sDialogFragmentName];
                    if(!oDialog){
                        oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
                        this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;             
                        this.getView().addDependent(oDialog);

                    // lo siguiente va dentro de este if para que no destruya el filtro que edite

                    oDialog.setFilterSearchOperator(mLibrary.StringFilterOperator.Contains);

                    if (sDialogFragmentName === "Integrador2.Integrador2.fragments.FilterDialog") {

                        var oModelJSON = this.getOwnerComponent().getModel(Constants.names.Models.modelProduct);
                        var modelOriginal = oModelJSON.getProperty("/value");

                        var jsonProductName = JSON.parse(JSON.stringify(modelOriginal, ["ProductName"]));
                        var jsonUnitPrice = JSON.parse(JSON.stringify(modelOriginal, ["UnitPrice"]));

                        oDialog.setModel(oModelJSON);

                        //check for duplicates in filter items

                        jsonProductName = jsonProductName.filter(function (currentObject) {
                            if (currentObject.ProductName ?. jsonProductName) {
                                return false;
                            } else {
                                jsonProductName[currentObject.ProductName-1] = true;
                                return true;
                            }
                        });
                        jsonUnitPrice = jsonUnitPrice.filter(function (currentObject) {
                            if (currentObject.UnitPrice in jsonUnitPrice) {
                                return false;
                            } else {
                                jsonUnitPrice[currentObject.UnitPrice] = true;
                                return true;
                            }
                        });

                        //create items arrays and iterate

                        var productNameFilter = [];
                        for (var i = 0; i < jsonProductName.length; i++) {
                            productNameFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonProductName[i].ProductName,
                                    key: "ProductName"
                                })
                            );
                        }
                        var unitPriceFilter = [];
                        for (var i = 0; i < jsonUnitPrice.length; i++) {
                            unitPriceFilter.push(
                                new sap.m.ViewSettingsItem({
                                    text: jsonUnitPrice[i].UnitPrice,
                                    key: "UnitPrice"
                                })
                            );
                        }
                        
                        //set filter items and labels

                        oDialog.destroyFilterItems();

                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "ProductName",
                            text: "ProductName",
                            items: productNameFilter
                        }));
                        oDialog.addFilterItem(new sap.m.ViewSettingsFilterItem({
                            key: "UnitPrice",
                            text: "Unit Price",
                            items: unitPriceFilter
                        }));
                        

                        }                                       
                    if (Device.system.desktop) {
                        oDialog.addStyleClass("sapUiSizeCompact");
                        }
                
                
                    }
                    
                return oDialog;                    
            },

                //Funcion para Sort
                onSortDialogConfirm: function (oEvent) {
                    var oTable = this.byId("idListProducts"),
                        mParams = oEvent.getParameters(),
                        oBinding = oTable.getBinding("items"),
                        sPath,
                        bDescending,
                        aSorters = [];
                    sPath = mParams.sortItem.getKey();
                    bDescending = mParams.sortDescending;
                    aSorters.push(new Sorter(sPath, bDescending));
                    oBinding.sort(aSorters);
                },

                // Filtrar Dialog
                onFilterDialogConfirm: function (oEvent) {
                    var oTable = this.byId("idListProducts"),
                        mParams = oEvent.getParameters(),
                        oBinding = oTable.getBinding("items"),
                        aFilters = [];
                    mParams.filterItems.forEach(function (oItem) {
                        var sPath = oItem.getKey(),
                            sOperators = FilterOperator.Contains,
                            sValue1 = oItem.getText();
                        var oFilter = new Filter(sPath, sOperators, sValue1);
                        aFilters.push(oFilter);
                    });
                    oBinding.filter(aFilters);
                },
		});
	});
