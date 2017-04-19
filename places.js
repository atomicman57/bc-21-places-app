// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// Function to get user's current longitude and Latitude
var lat
var lon
window.onload = function() {
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
// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// Function to Search based on places entered by the user
var map;
var service;
var infowindow;

function initialize() {
var entry = document.getElementById('entry').value
// alert(entry)
  var pyrmont = new google.maps.LatLng(lat,lon);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });
  var request = {
    location: pyrmont,
    radius: '500',
    query: entry
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  console.log(status);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place);
    }
  }
}
//   else {
//     alert("Mayowa...Do something about error message!")
//   }
// }
// ********************************************************************
// ********************************************************************
// ********************************************************************
// ********************************************************************
// Function to Sort Search by establishment
