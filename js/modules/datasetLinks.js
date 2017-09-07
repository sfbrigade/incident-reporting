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
        if(location.href.includes('searchGeoJson')){
            var searchGeoJsonStringIndex = location.href.indexOf('searchGeoJson');
            link = encodeURIComponent(location.href.substring(0, searchGeoJsonStringIndex)) + decodeURIComponent(location.href.substring(searchGeoJsonStringIndex));
        }
        return "mailto:?subject=My results from sfcrimedata.org&body=Here is the link to my search: %0A%0A" + link;
    }

    function _refreshDownloadButtonUrls(query) {
        $("#open-geojsonio").attr("href", _getGeojsonio(query));
        $("#open-cartodb").attr("href", _getCartoDbUrl(query));
        $("#email-share").click(function(){
          $("#email-share").attr("href", _setEmailLink());
        });
        // Dynamically set query property for csv downloads
        this.query = query;
    }

    var interface = {
        refreshDownloadButtonUrls: _refreshDownloadButtonUrls
    };

    // Set csv download click handler once
    $("#download-csv").click(function() {
        // Use dynamic csv query link
        var url = _getCsvLink(interface.query);
        csvModule.download(url);
    });

    return interface;

})(window, jQuery);
