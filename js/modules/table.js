var tableModule = (function(window, $) {

    var _table;

    function _init() {
        _table = $('#example').DataTable(_tableConfig());
    }

    function _tableConfig() {
        return {
            ajax: {
                url: "empty.json",
                dataSrc: ""
            },
            dom: '<"table-buttons"<"table-buttons"Bf>l>t<"table-buttons"ip>',
            oLanguage: {
                sSearch: "Filter results:"
            },
            buttons: [{ extend: 'colvis', text: 'Select Columns'}],
            fixedHeader: {
                header: true,
                footer: true
            },
            columns: config.tableColumns,
            pageLength: 50,
            footerCallback: function(tfoot, data, start, end, display) {
                var dupHeaderRow = $(this.api().table().header()).children('tr:first').clone()
            }
        };
    }

    function _loadDataToTable(incidentGeoJson) {
        _table.clear();
        _table.rows.add(_convertGeoJsonToJson(incidentGeoJson));
        _table.draw();
    }

    function _convertGeoJsonToJson(geoJson) {
        var json = [];
        $.each(geoJson.features, function(index, feature) {
            feature.properties.location = feature.geometry;
            json.push(feature.properties);
        });

        return json;
    }

    return {
        init: _init,
        loadDataToTable: _loadDataToTable
    };

})(window, jQuery);
