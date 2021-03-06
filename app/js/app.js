// Define global variables
var map,
    bounds,
    infowindow,
    placeMarkers = [];

// List of location's lat/lng to display location markers and venueIds to obtain information from Foursquare's API
var dayLocations = [
    { name: "Space Needle", lat: 47.6205063, lng: -122.3492774, venueId: '416dc180f964a5209b1d1fe3' },
    { name: "Green Leaf Vietnamese Restaurant", lat: 47.61670840000001, lng: -122.3517688, venueId: '4fb18f18e4b010d66e81ba9f' },
    { name: "Washington Park Aboretum", lat: 47.64013920000001, lng: -122.2937804, venueId: '456f3980f964a520293e1fe3' },
    { name: "La Parisienne", lat: 47.6167233, lng: -122.3466166, venueId: '52e410a2498e9aa390a5a57e' },
    { name: "Pike Place Market", lat: 47.6107056, lng: -122.34262260000003, venueId: '427ea800f964a520b1211fe3' },
    { name: "The Center for Wooden Boats", lat: 47.6264836, lng: -122.3357686, venueId: '4700c686f964a520354b1fe3' },
    { name: "Gas Works Park", lat: 47.6456308, lng: -122.33435320000001, venueId: '430bb880f964a5203a271fe3' },
    { name: "Brandon Lee and Bruce Lee's Grave Site", lat: 47.6337698, lng: -122.3158282, venueId: '4b91714cf964a520d9bc33e3' }
];
var nightLocations = [
    { name: "Umi Sake House", lat: 47.6132995, lng: -122.34610700000002, venueId: '447da2d6f964a520fb331fe3' },
    { name: "Seattle Great Wheel", lat: 47.60608000000001, lng: -122.34250400000002, venueId: '4fbfa89ee4b0fddeca5b5cef' },
    { name: "The Pink Door", lat: 47.61028899999999, lng: -122.3426586, venueId: '40b13b00f964a52066f71ee3' },
    { name: "Foundation Nightclub", lat: 47.6124774, lng: -122.34641870000002, venueId: '50188ad9e4b097c9194701f1' },
    { name: "Rock Box", lat: 47.61551009999999, lng: -122.32018970000001, venueId: '4ce7469f9f776ea8aa225722' },
    { name: "Raygun Lounge", lat: 47.6150589, lng: -122.32516729999998, venueId: '5025abd0e4b0f6756695d4c1' },
    { name: "Chihuly Garden and Glass", lat: 47.620563, lng: -122.35046599999998, venueId: '4f2334b8e4b0085e48b153c0' }
];

// Style for Google maps if Night Time Locations is clicked
var nightStyle = [{
    "elementType": "labels.text.stroke",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
        { "visibility": "on" },
        { "weight": 0.1 },
        { "lightness": -14 },
        { "color": "#5f6666" }
    ]
}, {
    "featureType": "landscape",
    "elementType": "labels.text.fill",
    "stylers": [
        { "visibility": "on" },
        { "color": "#525351" }
    ]
}, {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
        { "visibility": "on" },
        { "color": "#04142b" },
        { "lightness": -37 }
    ]
}, {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
        { "visibility": "on" },
        { "lightness": -49 },
        { "color": "#081620" }
    ]
}, {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
        { "visibility": "on" },
        { "color": "#585959" }
    ]
}, {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
        { "visibility": "on" },
        { "lightness": -21 },
        { "color": "#081424" }
    ]
}, {
    "featureType": "road",
    "elementType": "labels",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
        { "visibility": "on" },
        { "color": "#AB2C2A" }
    ]
}, {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
        { "visibility": "on" },
        { "color": "#273235" },
        { "weight": 1.5 }
    ]
}, {
    "featureType": "road.local",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "transit",
    "stylers": [
        { "visibility": "off" }
    ]
}, {
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
        { "color": "#5c6060" }
    ]
}, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
        { "visibility": "on" },
        { "color": "#0c101b" },
        { "lightness": -54 }
    ]
}];

