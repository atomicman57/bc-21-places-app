// Get user's current longitude and Latitude
var lat;
var lon;
var map;
var service;
var infowindow;

function renderSearchResult(results, status) {
  var $resultDiv = $('#result');  // get the result div from html
  $resultDiv.empty();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      var $container = $('<div class="card card--small">');
      var $name = $('<h2 class="card__title">');
      var $pic = $('<div class="card__image">');
      var $id = $('<div class="card__id">')
      var $address = $('<div class="card__action-bar">');
      var $fav = $('<button type="button" class="favorite fa fa-star">');
      
      $name.append(place.name);
      var imgUrl = place.photos && place.photos.length ? place.photos[0].getUrl({'maxWidth': 160, 'maxHeight': 160}) : place.icon;
      $pic.css('background-image', 'url(' + imgUrl + ')')
      $pic.attr('url', imgUrl);
      $id.css('display', 'none')
      $id.append(place.place_id);
      $address.append(place.vicinity || place.formatted_address);

      $id.appendTo($container);
      $fav.appendTo($container);
      $name.appendTo($container);
      $pic.appendTo($container);
      $address.appendTo($container);
      $id.appendTo($container);

      $container.appendTo($resultDiv);

      if (localStorage.getItem(place.place_id)) {
        $fav.addClass("clicked");
      };
    }
  }
  else{
    noResults()
  }
}

// Search based autocomplete/user entry
function searchWithText(e) {
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
    radius: '1000',
    query: entry,
    type: selected
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, renderSearchResult);
}

// Search  with current location
function searchWithCurrent() {
  var pyrmont = new google.maps.LatLng(lat, lon);
  var selected = $('input[name=category]:checked').val();

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '1000',
    type: selected
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, renderSearchResult);
}

// Run getbrowser location on checking checkbox
$('#check').on('change', function () {
  if ($(this).is(':checked')){
    var $entry = $('#entry')
    $entry.attr('disabled','disabled');
    $entry.val('');
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


// Get favorite data
$("#result").on('click', "button.favorite", function() {
  var $this = $(this);
  $this.toggleClass('clicked');
  var target = $this.parent();
  var id = target.find('.card__id').text();

  if (localStorage.getItem(id)) {
    localStorage.removeItem(id)
  } 
  else {
    var name = target.find('.card__title').text();
    var addr = target.find('.card__action-bar').text();
    var url = target.find('.card__image').attr('url');
    var obj = {name: name, address: addr, imgUrl: url, id: id};
    localStorage.setItem(obj.id, JSON.stringify(obj));
  }
});

// Get from local storage
function getFromLocal(e) {
  e.preventDefault();
  var $resultDiv = $('#result');
  $resultDiv.empty();
  var $clear = $('<button class="clear_all">');

  // Clear LocalStorage
  $clear.click(function () {
      $('#result').empty();
      localStorage.clear();
  })

  $clear.append('Clear Favs');
  $clear.appendTo($resultDiv);
  for (var i = 0; i < localStorage.length; i++) {
    var ide = localStorage.key(i)
    var obj = JSON.parse(localStorage.getItem(ide));
    $container = $('<div class="card card--small">');
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


$('#favd').on('click', getFromLocal);

function noResults () {
  var $resultDiv = $('#result');  // get the result div from html
  $resultDiv.empty();
  var $container = $('<div class="card card--small">');
  var $name = $('<h2 class="card__title">');

  $name.append('No Results Found');
  $name.appendTo($container);
  $container.appendTo($resultDiv);
}

// Autocomplete User search
function addAutocomplete() {
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

addAutocomplete();
$('.form1').submit(searchWithText);
$('#search2').click(searchWithCurrent);
// Hide search nearby button for function nearest
$("#search2").hide();
