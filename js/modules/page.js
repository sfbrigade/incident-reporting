var pageModule = (function(window, $) {

    function _loadIncidentData() {
        switch(viewModelModule.searchShapeType) {
            case 'polygon': _loadPolygonIncidentData(); break;
            case 'radial': _loadRadialIncidentData(); break;

            default: _loadRadialIncidentData(); break;
        }
    }

    function _loadPolygonIncidentData() {
        var params = _buildPolygonIncidentSearchParameters();

        var query = incidentService.buildPolygonIncidentDataQuery(params);
        datasetLinksModule.refreshDownloadButtonUrls(query);
        historyModule.saveSearchUrl();

        _showLoader();
        incidentService.findIncidentsWithPolygonSearch(params, 'geojson', function(incidentsGeoJson) {
            _hideLoader();
            mapModule.drawPolygonIncidents(incidentsGeoJson);
            tableModule.loadDataToTable(incidentsGeoJson);
        });
    }

    function _buildPolygonIncidentSearchParameters() {
        return {
            startDate: viewModelModule.startDate,
            endDate: viewModelModule.endDate,
            searchGeoJson: viewModelModule.searchGeoJson
        };
    }

    function _loadRadialIncidentData() {
        var params = _buildRadialIncidentSearchParameters();

        var query = incidentService.buildRadialIncidentDataQuery(params);
        datasetLinksModule.refreshDownloadButtonUrls(query);
        historyModule.saveSearchUrl();

        _showLoader();
        incidentService.findIncidentsWithRadialSearch(params, 'geojson', function(geoJson) {
            _hideLoader();
            mapModule.drawRadialIncidents(geoJson);
            tableModule.loadDataToTable(geoJson);
        });
    }

    function _buildRadialIncidentSearchParameters() {
        return {
            startDate: viewModelModule.startDate,
            endDate: viewModelModule.endDate,
            longitude: viewModelModule.longitude,
            latitude: viewModelModule.latitude,
            radius: viewModelModule.searchRadius
        };
    }

    function _showLoader() {
        $(".loading").show();
    }

    function _hideLoader() {
        $(".loading").hide();
    }

    return {
        loadIncidentData: _loadIncidentData
    };

})(window, jQuery);
