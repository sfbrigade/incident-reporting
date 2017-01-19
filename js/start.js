$(document).ready(function() {
    init();

    function init() {
        window.incidentService = new IncidentService(config.incidentServiceOptions);

        formModule.init();
        mapModule.init(config.popupContent);
        tableModule.init();
        urlSearchModule.initializeViewModelFromUrlParameters();
    }
});
