sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.Detail", {

        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

            let oEditModel = new JSONModel({
                editMode: false
            });
            this.getView().setModel(oEditModel, "editModel");
        },

        _onObjectMatched: function (oEvent) {
            let sMaterialID = oEvent.getParameter("arguments").MaterialID,
                oModel = this.getView().getModel("Materials"),
                aMaterials = oModel.getProperty("/Materials"),
                oMaterial = aMaterials.find(emp => emp.ID === sMaterialID),
                oMaterialModel = new sap.ui.model.json.JSONModel(oMaterial);

            this.getView().setModel(oMaterialModel, "materialModel");
        },

        onBackPress: function () {
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteView1");
        },

        onEditPress: function () {
            this.getView().getModel("editModel").setProperty("/editMode", true);
        },

        onSavePress: function () {
            let oMaterialModel = this.getView().getModel("MaterialModel"),
                oMaterialData = oMaterialModel.getData();

            // Zaktualizowanie danych w modelu "Materials"
            let oMaterialsModel = this.getView().getModel("Materials"),
                aMaterials = oMaterialsModel.getProperty("/Materials");

            let iIndex = aMaterials.findIndex(emp => emp.ID === oMaterialData.ID);
            if (iIndex !== -1) {
                aMaterials[iIndex] = oMaterialData; // Aktualizacja danych
            }

            oMaterialsModel.setProperty("/Materials", aMaterials);

            this.getView().getModel("editModel").setProperty("/editMode", false);

            MessageToast.show("Material details saved successfully.");
        },

        // Funkcja anulująca edycję
        onCancelPress: function () {
            // Przywrócenie początkowych danych użytkownika
            let oMaterialModel = this.getView().getModel("MaterialModel"),
                oMaterialData = oMaterialModel.getData();

            // Ponownie ustawiamy dane w modelu, aby anulować zmiany
            let oModel = this.getView().getModel("Materials"),
                aMaterials = oModel.getProperty("/Materials"),
                oOriginalMaterial = aMaterials.find(emp => emp.ID === oMaterialData.ID);
            oMaterialModel.setData(oOriginalMaterial);

            this.getView().getModel("editModel").setProperty("/editMode", false);

            MessageToast.show("Changes canceled.");
        },

    });
});
