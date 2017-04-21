// Get user's current longitude and Latitude
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

// Autocomplete User search
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

// Search based autocomplete/user entry
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
  var $resultDiv = $('#result');  // get the result div from html
  $resultDiv.empty();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var $container = $('<div class="card card--small">');
      var $name = $('<h2 class="card__title">');
      var $pic = $('<div class="card__image">');
      var $id = $('<div class="card__id">')
      var $address = $('<div class="card__action-bar">');
      var $fav = $('<button type="button" class="favorite fa fa-star">');
      var place = results[i];
      
      $name.append(place.name);
      var imgUrl = place.photos && place.photos.length ? place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : place.icon;
      $pic.css('background-image', 'url(' + imgUrl + ')')
      $pic.attr('url', imgUrl);
      $id.css('display', 'none')
      $id.append(place.place_id);
      $address.append(place.formatted_address);
      var available = place.name;
      console.log(status)

      $id.appendTo($container);
      $fav.appendTo($container);
      $name.appendTo($container);
      $pic.appendTo($container);
      $address.appendTo($container);
      $container.appendTo($resultDiv);
    }
  }
  else{
    var $resultDiv = $('#result');  // get the result div from html
    $resultDiv.empty();
    var $container = $('<div class="card card--small">');
    var $name = $('<h2 class="card__title">');

    $name.append('No Results Found');
    $name.appendTo($container);
    $container.appendTo($resultDiv);
  }
}

// Search  with current location
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
  else{
    var $resultDiv = $('#result');  // get the result div from html
    $resultDiv.empty();
    var $container = $('<div class="card card--small">');
    var $name = $('<h2 class="card__title">');

    $name.append('No Results Found');
    $name.appendTo($container);
    $container.appendTo($resultDiv);
  }
}

// Run initialize on submitting form
$('.form1').submit(initialize);

// Run getbrowser location on checking checkbox
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

// Hide submit button for function nearest
$(document).ready(function() {
  $(".search2").hide();
});

// Hide search nearby button for function nearest
$(function(){
  $("#search2").hide();
})

// Get favorite data
$("#result").on('click', "button.favorite", function(){
  var k = $(this).parent()
  var a = k.find('.card__title').text();
  var b = k.find('.card__action-bar').text();
  var c = k.find('.card__image').attr('url');
  var d = k.find('.card__id').text();
  $(this).toggleClass('clicked');
  var obj = {name:a, address:b, imgUrl:c, id:d};
  localStorage.setItem(obj.id, JSON.stringify(obj));  // Save to local storage
});

// Get from local storage
function get() {
  var $resultDiv = $('#result');
  $resultDiv.empty();
  for (var i = 0; i < localStorage.length; i++) {
    var ide = localStorage.key(i)
    var obj = JSON.parse(localStorage.getItem(ide));
    var $container = $('<div class="card card--small">');
    var $name = $('<h2 class="card__title">');
    var $pic = $('<div class="card__image">');
    var $img = $('<img>');
    var $address = $('<div class="card__action-bar">');

    $name.append(obj.name);
    var imgUrl = obj.imgUrl;
    $pic.css('background-image', 'url(' + imgUrl + ')')
    $address.append(obj.address);

    $name.appendTo($container);
    $pic.appendTo($container);
    $address.appendTo($container);
    $container.appendTo($resultDiv);

  }
}

// Click favorites to run get function
$('#favd').on('click', get());






  