var IncidentService = (function(window, $) {

    var SOCRATA_BASE_URL = "https://data.sfgov.org/resource/";

    function IncidentService(options) {
        this.url = SOCRATA_BASE_URL + options.socrataResource;
        this.timeColumn = options.timeColumn;
        this.dateColumn = options.dateColumn;
        this.locationColumn = options.locationColumn;
    }

    IncidentService.prototype.findMostRecentIncident = function(callback) {
        var query = "$select=" + this.dateColumn + "," + this.timeColumn
          + "&$limit=1"
          + "&$order=" + this.dateColumn + "DESC," + this.timeColumn + " DESC";
        var url = this.buildIncidentDataUrl('json', query);

        $.get(url, function(data) {
            callback(data[0]);
        });
    };

    IncidentService.prototype.findIncidentsWithPolygonSearch = function(
        searchParams, dataFormat, callback
    ) {
        var query = this.buildPolygonIncidentDataQuery(searchParams);
        var url = this.buildIncidentDataUrl(dataFormat, query);

        $.get(url, callback);
    };

    IncidentService.prototype.findIncidentsWithRadialSearch = function(
        searchParams, dataFormat, callback
    ) {
        var query = this.buildRadialIncidentDataQuery(searchParams);
        var url = this.buildIncidentDataUrl(dataFormat, query);

        $.get(url, callback);
    };

    IncidentService.prototype.buildPolygonIncidentDataQuery = function(params) {
        var wellKnownTextPolygon = _buildWellKnownTextFromGeoJson(params.searchGeoJson);

        return "$where="
          + this.dateColumn + " >= '" + params.startDate + "'"
          + " AND " + this.dateColumn + " <= '" + params.endDate + "'"
          + " AND within_polygon(" + this.locationColumn + ", \'" + wellKnownTextPolygon + "\')"
          + "&$order=" + this.dateColumn + " DESC"
          + "&$limit=100000";
    };

    IncidentService.prototype.buildRadialIncidentDataQuery = function(params) {
        return "$where="
          + this.dateColumn + " >= '" + params.startDate + "'"
          + " AND " + this.dateColumn + " <= '" + params.endDate + "'"
          + " AND within_circle(" + this.locationColumn
          + "," + params.latitude
          + "," + params.longitude
          + "," + params.radius + ")"
          + "&$order=" + this.dateColumn + " DESC"
          + "&$limit=100000";
    };

    IncidentService.prototype.buildIncidentDataUrl = function(dataFormat, query) {
        return this.url + "." + dataFormat + "?" + query;
    };

    function _buildWellKnownTextFromGeoJson(geoJson) {
        var coordinates = geoJson.geometry.coordinates[0].map(function(coord) {
            return coord.join(' ');
        }).join(', ');

        return 'MULTIPOLYGON (((' + coordinates + ')))';
    }

    return IncidentService;

})(window, jQuery);
