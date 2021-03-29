sap.ui.define([], function(){
    "use strict";
    return {
        model:{
            I18N: "i18n",
        },

        names: {
            Models: {
                modelProduct: "productoJSON",
                modelSelect: "productoSelectJSON",
                modelProductCat: "productoCatJSON",
                modelProductSup: "productoSupJSON",
            }
        },

        ids: {
            FRAGMENTS: {
                tabDialog: "idDialogEditProductos",
            }
        },

        routes: {
            Entitys: {
                Products: "/V3/Northwind/Northwind.svc/Products",
                productsCat: "/V3/Northwind/Northwind.svc/Products(",
                productsSup:"/V3/Northwind/Northwind.svc/Products("
            },
            FRAGMENTS: {
                 tabDialog: "Integrador2.Integrador2.fragments.Dialog"
            }
        },

    };
}, true);