var viewModelModule = (function(window, $) {

    var viewModel = {
        startDate: null,
        endDate: null,
        searchRadius: null,
        latitude: null,
        longitude: null,
        searchAddress: null,
        searchCity: null,
        searchState: null,
        searchZip: null,
        searchShapeType: null, // 'radial' or 'polygon'
        searchGeoJson: null
    };

    return viewModel;
})();
