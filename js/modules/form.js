var formModule = (function(window, $) {

    function _init() {
        _initializeAddressSearchInput();
        _initializeAddressSearchRadiusRangeSlider();
        _initializeDateRange();
        _initializeLastUpdatedDateText();
    }

    function _initializeAddressSearchInput() {
        $('#inputAddress').typeahead({
            source: addressService.getAddressSuggestions,
            minLength: 4,
            items: 10,
            display: 'text',
            afterSelect: _afterAddressSelect
          });
    }

    function _initializeAddressSearchRadiusRangeSlider() {
        $('#range-slider').noUiSlider({
            start: 1320, //
            step: 1,
            connect: 'lower',
            range: {
                min: [0],
                max: [5280]
            }
        })
        .on({
            set: function() {
                viewModelModule.searchShapeType = 'radial';
                viewModelModule.searchRadius = $(this).val() * .3048;
                pageModule.loadIncidentData();
            }
        })
        .Link('lower').to($('#range-slider-input'), null, wNumb({
            decimals: 0
        }));
    }

    function _initializeDateRange() {
        var startDate = viewModelModule.startDate
          ? moment(viewModelModule.startDate)
          : moment().subtract(29, 'days');
        var endDate = viewModelModule.endDate
          ? moment(viewModelModule.endDate)
          : moment();

        $('#daterange').val(startDate.format('MM/DD/YYYY') + ' - ' + endDate.format('MM/DD/YYYY'));

        $('#daterange').daterangepicker({
            ranges: {
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'This Quarter': [moment().startOf('quarter'), moment().endOf('quarter')],
                'Last Quarter': [moment().subtract(3, 'months').startOf('quarter'), moment().subtract(3, 'months').endOf('quarter')],
                'This Year': [moment().startOf('year'), moment()],
                'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
            },
            startDate: startDate,
            endDate: endDate,
            format: 'MM/DD/YYYY'
        }, function(startDate, endDate) {
            var formattedStartDate = startDate.format('YYYY-MM-DD');
            var formattedEndDate = endDate.format('YYYY-MM-DD');
            viewModelModule.startDate = formattedStartDate;
            viewModelModule.endDate = formattedEndDate;
            $('#daterange').val(formattedStartDate + ' - ' + formattedEndDate);

						alert(startDate + " " + endDate);
            pageModule.loadIncidentData();
        });
    }

    function _initializeLastUpdatedDateText() {
        incidentService.findMostRecentIncident(function(mostRecentIncident) {
            $('#data-updated').html('<b>Data available through '
              + moment(mostRecentIncident.date).format('MMMM DD, YYYY')
              + ' at '
              + moment(mostRecentIncident.time, 'HH:mm').format('hh:mm a')
              + '</b>');
        });
    }

    function _afterAddressSelect(selectedOption) {
        addressService.getAddress(selectedOption.name, function(address) {
            var addressFeature = address.features[0];

            viewModelModule.latitude = addressFeature.geometry.coordinates[1];
            viewModelModule.longitude = addressFeature.geometry.coordinates[0];
            viewModelModule.searchAddress = addressFeature.properties.name;
            viewModelModule.searchCity = addressFeature.properties.locality;
            viewModelModule.searchState = addressFeature.region;
            viewModelModule.searchZip = addressFeature.postalCode;
            viewModelModule.searchShapeType = 'radial';

            pageModule.loadIncidentData();
        });
    }

    return {
        init: _init
    };

})(window, jQuery);
