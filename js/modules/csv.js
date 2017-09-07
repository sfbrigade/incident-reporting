var csvModule = (function(window, $) {
    function _parseCsvData(data) {
        return data.split('\n').map(function(row) {
            var data = row.split('","');
            return data.map(function(datum) {
                datum = datum.replace(/"/g, '');
                datum = datum.replace(/,/g, '. ');
                return datum;
            });
        })
    }

    function _addcsCategories(rows) {
        // Asscoate csCategory with csv data on incidntnum
        var csCategoriesForIncidents = tableModule.csCategoriesForIncidents();
        return rows.slice(1).map(function(row) {
            var incidentNum = row[4];
            var csCategory = csCategoriesForIncidents[incidentNum];
            row.push(csCategory);
            return row;
        });
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
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        var link = document.createElement("a");
        link.download = "San Francisco Crime Data Export.csv";
        link.href = encodeURI(dataLink);
        link.dispatchEvent(evt);
    }

    function _onCsvFetchSuccess(data) {
        rows = _parseCsvData(data);

        // Add Campus Safety Category column header
        rows[0].push("Campus Safety Category")

        // Add csCategory to each incident row
        rows = _addcsCategories(rows);

        // Format as a data url for a file download
        var dataLink = _formatCsv(rows);

        // Download the newly formatted csv
        _downloadCsv(dataLink);
  }

  function _fetchAndDownloadCsv(url) {
    $.get(url, _onCsvFetchSuccess, 'text');
  }

  return {
    download: _fetchAndDownloadCsv
  }
})(window, jQuery);