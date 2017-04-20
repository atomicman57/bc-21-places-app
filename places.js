// Function to get user's current longitude and Latitude
var lat
var lon
function getBrowserLocation() {
  var startPos;
  var geoOptions = {
     timeout: 10 * 1000
  }
  var geoSuccess = function(position) {
    startPos = position;
    lat = startPos.coords.latitude;
    lon = startPos.coords.longitude;
  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

// Function to Autocomplete User search
function search() {
  var address = (document.getElementById('entry'));
  var autocomplete = new google.maps.places.Autocomplete(address);
  autocomplete.setTypes(['geocode']);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }
    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
  });
}
search()

// Function to Search based on places entered by the user
var map;
var service;
var infowindow;

function initialize(e) {
  e.preventDefault();
  var entry = document.getElementById('entry').value
  var selected = $('input[name=category]:checked').val();
  var pyrmont = new google.maps.LatLng(lat,lon);
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
  });
  var request = {
    location: pyrmont,
    radius: '5000',
    query: entry,
    type: selected
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  // get the result div
  var $resultDiv = $('#result');
  $resultDiv.empty();
  // console.log(status);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var $container = $('<div class="out">');
      var $name = $('<div class="name">');
      var $pic = $('<div class="pics">');
      var $img = $('<img>');
      var $address = $('<div class="addr">');
      var place = results[i];
      console.log(place)
      $name.append(place.name);
      // $img.attr('src', place.photos ? place.photos[0].getUrl() : place.icon);
      $pic.append($img);
      $address.append(place.formatted_address);

      $name.appendTo($container);
      $pic.appendTo($container);
      $address.appendTo($container);
      $container.appendTo($resultDiv);
    }
  }
}




    

// Function to search places nearby
var map;
var service;
var infowindow;

function nearest() {
  var pyrmont = new google.maps.LatLng(lat,lon);
  console.log(lat)
  console.log(lon)

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '1000',
    types: ['store', 'bar', 'food', 'church', 'school']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, call);
}

function call(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place)
    }
  }
}

$('.form1').submit(initialize);