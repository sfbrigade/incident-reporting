var csvModule = (function(window, $) {
    function _parseCsvData(data) {
        data = data.replace(/\n$/, "");
        data = data.split('\n');
        return data.map(function(row) {
            var data = row.split('","');
            return data.map(function(datum) {
                datum = datum.replace(/"/g, '');
                datum = datum.replace(/,/g, '. ');
                return datum;
            });
        })
    }

    function _addcsCategories(rows) {
        var csCategoriesForIncidents = tableModule.csCategoriesForIncidents();
        var headers = rows.slice(0, 1);
        rows = rows.slice(1).map(function(row) {
            var incidentNum = row[4];
            var csCategory = csCategoriesForIncidents[incidentNum];
            row.push(csCategory);
            return row;
        });

        return headers.concat(rows);
    }

    function _formatCsv(rows) {
        var csvLink = "data:text/csv;charset=utf-8,";
        return rows.reduce(function(link, row, rowIndex) {
            link += row.join(",");
            if (rowIndex < rows.length) {
                link += "\n";
            }
            return link;
        }, csvLink)
    }

    function _downloadCsv(dataLink) {
        var link = document.createElement("a");
        link.download = "San Francisco Crime Data Export.csv";
        link.href = encodeURI(dataLink);
        link.click();
    }

    function _onCsvFetchSuccess(data) {
        // Parse data string to array of arrays
        rows = _parseCsvData(data);

        // Add Campus Safety Category column header
        rows[0].push("Campus Safety Category");

        // Add csCategory to each incident row
        rows = _addcsCategories(rows);

        // Format as a data url for a file download
        var dataLink = _formatCsv(rows);

        // Download the newly formatted csv
        _downloadCsv(dataLink);
    }

    function _fetchAndDownloadCsv(event) {
        var url = $(event.currentTarget).data('csv-link');
        $.get(url, _onCsvFetchSuccess, 'text');
    }

    return {
        download: _fetchAndDownloadCsv
    };

})(window, jQuery);