// Initialize Google Maps
function initMap() {
    // Center location to Seattle, WA
    var seattle = new google.maps.LatLng(47.6062, -122.3321);
    map = new google.maps.Map(document.getElementById('map'), {
        center: seattle,
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false
    });
    infowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    // Apply Knockout Bindings to viewModel
    ko.applyBindings(new viewModel());
}

// Create Knockout Model data with the parameters given
function locationData(data, marker) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.placeId = ko.observable(data.placeId);
    this.marker = marker;
}

// Knockout ViewModel
function viewModel() {
    // Define self to maintain reference to original "this"
    var self = this;

    // Store Knockout Observable objects created from the locationData function
    this.locations = ko.observableArray([]);

    // "Observe" side-bar to animate list
    this.animate = ko.observable('');

    // By default, list is shown
    this.showList = ko.observable(true);

    // By default, set day button to darken
    this.darkenDayBtn = ko.observable(true);

    // Toggles show/hide List
    this.toggleList = function() {
        // If show list is true when clicked, then set it to false then set value of button
        // to 'Show List' and vice versa
        self.showList() ? self.showList(false) : self.showList(true);

        // If show list is true when clicked, then animate side bar and vice versa
        self.showList() ? self.animate('hide-list') : self.animate('show-list');
    };

    // Display locations if Day Time/Night Time Locations button is clicked
    this.dayVsNight = function(clicked) {
        // Remove objects from self.locations array
        self.locations.removeAll();

        // Remove previous markers
        removeMarkers();

        // Conditions if day/night button is pressed
        if (clicked === "night") {
            // Pass night style theme in as argument along with night locations
            locationsDayNight(nightLocations, nightStyle);

            // Lighten day button/Darken night button
            self.darkenDayBtn(false);

            // Obtain Lat/Lng to pan to night locations
            var nightPan = new google.maps.LatLng(nightLocations[0].lat, nightLocations[0].lng);
            map.panTo(nightPan);
        } else {
            // Run if day locations is clicked
            locationsDayNight(dayLocations);

            // Darken day button/Lighten day Button
            self.darkenDayBtn(true);
        }
    };

    // Default locations
    locationsDayNight(dayLocations);

    // Display markers on map and push objects to self.locations array
    function locationsDayNight(locations, style) {
        // Interate through locations
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];

            // Obtain Lat/Lng from each locations to display position
            var myLatLng = new google.maps.LatLng(location.lat, location.lng);

            // Display Marker positions and create marker ids
            var marker = new google.maps.Marker({
                map: map,
                title: location.name,
                position: myLatLng,
                id: location.venueId,
                animation: google.maps.Animation.DROP,
            });

            // Pass arguments through to markerClicked function
            marker.addListener('click', function() {
                markerInfoWindow(this, infowindow);
            });

            // Push marker to placeMarkers array
            placeMarkers.push(marker);

            // Push object data and newly created markers to self.locations array
            self.locations.push(new locationData(location, marker));

            // Extend map bounds
            bounds.extend(myLatLng);
        }
        // Set map bound to locations
        map.fitBounds(bounds);
        // Apply styles to map if available
        map.setOptions({ styles: style });
    }

    // Obtain value from filter box
    this.filter = ko.observable('');

    // Display filtered results dynamically to list
    this.filteredLocations = ko.computed(function() {

        // Obtain objects from self.locations array
        return ko.utils.arrayFilter(self.locations(), function(listResult) {
            var lowerCasedResults = listResult.name().toLowerCase();
            var lowerCaseFilter = self.filter().toLowerCase();

            // Finds any letters that matches listResults from filter box
            var result = lowerCasedResults.indexOf(lowerCaseFilter);

            // Returns name and map markers if there is a matched string, else hide marker.
            if (result >= 0) {
                listResult.marker.setVisible(true);
                return listResult.name();
            } else {
                listResult.marker.setVisible(false);
            }
        });
    });

    // Sets current location object
    this.currentLocation = ko.observable(this.locations()[0]);

    // Display Infowindow for marker when name is clicked in list view
    this.setLocation = function(clickedLocation) {

        // Set current location if that location's name is clicked in the list view
        self.currentLocation(clickedLocation);

        // Center marker if the location is clicked
        var centerMarker = self.currentLocation().marker;
        var center = centerMarker.getPosition();
        map.setCenter(center);

        // Obtain current marker's infowindow after clicking on name from list
        markerInfoWindow(self.currentLocation().marker, infowindow);

        // Element of responsive design; If window width is <= 450px then run toggleList function to hide list
        if ($(window).width() <= 450) {
            self.toggleList();
        }
    };
}

