var datasetLinksModule = (function(window, $) {

    function _getCartoDbUrl(query) {
        var incidentUrl = incidentService.buildIncidentDataUrl('geojson', query);
        return "//oneclick.cartodb.com/?"
          + "file=" + encodeURIComponent(incidentUrl)
          + "&provider=DataSF";
    }

    function _getCsvLink(query) {
        return incidentService.buildIncidentDataUrl('csv', query);
    }

    function _getGeojsonio(query) {
        var incidentUrl = incidentService.buildIncidentDataUrl('geojson', query);
        return "http://geojson.io/#"
          + "data=data:text/x-url," + encodeURIComponent(incidentUrl);
    }

    function _setEmailLink() {
        var link = encodeURIComponent(encodeURI(location.href));
        return "mailto:?subject=My results from sfcrimedata.org&body=Here is the link to my search: %0A%0A" + link;
    }

    function _refreshDownloadButtonUrls(query) {
        $("#download-csv").attr("href", _getCsvLink(query));
        $("#open-geojsonio").attr("href", _getGeojsonio(query));
        $("#open-cartodb").attr("href", _getCartoDbUrl(query));
        $("#email-share").attr("href", _setEmailLink());
    }

    return {
        refreshDownloadButtonUrls: _refreshDownloadButtonUrls
    };

})(window, jQuery);
