var config = (function(window, $) {

    return {
        incidentServiceOptions: {
            socrataResource: "cuks-n6tp",
            timeColumn: "time",
            dateColumn: "date",
            locationColumn: "location"
        },
        tableColumns: [{
            data: "incidntnum",
            title: "Incident#",
            name: "incidntnum"
        }, {
            data: "date",
            title: "Date",
            name: "date",
            render: function(data, type, row, meta) {
                return moment(data).format('l');
            },
            visible: false
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
            name: "category"
        }, {
            data: "descript",
            title: "Description",
            name: "descript"
        }, {
            className: "mobile tablet",
            data: "resolution",
            title: "Resolution",
            name: "resolution"
        }]
    };

})(window, jQuery);
