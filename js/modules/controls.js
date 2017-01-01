var controlsModule = (function(window, $) {

    /*Global variables within the module scope*/
    var _controlBarContainer;
    var _controlBarLowerContainer;
    var _table;
    var _options = {
        "startDate": null,
        "endDate": null,
        "lastDate": null
    };

    /**
     * @param {object} domContainer
     */
    function _init(domContainer, domContainer2) {
        if (!!domContainer) {
            _controlBarContainer = domContainer;
            _setDataUpdated();
            _setDraggingMouse();
            _setInputAddress();
            _setSlider();
        } else {
            console.log("Upper controls container doesn't exist"); //Error
        }

        if (!!domContainer2) {
            _controlBarLowerContainer = domContainer2;

            _table = _controlBarLowerContainer.find('#example').DataTable({
                "ajax": {
                    "url": "empty.json",
                    "dataSrc": ""
                },
                "dom": '<"table-buttons"<"table-buttons"Bf>l>t<"table-buttons"ip>',
                "oLanguage": {
                   "sSearch": "Filter results:"
                 },
                "buttons": [{ extend: 'colvis', text: 'Select Columns'}],
                "fixedHeader": {
                    header: true,
                    footer: true
                },
                "columns": [{
                  "data": "incidntnum",
                  "title": "Incident#",
                  "name": "incidntnum",
                }, {
                  "data": "date",
                  "title": "Date",
                  "name": "date",
                  "render": function(data, type, row, meta) {
                    return moment(data).format('l')
                  },
                  "visible": false
                }, {
                  "data": "time",
                  "title": "Time",
                  "name": "time",
                  "visible": false
                }, {
                  "data": "address",
                  "title": "Address",
                  "name": "address",
                  "visible": false
                }, {
                  "data": "pddistrict",
                  "title": "District",
                  "name": "pddistrict",
                  "visible": false
                }, {
                  "className": "mobile",
                  "data": "category",
                  "title": "Category",
                  "name": "category",
                }, {
                  "data": "descript",
                  "title": "Description",
                  "name": "descript",
                }, {
                  "className": "mobile tablet",
                  "data": "resolution",
                  "title": "Resolution",
                  "name": "resolution",
                }],
                "pageLength": 50,
                "footerCallback": function(tfoot, data, start, end, display) {
                  var dupHeaderRow = $(this.api().table().header()).children('tr:first').clone()
                  // $(tfoot).html(dupHeaderRow.html());
                }
            });
        } else {
            console.log("Lower controls container doesn't exist");
        }
    }


    function _setInputAddress() {
        $('.typeahead').typeahead({
            source: function (query, process) {
              addresses = [];
              resourcesModule.getAutoSuggestionsFromService(query, function(data){
                  $.each(data, function (i, address) {
                      addresses.push(address.text);
                  });
                  process(addresses);
              });
            },
            updater: function(item) {
                clickedIndex = $('.typeahead').find('.active').index();
                var acFeatures = resourcesModule.getLatestAutocompleteFeatures();

                //Use the map module to change the user pin's location
                mapModule.plotUserLocation(acFeatures[clickedIndex]);
                mapModule.centerMapOnLocation(acFeatures[clickedIndex]);

                //Hide the suggestions list
                $(this).parent().hide();
                controlsModule.searchCrime(mapModule.getUserLocation());
                return item;
            },
            matcher: function (item) {
                return true; //set candidate list of addresses at "typehead"
            },
            highlighter: function(item) {
                var queries = $.grep(this.query.split(" "), function(x){return x;}); //remove empty string
                var ii=0, back_ii=0;
                var res = "";

                queries.forEach(function(a_query) {
                    ii = item.toLowerCase().indexOf(a_query.toLowerCase(), back_ii); //ii: index of item
                    if (ii < 0) { return; }
                    var a_str = item.substr(ii, a_query.length);
                    var highlight_str = '<strong>' + item.substr(ii, a_str.length) + '</strong>';
                    res += item.substr(back_ii, ii - back_ii) + highlight_str;
                    back_ii = ii + a_str.length;
                });
                res += item.substr(back_ii, item.length - ii);
                return res;
            },
            minLength: 4, items: 10
        });
    }

    function _setSlider() {
        _controlBarContainer.find('#range-slider').noUiSlider({
            start: [urlSearch.getRadius("ft")],
            step: 1,
            connect: 'lower',
            range: {
                'min': [0],
                'max': [5280]
            }
        });
        _controlBarContainer.find('#range-slider').on({
            "slide": function() {
                mapModule.setUserSearchRadius($(this).val() * .3048);
            },
            "change": function() {
                controlsModule.searchCrime(mapModule.getUserLocation());
            },
            "set": function() {
                mapModule.setUserSearchRadius($(this).val() * .3048);
                controlsModule.searchCrime(mapModule.getUserLocation());
            }
        });
        _controlBarContainer.find("#range-slider").Link('lower').to($('#range-slider-input'), null, wNumb({
            decimals: 0
        }));
    }


    function _setDateRange() {
        _options["endDate"] = moment(_options["lastDate"]).format('YYYY-MM-DD');
        _options["startDate"] = moment(_options["lastDate"]).subtract(29, 'days').format('YYYY-MM-DD');

        _controlBarContainer.find('#daterange').val(urlSearch.getStartDate().format('MM/DD/YYYY') + ' - ' + urlSearch.getEndDate().format('MM/DD/YYYY'));

        _controlBarContainer.find('#daterange').daterangepicker({
                ranges: {
                    'Last 30 Days': [moment(_options["lastDate"]).subtract(29, 'days'), moment(_options["lastDate"])],
                    'This Month': [moment().startOf('month'), moment(_options["lastDate"])],
                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                    'This Quarter': [moment(_options["lastDate"]).startOf('quarter'), moment(_options["lastDate"])],
                    'Last Quarter': [moment().subtract(3, 'months').startOf('quarter'), moment().subtract(3, 'months').endOf('quarter')],
                    'This Year': [moment().startOf('year'), moment(_options["lastDate"])],
                    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
                },
                startDate: urlSearch.getStartDate() || moment(_options["lastDate"]).subtract(29, 'days'), // OR isn't needed here, but would then totally depend on urlSearch module
                endDate: urlSearch.getEndDate() || moment(_options["lastDate"]), // OR isn't needed here, but would then totally depend on urlSearch module
                format: 'MM/DD/YYYY'
            },
            function(start, end) {
                _options["startDate"] = start.format('YYYY-MM-DD');
                _options["endDate"] = end.format('YYYY-MM-DD');
                _controlBarContainer.find('#daterange').val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));

                controlsModule.searchCrime(mapModule.getUserLocation());
            });
    }


    function _setDraggingMouse() {
        var isDraggingOnPin = false;
        var isCursorOnPin = false;
        var mapComponent = mapModule.getComponents()["map"]; //map
        var pinFeatureLayer = mapModule.getComponents()["layers"]["user"]; //FeatureLayer(pin)
        pinFeatureLayer.on("mouseover", function(e) { isCursorOnPin = true; });
        pinFeatureLayer.on("mouseout", function(e) { isCursorOnPin = false; });

        var diffLatlng = L.latLng(0.0, 0.0);
        mapComponent.on("mousedown", function(e) {
            if (isCursorOnPin) {
                isDraggingOnPin = true;
                userLatlng = pinFeatureLayer.getGeoJSON().geometry.coordinates;
                diffLatlng.lat = userLatlng[1] - e.latlng.lat;
                diffLatlng.lng = userLatlng[0] - e.latlng.lng;
                mapComponent.dragging.disable();
            }
        });
        mapComponent.on("mouseup", function(e) {
            if (!isDraggingOnPin) return;
            mapComponent.dragging.enable();
            var newGeoJson = pinFeatureLayer.getGeoJSON();
            mapModule.plotUserLocation(newGeoJson);
            mapModule.centerMapOnLocation(newGeoJson);

            isDraggingOnPin = false;

            controlsModule.searchCrime(newGeoJson);
            
            var coordinates = pinFeatureLayer.getGeoJSON().geometry.coordinates;
            resourcesModule.reverseGeocoding(coordinates, function(response) {
                var address = response.features[0].place_name;
                var newUserLocation = response.features[0];
                newGeoJson.properties.name = address.split(', ')[0];
                newGeoJson.properties.locality = response.features[1].text;
                newGeoJson.properties.region = response.features[3].text;
                newGeoJson.properties.postalcode = response.features[2].text;
                address = newGeoJson.properties.name + ', ' + newGeoJson.properties.locality + ', ' + newGeoJson.properties.region;
                clickedIndex = $('.typeahead').val(address);
            });

        });

        mapComponent.on("mousemove", function(e) {
            if (!isDraggingOnPin) return;
            current_geojson = pinFeatureLayer.getGeoJSON();
            current_geojson.geometry.coordinates[0] = e.latlng.lng + diffLatlng.lng;
            current_geojson.geometry.coordinates[1] = e.latlng.lat + diffLatlng.lat;
            pinFeatureLayer.setGeoJSON(current_geojson);
        });
    }

    /**
     * @param {string} query
     */
    function _refreshDownloadButtonURLs(query) {
        _controlBarLowerContainer.find("#download-csv").attr("href", resourcesModule.getCsvLink(query));
        _controlBarLowerContainer.find("#open-geojsonio").attr("href", resourcesModule.getGeojsonio(query));
        _controlBarLowerContainer.find("#open-cartodb").attr("href", resourcesModule.getCartoDbUrl(query));
        _controlBarLowerContainer.find("#email-share").attr("href", resourcesModule.setEmailLink());
    }

    /**
     * @param {string} query
     */
    function _loadDataToTable(query) {
        var datasetURL = resourcesModule.getDatasetJsonURL(query);
        _table.ajax.url(datasetURL).load(function(data){
          // console.log("data", data);
        });
    }

    function _searchCrime(userLocation) {

        //Start the API call
        //var userLocation = mapModule.getUserLocation();
        var radius = mapModule.getUserSearchRadius();

        urlSearch.pushIntoUrl(userLocation, _options, radius); // push search results into url
        _loadRadialIncidentData();
    }

    function _setDataUpdated() {
        var query = "?$select=date,time&$limit=1&$order=date DESC,time DESC";
        var datasetRequest = resourcesModule.getDatasetJsonURL(query);
        $.getJSON(datasetRequest, function(data) {
            $('#data-updated').html('<b>Data available through ' + moment(data[0].date).format('MMMM DD, YYYY') + ' at ' + moment(data[0].time, 'HH:mm').format('hh:mm a') + '</b>');
            _options["lastDate"] = moment(data[0].date).format('YYYY-MM-DD');
            _setDateRange();
        });
    }

    function _getStartDate() {
        return _options["startDate"];
    }

    function _getEndDate() {
        return _options["endDate"];
    }

    function _getLastDate() {
        return _options["lastDate"];
    }

    function _loadRadialIncidentData() {
        var query = _buildRadialIncidentDataQuery();

        mapModule.showLoader();
        resourcesModule.getIncidentsFromAPI(query, function(data) {
            mapModule.drawApiResponse(data);
            _refreshDownloadButtonURLs(query);
            _loadDataToTable(query);
        });
    }

    function _buildRadialIncidentDataQuery() {
        var startDate = _options.startDate;
        var endDate = _options.endDate;
        var coordinates = mapModule.getUserLocation().geometry.coordinates;
        var longitude = coordinates[0];
        var latitude = coordinates[1];
        var radius = mapModule.getUserSearchRadius();

        return "?$where="
          + "date >= '" + startDate + "'"
          + " AND date <= '" + endDate + "'"
          + " AND within_circle(location," +  latitude + "," + longitude + "," + radius + ")"
          + "&$order=date DESC"
          + "&$limit=100000";
    }

    /**
     * @param {string} query
     */
    function _refreshDownloadButtonURLs(query) {
        _controlBarLowerContainer.find("#download-csv").attr("href", resourcesModule.getCsvLink(query));
        _controlBarLowerContainer.find("#open-geojsonio").attr("href", resourcesModule.getGeojsonio(query));
        _controlBarLowerContainer.find("#open-cartodb").attr("href", resourcesModule.getCartoDbUrl(query));
        _controlBarLowerContainer.find("#email-share").attr("href", resourcesModule.setEmailLink());
    }

    /**
     * @param {string} query
     */
    function _loadDataToTable(query) {
        var datasetURL = resourcesModule.getDatasetJsonURL(query);
        _table.ajax.url(datasetURL).load(function(data){
          // console.log("data", data);
        });
    }

    return {
        init: _init,
        searchCrime: _searchCrime,
        getEndDate: _getEndDate,
        getStartDate: _getStartDate,
        getLastDate: _getLastDate,
        refreshDownloadButtonURLs: _refreshDownloadButtonURLs,
        loadDataToTable: _loadDataToTable
    };

})(window, jQuery);
