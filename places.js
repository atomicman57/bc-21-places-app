// *****************************************************
// Function to get user's current longitude and Latitude
var lat
var lon
function getBrowserLocation() {
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
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

// ************************************
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

// ***************************************************************************************
// Function to Search based on places entered by the user or selected through autocomplete
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
  // get the result div from html
  var $resultDiv = $('#result');
  $resultDiv.empty();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var $container = $('<div class="card card--small">');
      var $name = $('<h2 class="card__title">');
      var $pic = $('<div class="card__image">');
      var $address = $('<div class="card__action-bar">');
      var $fav = $('<button type="button" class="favorite fa fa-star">');
      var place = results[i];
      console.log(place);

      
      $name.append(place.name);
      var imgUrl = place.photos && place.photos.length ? place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : place.icon;
      $pic.css('background-image', 'url(' + imgUrl + ')')
      $pic.attr('url', imgUrl)
      $address.append(place.formatted_address);

      $fav.appendTo($container)
      $name.appendTo($container);
      $pic.appendTo($container);
      $address.appendTo($container);
      $container.appendTo($resultDiv);
    }
  }
}

// ********************************
// Function to search places nearby
var map;
var service;
var infowindow;

function nearest() {
  var pyrmont = new google.maps.LatLng(lat,lon);
  var selected = $('input[name=category]:checked').val();

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '1000',
    types: [selected]
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, call);
}

function call(results, status) {
  var $resultDiv = $('#result');
  $resultDiv.empty();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var $container = $('<div class="card card--small">');
      var $name = $('<h2 class="card__title">');
      var $fav = $('<div class="favorite">');
      var $pic = $('<div class="card__image">');
      var $img = $('<img>');
      var $address = $('<div class="card__action-bar">');
      var place = results[i];
      console.log(place)
      $name.append(place.name);
      var imgUrl = place.photos && place.photos.length ? place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : place.icon;
      $pic.css('background-image', 'url(' + imgUrl + ')')
      $fav.append("Hi")
      $address.append(place.vicinity);

      $fav.appendTo($container);
      $name.appendTo($container);
      $pic.appendTo($container);
      $address.appendTo($container);
      $container.appendTo($resultDiv);
    }
  }
}
$('.form1').submit(initialize);

// *******************************************************************************************
// Run getbrowser location on checking checkbox and hide submit button for initialize function
$('#check').on('change', function () {
  if ($(this).is(':checked')){
    $("#entry").attr('disabled','disabled');
    $("#search1").hide();
    $("#search2").show();
    getBrowserLocation();
  }
  else{
    $("#entry").removeAttr('disabled');
    $("#search1").show();
    $("#search2").hide();
  }
});

// **********************************
// Hide submit button for function nearest
$(document).ready(function() {
  $(".search2").hide();
});


// Hide search nearby button for function nearest
$(function(){
  $("#search2").hide();
})

// **********************************
// Get favorite data
$("#result").on('click', "button.favorite", function(){
  var k = $(this).parent()
  var a = k.find('.card__title').text();
  var b = k.find('.card__action-bar').text();
  var c = k.find('.card__image').attr('url');
  var obj = {name:a, address:b, imgUrl:c};
  console.log(obj);
});

// **********************************
// Save to local storage
if (typeof(Storage) !== "undefined") {
  localStorage.setItem("name", "Smith");
} else {
    
}
  