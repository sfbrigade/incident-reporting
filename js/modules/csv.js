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

    function _downloadCsv(event, dataLink) {
        event.currentTarget.download = "San Francisco Crime Data Export.csv";
        event.currentTarget.href = encodeURI(dataLink);
    }

    function _onCsvFetchSuccess(event, data) {
        rows = _parseCsvData(data);

        // Add Campus Safety Category column header
        rows[0].push("Campus Safety Category")

        // Add csCategory to each incident row
        rows = _addcsCategories(rows);

        // Format as a data url for a file download
        var dataLink = _formatCsv(rows);

        // Download the newly formatted csv
        _downloadCsv(event, dataLink);
  }

  function _fetchAndDownloadCsv(event, url) {
    $.get(url, _onCsvFetchSuccess.bind(this, event), 'text');
  }

  return {
    download: _fetchAndDownloadCsv
  }
})(window, jQuery);