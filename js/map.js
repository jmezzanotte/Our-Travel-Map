/*
 * John Mezzanote
 * jmezzan1@my.smccd.edu
 * CIS 114 OL
 * map.js
 * FINAL
 * 12-13-2015
 * Resources Used: Google Maps API Docs
 * https://developers.google.com/maps/documentation
 * I didn't use any example files. I only reviewed the API documentation a tried to write my 
 * code using it as a reference point. 
 * Notes: I tried to write helper functions to reduce some of the code replication needed to 
 * create the markers and info windows. 
 */	

function getXMLHttpRequestObject(){
	
	'use strict'; 
	
	var ajax = null;
	
	if(window.XMLHttpRequest){
		ajax = new XMLHttpRequest();
	}else if (window.ActiveXObject){ // handle older IE
		ajax = new ActiveXObject('MSXML2.XMLHTTP>3.0');
	}
	
	return ajax;
	
}

function getMapData(callback){
	
	var ajax = getXMLHttpRequestObject();
	
	var url = "http://our-travel-map.herokuapp.com/resources/countries.json";
	ajax.open('GET', url, true); 
	ajax.send(null); 
	
	ajax.onreadystatechange = function(){
		if(ajax.readyState == 4){
			// check the server status code as well 
			if((ajax.status >= 200 && ajax.status < 300 ) ||
					(ajax.status == 304)){
				if(typeof callback == 'function'){
					callback.apply(ajax); // this will hand your ajax object to the callback function
				}
			}
		}else{
			console.log("status: " + ajax.statusText);
		}	
	}
}

function addMarker(markerPosition, markerName){
	
	var marker = new google.maps.Marker({
		position:markerPosition ,
		title : markerName
	});
	
	return marker;
	
}

function addMarkerEvents(id, type, marker, infoWindow, map){
	// will add a click event to both the marker and the links in the Key 
	// uses the utilities object to help. 
	

	U.addEvent(U.$(id), type, function(e){
		
		'use strict'; 
	
		if(e == 'undefined') e = window.event;		
		var target = e.target || e.srcElement;
		
		U.getActiveElement.getClicked(target);
		
		infoWindow.open(map, marker);
		map.setZoom(8);
		map.setCenter(marker.getPosition());
		
	});
	
	// add the mouseover and out event to marker 
	marker.addListener('mouseover', function() {
	   
	    infoWindow.open(map, marker);
   
	});
	
	marker.addListener('mouseout', function() {
		var timer = setTimeout(function(){
			infoWindow.close();
		}, 2000) // 2 seconds
	});
}

function addInfoWindowContent(header, image, message){
	contentString = 
		'<div id="content">' + 
		'<h3>' + header + '</h3><hr>' + 
		'<img width="200" src="images/' + image + '" />' +
		'<p>' + message + '</p>' +  
		'</div>';
	
	return contentString; 
}


function initMap(){
	
	getMapData(function(){
		
		// get the map data as JSON
		var data = JSON.parse(this.responseText);
		
		var mapContainer = U.$('map'); 
		
		var map = new google.maps.Map(mapContainer, {
			center : {lat: 47.8, lng: 13.644},
			zoom : 3, 
			zoomContol : true, 
			scaleControl : true
		}); 
		
		// loop through data adding markers 
		for(var i = 0 ; i < data.length; i++){
			var marker = addMarker({lat:data[i].location.lat, lng:data[i].location.lng}, data[i].city);
			// give the maker an info window
			var newInfoWindow = new google.maps.InfoWindow({
				content: addInfoWindowContent(data[i].city + " - " + data[i].country, data[i].city + ".jpg", data[i].message)
			});
			
			marker.setMap(map);
			
			// add some events 
			addMarkerEvents(data[i].city, 'click', marker, newInfoWindow, map);
		}
		
		U.addEvent(U.$('zoomout'), 'click', function(){
			map.setZoom(3);
		});
	});
	
} // end initMap


window.onload = function(){

	U.addEvent(document.documentElement, 'mousedown', U.draggable.enableDrag);
	
	var cities = document.querySelectorAll('#locations .accordian');
	console.log(cities);
	for(var i=0; i < cities.length; i++){
		var elem = cities[i];
		U.addEvent(document.documentElement,'click',U.accordian); 
	}
	
}


	



