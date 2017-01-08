var incidentService = (function(window, $) {

    var INCIDENTS_API_GEOJSON_URL = resourceEndpointsModule.INCIDENTS_API_GEOJSON_URL;
    var INCIDENTS_API_JSON_URL = resourceEndpointsModule.INCIDENTS_API_JSON_URL;

    function _findMostRecentIncident(callback) {
        var query = "?$select=date,time"
          + "&$limit=1"
          + "&$order=date DESC,time DESC";

        $.get(INCIDENTS_API_JSON_URL + query, function(data) {
            callback(data[0]);
        });
    }

    function _findIncidentsWithPolygonSearch(searchParams, dataFormat, callback) {
        var query = _buildPolygonIncidentDataQuery(searchParams);
        var url = _buildIncidentDataUrl(dataFormat, query);

        $.get(url, callback);
    }

    function _buildPolygonIncidentDataQuery(params) {
        var wellKnownTextPolygon = _buildWellKnownTextFromGeoJson(params.searchGeoJson);

        return "?$where="
          + "date >= '" + params.startDate + "'"
          + " AND date <= '" + params.endDate + "'"
          + " AND within_polygon(location, \'" + wellKnownTextPolygon + "\')"
          + "&$order=date DESC"
          + "&$limit=100000";
    }

    function _buildWellKnownTextFromGeoJson(geoJson) {
        var coordinates = geoJson.geometry.coordinates[0].map(function(coord) {
            return coord.join(' ');
        }).join(', ');

        return 'MULTIPOLYGON (((' + coordinates + ')))';
    }

    function _findIncidentsWithRadialSearch(searchParams, dataFormat, callback) {
        var query = _buildRadialIncidentDataQuery(searchParams);
        var url = _buildIncidentDataUrl(dataFormat, query);

        $.get(url, callback);
    }

    function _buildRadialIncidentDataQuery(params) {
        return "?$where="
          + "date >= '" + params.startDate + "'"
          + " AND date <= '" + params.endDate + "'"
          + " AND within_circle(location," +  params.latitude + "," + params.longitude + "," + params.radius + ")"
          + "&$order=date DESC"
          + "&$limit=100000";
    }

    function _buildIncidentDataUrl(dataFormat, query) {
        var incidentsEndpoint = dataFormat === 'geojson'
            ? INCIDENTS_API_GEOJSON_URL
            : INCIDENTS_API_JSON_URL;

        return incidentsEndpoint + query;
    }

    return {
        findMostRecentIncident: _findMostRecentIncident,
        findIncidentsWithPolygonSearch: _findIncidentsWithPolygonSearch,
        findIncidentsWithRadialSearch: _findIncidentsWithRadialSearch,
        buildPolygonIncidentDataQuery: _buildPolygonIncidentDataQuery,
        buildRadialIncidentDataQuery: _buildRadialIncidentDataQuery
    };

})(window, jQuery);

