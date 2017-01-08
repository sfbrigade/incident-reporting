var datasetLinksModule = (function(window, $) {

    function _getCartoDbUrl(query) {
        return "//oneclick.cartodb.com/?"
          + "file=" + encodeURIComponent(resourceEndpointsModule.INCIDENTS_API_GEOJSON_URL + query)
          + "&provider=DataSF";
    }

    function _getCsvLink(query) {
        return resourceEndpointsModule.INCIDENTS_API_CSV_URL + query;
    }

    function _getGeojsonio(query) {
        return "http://geojson.io/#"
          + "data=data:text/x-url,"+ encodeURIComponent(resourceEndpointsModule.INCIDENTS_API_GEOJSON_URL + query);
    }

    function _setEmailLink() {
      var link = encodeURIComponent(encodeURI(location.href));
      return "mailto:?subject=My results from sfcrimedata.org&body=Here is the link to my search: %0A%0A" + link
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
