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
        }, {
            data: "date",
            title: "Date",
            name: "date",
            render: function(data, type, row, meta) {
                return moment(data).format('l')
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

    function _loadDataToTable(incidentJson) {
        _table.clear();
        _table.rows.add(incidentJson);
        _table.draw();
    }

    return {
        init: _init,
        loadDataToTable: _loadDataToTable
    };

})(window, jQuery);
