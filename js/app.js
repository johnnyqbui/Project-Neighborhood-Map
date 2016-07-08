var map;
var markers = [];
var markerinfo = [];


function initMap() {
	// Center location to Seattle, WA
	var seattle = new google.maps.LatLng(47.6062, -122.3321);
    map = new google.maps.Map(document.getElementById('map'), {
        center: seattle,
        zoom: 13
    });

    // Obtain info from search box to search for place
    var input = document.getElementById('placeInput');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias search to within bounds of map
    map.addListener('bounds_changed', function() {
    	searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
    	searchBoxPlaces(searchBox);
    });
}

    function searchBoxPlaces(searchBox) {
        var places = searchBox.getPlaces();
        createMarkersForPlaces(places);
        if (places.length === 0) {
          window.alert('We did not find any places matching that search');
        }
      }

      function createMarkersForPlaces(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          var icon = {
            url: place.icon,
            size: new google.maps.Size(30, 30),
            scaledSize: new google.maps.Size(25,25)
          };
          markerTimeout(place, i*40, icon);
      }
    }

      function markerTimeout(place, timeout, icon) {
        window.setTimeout(function() {
          var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id,
            animation: google.maps.Animation.DROP
          });
          placeInfo(marker);
        }, timeout);
      }

      function placeInfo(marker) {
        //Create a single infowindow to be used with the place details information
        // so that only one is open at once.
        var placeInfoWindow = new google.maps.InfoWindow();
        marker.addListener('click', function() {
          if (placeInfoWindow.marker === this) {
            console.log("This infowindow is already on this marker");
          } else {
            getPlacesDetails(this, placeInfoWindow);
          }
        });

        placeMarkers.push(marker);
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
      }

      function getPlacesDetails(marker, infowindow) {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
          placeId: marker.id
        }, function(place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Set the marker property on this infowindow so it isn't created again.
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if (place.name) {
              innerHTML += '<strong>' + place.name + '</strong>';
            }
            if (place.formatted_address) {
              innerHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
              innerHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
              innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
              innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                {maxHeight: 100, maxWidth: 200}) + '">';
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
              infowindow.marker = null;
            });
          }
        });
      }

function viewModel() {

    this.place = ko.observable("");

}

ko.applyBindings(new viewModel());
