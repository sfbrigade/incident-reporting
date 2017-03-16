var historyModule = (function() {

    function _saveSearchUrl() {
        var uri = new URI();
        uri.search(_getSearchParams());
        history.pushState(null, '', uri.build());
    }

    function _getSearchParams() {
        switch(viewModelModule.searchShapeType) {
            case 'radial': return _getRadialSearchParams();
                break;
            case 'polygon': return _getPolygonSearchParams();
                break;
        }
    }

    function _getRadialSearchParams() {
        var fields = [ 'startDate', 'endDate', 'longitude', 'latitude', 'searchRadius' ];
        return _getSearchParamsFromViewModel(fields);
    }

    function _getPolygonSearchParams() {
        var fields = [ 'startDate', 'endDate', 'searchGeoJson' ];
        return _getSearchParamsFromViewModel(fields);
    }

    function _getSearchParamsFromViewModel(fields) {
        fields = fields || [];

        return fields.reduce(function(searchParams, field) {
            if(viewModelModule.defaults[field] !== viewModelModule[field]) {
                searchParams[field] = _getSearchParamValue(field, viewModelModule[field]);
            }

            return searchParams;
        }, {}); 
    }

    function _getSearchParamValue(viewModelFieldName, viewModelFieldValue) {
        if(viewModelFieldName === 'searchRadius') {
            return parseInt(viewModelFieldValue);
        } else if(typeof(viewModelFieldValue) === 'number') {
            return Number(viewModelFieldValue.toPrecision(5));
        } else if(typeof(viewModelFieldValue) === 'object') {
            return JSON.stringify(viewModelFieldValue);
        }

        return viewModelFieldValue;
    }

    return {
        saveSearchUrl: _saveSearchUrl
    }
})();
