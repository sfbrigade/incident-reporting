var tableModule = (function(window, $) {

    var TABLE_CONFIG = {
        ajax: {
            url: "empty.json",
            dataSrc: ""
        },
        dom: '<"table-buttons"<"table-buttons"Bf>l>t<"table-buttons"ip>',
        oLanguage: {
            sSearch: "Search my results:"
        },
        buttons: [{ extend: 'colvis', text: 'Select Columns'}],
        fixedHeader: {
            header: true,
            footer: true
        },
        columns: [{
            data: "incidntnum",
            title: "Incident#",
            name: "incidntnum",
            visible: false
        }, {
            data: "date",
            title: "Date",
            name: "date",
            render: function(data, type, row, meta) {
                return moment(data).format('l')
            }
        }, {
            data: "time",
            title: "Time",
            name: "time",
            visible: false
        }, {
            data: "address",
            title: "Address",
            name: "address",
            visible: false
        }, {
            data: "pddistrict",
            title: "District",
            name: "pddistrict",
            visible: false
        }, {
            className: "mobile",
            data: "category",
            title: "Category",
            name: "category",
        }, {
            data: "descript",
            title: "Description",
            name: "descript",
        }, {
            className: "mobile tablet",
            data: "resolution",
            title: "Resolution",
            name: "resolution",
        }, {
            data: "cscategory",
            title: "CSCategory",
            name: "cscategory",
        }],
        pageLength: 50,
        footerCallback: function(tfoot, data, start, end, display) {
            var dupHeaderRow = $(this.api().table().header()).children('tr:first').clone()
        }
    };

    var _table;

    function _init() {
        _table = $('#example').DataTable(TABLE_CONFIG);
    }

    /*function that contains logic for the 'CSCategory' column & then adjusts the
    incidentJson with the new cscategory field based on this logic*/
    function _csCategoryCheck(incidentJson){
        for (var i = 0; i < incidentJson.length; i++){
            switch (true){
                case incidentJson[i].category === "ARSON":
                    incidentJson[i].cscategory = "ARSON";
                    break;
                case (incidentJson[i].category === "ASSAULT" &&
                    incidentJson[i].descript.includes("AGGRAVATED")):
                    incidentJson[i].cscategory = "AGGRAVATED ASSAULT";
                    break;
                case (incidentJson[i].category === "ASSAULT" &&
                    incidentJson[i].descript.includes("DATING")):
                    incidentJson[i].cscategory = "DATING VIOLENCE";
                    break;
                case (incidentJson[i].category === "ASSAULT" &&
                    (incidentJson[i].descript.includes("HATE") ||
                    incidentJson[i].descript.includes("TERROR"))):
                    incidentJson[i].cscategory = "HATE CRIMES";
                    break;
                case (incidentJson[i].category === "ASSAULT" &&
                    incidentJson[i].descript.includes("STALKING")):
                    incidentJson[i].cscategory = "STALKING";
                    break;
                case (incidentJson[i].category === "ASSAULT" &&
                    incidentJson[i].resolution.includes("ARREST") &&
                    (incidentJson[i].descript.includes("WEAPON") ||
                        incidentJson[i].descript.includes("GUN") ||
                        incidentJson[i].descript.includes("KNIFE") ||
                        incidentJson[i].descript.includes("FIREARM") ||
                        incidentJson[i].descript.includes("SHOOTING"))):
                    incidentJson[i].cscategory = "WEAPONS POSSESSION";
                    break;
                case incidentJson[i].category === "BURGLARY":
                    incidentJson[i].cscategory = "BURGLARY";
                    break;
                case (incidentJson[i].category === "DRIVING UNDER THE INFLUENCE" &&
                    incidentJson[i].descript.includes("ALCOHOL") &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "LIQUOR LAW VIOLATIONS";
                    break;
                case (incidentJson[i].category === "DRIVING UNDER THE INFLUENCE" &&
                    incidentJson[i].descript.includes("DRUGS") &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "DRUG-RELATED VIOLATIONS";
                    break;
                case (incidentJson[i].category === "DRUG/NARCOTIC" &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "DRUG-RELATED VIOLATIONS";
                    break;
                case (incidentJson[i].category === "DRUNKENNESS" &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "LIQUOR LAW VIOLATIONS";
                    break;
                case (incidentJson[i].category === "LIQUOR LAWS" &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "LIQUOR LAW VIOLATIONS";
                    break;
                case (incidentJson[i].category === "OTHER OFFENSES" &&
                    incidentJson[i].descript.includes("ALCOHOL") &&
                    incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "LIQUOR LAW VIOLATIONS";
                    break;
                case incidentJson[i].category === "ROBBERY":
                    incidentJson[i].cscategory = "ROBBERY";
                    break;
                case (incidentJson[i].category === "SECONDARY CODES" &&
                    incidentJson[i].descript.includes("DOMESTIC VIOLENCE")):
                    incidentJson[i].cscategory = "DOMESTIC VIOLENCE";
                    break;
                case (incidentJson[i].category === "SECONDARY CODES" &&
                    incidentJson[i].descript.includes("PREJUDICE")):
                    incidentJson[i].cscategory = "HATE CRIMES";
                    break;
                case (incidentJson[i].category === "SECONDARY CODES" &&
                    incidentJson[i].descript.includes("WEAPONS")):
                    incidentJson[i].cscategory = "WEAPONS POSSESSION";
                    break;
                case (incidentJson[i].category === "SEX OFFENSES, FORCIBLE" ||
                    incidentJson[i].category === "SEX OFFENSES, NON FORCIBLE"):
                    incidentJson[i].cscategory = "SEX OFFENSES";
                    break;
                case incidentJson[i].category === "VEHICLE THEFT":
                    incidentJson[i].cscategory = "MOTOR VEHICLE THEFT";
                    break;
                case (incidentJson[i].category === "WEAPON LAWS" &&
                        incidentJson[i].resolution.includes("ARREST")):
                    incidentJson[i].cscategory = "WEAPONS POSSESSION";
                    break;
                default:
                    incidentJson[i].cscategory = "NONE";
                    break;
            }
        }
        return incidentJson;
    }

    function _loadDataToTable(incidentJson) {
        _table.clear();

        incidentJson = _csCategoryCheck(incidentJson);


        _table.rows.add(incidentJson);
        _table.draw();
    }

    return {
        init: _init,
        loadDataToTable: _loadDataToTable,
        csCategoryCheck: _csCategoryCheck
    };

})(window, jQuery);