// Clear markers on map
function removeMarkers() {
    for (var i = 0; i < placeMarkers.length; i++) {
        placeMarkers[i].setMap(null);
    }
    placeMarkers = [];
}

// Set marker animation off/ get locations details
function markerInfoWindow(marker, infowindow) {

    // Set all markers animation from placeMarkers array to null to prevent multiple animated markers
    for (var i = 0; i < placeMarkers.length; i++) {
        placeMarkers[i].setAnimation(null);
    }

    // Set marker animation to null if infowindow is closed
    infowindow.addListener('closeclick', function() {
        marker.setAnimation(null);
    });

    // If same marker is clicked again, then close it, otherwise obtain infowindow information and display it
    marker === infowindow.anchor ? infowindow.close() : locationDetails(marker, infowindow);
}


// Obtain details from locations and display infowindow
function locationDetails(marker, infowindow) {
    var venueId = marker.id;
    var client_ID = '5QH5BQKIHD5AYO0YDHZZOA0JI10K5F5OAORSBWZXJX5KPAIG';
    var client_SECRET = 'IDJ0GEAFC25OXFVFHB12HNFHKAHNGDZPMGTLTTOBL3PN3AWI';
    marker.setAnimation(google.maps.Animation.BOUNCE);

    // Open info window first
    infowindow.open(map, marker);

    // Obtain location details with Foursquare's API using Jquery's ajax
    // request method, then display data to infowindow after ajax request is complete
    $.when($.ajax({
        async: true,
        cache: true,
        url: 'https://api.foursquare.com/v2/venues/' + venueId + '?client_id=' + client_ID + '&client_secret=' + client_SECRET + '&v=20160720',
        // Error handling for Foursquare API
        error: function() {
            alert("Sorry, unable to obtain location details. Please refresh the page and try again.");
        }
    })).done(function(data) {
            var locationPhoto = data.response.venue.photos.groups[0].items[0].prefix + '250x160' + data.response.venue.photos.groups[0].items[1].suffix;
            var locationName = marker.title;
            var locationAddress = data.response.venue.location.formattedAddress;
            var locationPhoneNumber = data.response.venue.contact.formattedPhone;
            var locationHours = data.response.venue.hours;
            var locationRating = data.response.venue.rating;
            var locationHereNow = data.response.venue.hereNow.summary;
            var infoWindowContent = '<div">';
            if (locationPhoto) {
                infoWindowContent += '<img src="' + locationPhoto + '">';
                infoWindowContent += '<br><strong>' + locationName + '</strong>';
            }

            if (locationAddress) {
                infoWindowContent += '<br>' + locationAddress[0] + '<br>' + locationAddress[1];
            }

            if (locationPhoneNumber) {
                infoWindowContent += '<br>' + locationPhoneNumber;
            }

            if (locationHours) {
                infoWindowContent += '<br>' + locationHours.status;
            }

            if (locationRating) {
                infoWindowContent += '<br><br>' + 'Rating: ' + locationRating;
            }

            if (locationHereNow) {
                infoWindowContent += "<br>" + locationHereNow;
            }

            infoWindowContent += '<br><br><i>Data Source: <a href="https://foursquare.com/">Foursquare</a></i></div>';

            // Set content to info window
            infowindow.setContent(infoWindowContent);
        }
    );
}

// Error handling for Google Maps
function googleError() {
    alert("Sorry, Google Maps could not be loaded. Please refresh the page and try again.");
}
