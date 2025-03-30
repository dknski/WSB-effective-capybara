sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
        "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Fragment, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
        },

        onMaterialPress: function (oEvent) {
            let oItem = oEvent.getParameter("listItem");
            let oContext = oItem.getBindingContext("Materials");
            let sPath = oContext.getPath();
            let sMaterialID = this.getView().getModel("Materials").getProperty(sPath).ID;
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            oRouter.navTo("Detail", { MaterialID: sMaterialID });
        },

        onInputLiveChange: function (oEvent) {
            let oInput = oEvent.getSource(),
                sValue = oInput.getValue(),
                phonePattern = /^\d{3}-\d{3}-\d{3}$/;  // Format: 123-456-789
            emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Format: example@domain.com

            if (oInput.getId() === this.createId("phoneInput")) {
                if (!phonePattern.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid phone number format. Use format 123-456-789.");
                } else {
                    oInput.setValueState("None");
                }
            }

            if (oInput.getId() === this.createId("emailInput")) {
                if (!emailPattern.test(sValue)) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Invalid email format.");
                } else {
                    oInput.setValueState("None");
                }
            }
        },

        onAddMaterial: function () {
            let oView = this.getView();

            if (!this.pDialog) {
                this.pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "project1.view.fragment.AddMaterial",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onSaveMaterial: function () {
            let oView = this.getView(),
                oModel = oView.getModel('Materials'),
                aMaterials = oModel.getData().Materials;

            let sName = oView.byId("NameInput").getValue(),
                sType = oView.byId("TypeInput").getValue(),
                sWeight = oView.byId("WeightInput").getValue(),
                sDesc = oView.byId("DescriptionInput").getValue();
                // sEmail = oView.byId("emailInput").getValue(),
                // sPhone = oView.byId("phoneInput").getValue(),

            if (!sName || !sType || !sWeight) {
                MessageToast.show("Please fill in required fields.");
                return;
            }

            let newMaterial = {
                "ID": (aMaterials.length + 1).toString(),
                "Name": sName,
                "Type": sType,
                "Weight": sWeight,
                // "Email": sEmail,
                // "Phone": sPhone,
                "Description": sDesc
            };

            aMaterials.push(newMaterial);
            oModel.setProperty("/Materials", aMaterials);

            MessageToast.show("Material added!");
            this._clearForm();
            this.onCancelMaterial();
        },

        onCancelMaterial: function () {
            this.pDialog.then(function (oDialog) {
                oDialog.close();
            });
            this._clearForm();
        },

        _clearForm: function () {
            let oView = this.getView(),
                aInputs = [
                    "NameInput",
                    "TypeInput",
                    "WeightsWeightInput",
                    "emailInput",
                    "phoneInput"
                ];

            aInputs.forEach(function (sInputId) {
                let oInput = oView.byId(sInputId);
                if (oInput) {
                    oInput.setValue("");
                    oInput.setValueState("None");
                }
            });
        },

        onDeleteMaterial: function () {
            let oTable = this.getView().byId("table"),
                aSelectedItems = oTable.getSelectedItems(); // Zwraca tablicę zaznaczonych elementów

            // Pobieramy model z listą użytkowników
            let oModel = this.getView().getModel("Materials");
            let aMaterials = oModel.getProperty("/Materials");

            // Usuwamy użytkowników na podstawie zaznaczonego indeksu
            aSelectedItems.forEach(function (oItem) {
                let oContext = oItem.getBindingContext("Materials");
                let sMaterialID = oContext.getProperty("ID"); // Pobieramy ID użytkownika
                let iIndex = aMaterials.findIndex(emp => emp.ID === sMaterialID);
                if (iIndex !== -1) {
                    aMaterials.splice(iIndex, 1); // Usuwamy pracownika
                }
            });

            // aktualizujemy model
            oModel.setProperty("/Materials", aMaterials);

            // Wyczyść wybór w tabeli
            oTable.removeSelections(true);

            this.getView().byId("removeMaterialBtn").setEnabled(false);

            MessageToast.show("Material deleted successfully.");
        },

        onItemSelected: function () {
            let oTable = this.getView().byId("table"),
                oRemoveButton = this.getView().byId("removeMaterialBtn"),
                aSelectedItems = oTable.getSelectedItems();

            if (aSelectedItems.length > 0) {
                oRemoveButton.setEnabled(true);
            } else {
                oRemoveButton.setEnabled(false);
            }
        },

        onFilterChange: function () {
            let oView = this.getView(),
                oTable = oView.byId("table"),
                sName = oView.byId("idNameInput").getValue(),
                sType = oView.byId("idTypeInput").getValue(),
                sWeight = oView.byId("idWeightInput").getValue(),
                aFilters = [];

            // Tworzenie filtrów na podstawie wartości wprowadzonych przez użytkownika
            if (sName) {
                aFilters.push(new Filter("Name", FilterOperator.Contains, sName));
            }

            if (sType) {
                aFilters.push(new Filter("Type", FilterOperator.Contains, sType));
            }

            if (sWeight) {
                aFilters.push(new Filter("Weight", FilterOperator.Contains, sWeight));
            }

            let oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);
            }
        }

    });
});