// Old code. Write about this on your portfolio site.
	/*

	//get a refence to DOM element that will hold your map 
	var mapContainer = U.$('map');
		
	var map = new google.maps.Map(mapContainer, {
		center : {lat: 47.8, lng: 13.644}, 
		zoom: 4, 
		zoomControl: true, 
		scaleControl: true
	});
		
	//test[i].country
	// modify this to be an array. hold your marker objects in an array. then iterate through it 
	// calling the addMarker function
	var salzburgMarker = addMarker({lat:47.8, lng: 13.033}, 'Salzburg');
	var viennaMarker = addMarker({lat:48.2 , lng:16.366 }, 'Vienna');
	var pragueMarker = addMarker({lat:50.0833 , lng:14.466 }, 'Prague');
	var londonMarker = addMarker({lat: 51.5, lng:-0.116667}, 'London');
	var florenceMarker = addMarker({lat: 43.7666, lng:11.25}, 'Florence');
	var parisMarker = addMarker({lat:48.8666, lng:2.3333}, 'Paris');
	var spainMarker = addMarker({lat:41.3833, lng:2.1833}, 'Barcelona');
	var romeMarker = addMarker({lat:41.8919, lng:12.51133}, 'Rome');
	var stuttgartMarker = addMarker({lat: 48.78232, lng:9.17702 }, 'Stuttgart');
		
	
	var infoWindowSalzburg = new google.maps.InfoWindow({
		content: addInfoWindowContent('Salzburg, Austria', 'salzburg.jpg', 
					'One of our favorite cities on the trip!')
	});
		
		var infoWindowVienna = new google.maps.InfoWindow({
			content:  addInfoWindowContent('Vienna, Austria', 'vienna.jpg', 'The first city we saw in Austria.')
		});
		
		var infoWindowPrague = new google.maps.InfoWindow({
			content: addInfoWindowContent('Prague, Czech Republic', 'prague.jpg', 'My first time in Prague.')
		});
		
		var infoWindowLondon = new google.maps.InfoWindow({
			content: addInfoWindowContent('London, England', 'london.jpg', 'We flew into London and stayed a few days.')
		});
		
		var infoWindowFlorence = new google.maps.InfoWindow({
			content: addInfoWindowContent('Florence, Italy', 'florence.jpg', 'My first time in Italy!.')
		});
		
		var infoWindowParis = new google.maps.InfoWindow({
			content: addInfoWindowContent('Paris, France', 'paris.jpg', 'Our first time in Paris and the place we got engaged!')
		});
		
		var infoWindowSpain = new google.maps.InfoWindow({
			content: addInfoWindowContent('Barcelona, Spain', 'spain.jpg', 'Our first time in Spain!')
		}); 
		
		var infoWindowRome = new google.maps.InfoWindow({
			content : addInfoWindowContent('Rome, Italy', 'rome.jpg', 'Second time in Italy. Last stop our 2014 trip.')
		})
		
		var infoWindowStuttgart = new google.maps.InfoWindow({
			content : addInfoWindowContent('Stuttgart, Germany', 'stuttgart.jpg', 'Visiting friends in Germany.')
		});
		
		salzburgMarker.setMap(map);
		viennaMarker.setMap(map);
		pragueMarker.setMap(map);
		londonMarker.setMap(map);
		florenceMarker.setMap(map);
		parisMarker.setMap(map);
		spainMarker.setMap(map);
		romeMarker.setMap(map);
		stuttgartMarker.setMap(map);


		
		addMarkerEvents('salzburg', 'click', salzburgMarker, infoWindowSalzburg, map);
		addMarkerEvents('vienna', 'click', viennaMarker, infoWindowVienna, map);
		addMarkerEvents('prague', 'click', pragueMarker, infoWindowPrague, map); 
		addMarkerEvents('london', 'click', londonMarker, infoWindowLondon, map); 
		addMarkerEvents('florence', 'click', florenceMarker, infoWindowFlorence, map);
		addMarkerEvents('paris', 'click', parisMarker, infoWindowParis,map);
		addMarkerEvents('spain', 'click', spainMarker, infoWindowSpain, map);
		addMarkerEvents('rome', 'click', romeMarker, infoWindowRome, map);
		addMarkerEvents('stuttgart', 'click', stuttgartMarker, infoWindowStuttgart, map);
					
}
*/
	
	
	

	

	
	

	






