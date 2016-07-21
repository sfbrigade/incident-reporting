// test search = http://127.0.0.1:8080/?address=500+Church+Street&city=San+Francisco&state=CA&zip=94114&startDate=2016-06-01&endDate=2016-06-30
// test searchLive = https://sf-crime-data-61764.firebaseapp.com/?address=900%20Van%20Ness%20Avenue&city=San%20Francisco&state=CA&zip=94109

var urlSearch = (function(){

  function _runURLsearch(){
    var uri = new URI();
    uri = uri.query(true);
    console.log("urlSearch uri", uri);

    var search = uri.address + ", " + uri.city + ", " + uri.state + ", " + uri.zip

    //Assign the returned autocomplete values to a variable
    var addressCall = resourcesModule.getJustAddress(search);

    addressCall.done(function(data){

      //Use the map module to change the user pin's location
      mapModule.plotUserLocation(data.features[0]);
      mapModule.centerMapOnLocation(data.features[0]);
      mapModule.setUserSearchRadius(uri.radius);

      //assign the selected values to the address and radius fields
      $('#inputAddress').val(search);
      // $('#').value(uri.radius);

      //Start the API call
      var userLocation = mapModule.getUserLocation();
      var query = "?$where=date >= '" + controlsModule.getStartDate() + "' AND date <= '" + controlsModule.getEndDate() + "' AND within_circle(location," + userLocation["geometry"]["coordinates"][1] + "," + userLocation["geometry"]["coordinates"][0] + "," + mapModule.getUserSearchRadius() + ")&$order=date DESC";

      mapModule.showLoader();

      resourcesModule.getIncidentsFromAPI(query, function(data) {
          //data - is a FeatureCollection with an array "features"
          mapModule.drawApiResponse(data);
          controlsModule.refreshDownloadButtonURLs(query);
          controlsModule.loadDataToTable(query);
      });
    })
  }

  function _urlPushSearch(locationResult, dates, radius) {
    var newSearch = null;
    var uri = new URI();
    var searchInput = {}
    if (locationResult) {
      searchInput = Object.assign(searchInput, {
        address: locationResult.properties.name,
        city: locationResult.properties.locality,
        state: locationResult.properties.region_a,
        zip: locationResult.properties.postalcode
      })
    }
    if (dates) {
      searchInput = Object.assign(searchInput, dates)
    }
    if (radius) {
      radius = radius.toFixed(0)
      searchInput = Object.assign(searchInput, {radius: radius})
    }
    uri.setSearch(searchInput)
    newSearch = uri.build();

    history.pushState(null, '', newSearch)
  }

  function _getStartDate() {
    var uri = new URI();
    uri = uri.search(true);
    var date = uri.startDate ? moment(uri.startDate) : moment().subtract(29, 'days')
    return date;
  }

  function _getEndDate() {
    var uri = new URI();
    uri = uri.search(true);
    return moment(uri.endDate);
  }

  function _getRadius(unit){
    var result = null;
    var uri = new URI();
    uri = uri.search(true);
    if (uri.radius) {
      result = (unit === "ft") ? uri.radius * 3.28084 : uri.radius;
      result = result.toFixed(0)
    } else {
      result = 1320;
    }
    return result
  }

  return {
    runURLsearch: _runURLsearch,
    urlPushSearch: _urlPushSearch,
    getStartDate: _getStartDate,
    getEndDate: _getEndDate,
    getRadius: _getRadius
  }
})()
