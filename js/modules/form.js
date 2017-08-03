var formModule = (function(window, $) {

    function _init() {
        _initializeAddressSearchInput();
        _initializeAddressSearchRadiusRangeSlider();
        _initializeDateRange();
        _initializeLastUpdatedDateText();
    }

    function _initializeAddressSearchInput() {
        $('#input-address').typeahead({
            source: addressService.getAddressSuggestions,
            minLength: 4,
            items: 10,
            delay: 150,
            display: 'text',
            afterSelect: _afterAddressSelect
          });
    }

    function _initializeAddressSearchRadiusRangeSlider() {
        $('#range-slider').noUiSlider({
            start: viewModelModule.searchRadius,
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
                viewModelModule.searchRadius = $(this).val();
                pageModule.loadIncidentData();
            }
        })
        .Link('lower').to($('#range-slider-input'), null, wNumb({
            decimals: 0
        }));
    }

    function _initializeDateRange() {
        
        var startDate = moment(viewModelModule.startDate);
        var endDate = moment(viewModelModule.endDate);

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
            startDate: moment().subtract(44, 'days'),
            endDate: moment().subtract(14, 'days'),
            format: 'MM/DD/YYYY',
            opens: "left"
        }, function(startDate, endDate) {
            var formattedStartDate = startDate.format('MM/DD/YYYY');
            var formattedEndDate = endDate.format('MM/DD/YYYY');
            viewModelModule.startDate = startDate.format('YYYY-MM-DD');
            viewModelModule.endDate = endDate.format('YYYY-MM-DD');
            $('#daterange').val(formattedStartDate + ' - ' + formattedEndDate);

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
        viewModelModule.searchShapeType = 'radial';
        viewModelModule.searchAddress = selectedOption.name;
        viewModelModule.latitude = selectedOption.latitude;
        viewModelModule.longitude = selectedOption.longitude;

        pageModule.loadIncidentData();
    }

    return {
        init: _init
    };

})(window, jQuery);
