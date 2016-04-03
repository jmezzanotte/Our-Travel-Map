// Script 8.1 - utilities.js
// This script defines an object that has some utilitarian functions.

var U = {

    // For getting the document element by ID:
    $: function(id) {
        'use strict';
        if (typeof id == 'string') {
            return document.getElementById(id);
        }
    }, // End of $() function.

    // Function for setting the text of an element:
    setText: function(id, message) {
        'use strict';
        if ( (typeof id == 'string')
        && (typeof message == 'string') ) {
    
            // Get a reference to the element:
            var output = this.$(id);
            if (!output) return false;
        
            // Set the text
            if (output.textContent !== undefined) {
                output.textContent = message;
            } else {
                output.innerText = message;
            }
            return true;
        } // End of main IF.
    }, // End of setText() function.
    
    // Function for creating event listeners:
    addEvent: function(obj, type, fn) {
        'use strict';
        
        if (obj && obj.addEventListener) { // W3C
            obj.addEventListener(type, fn, false);
        } else if (obj && obj.attachEvent) { // Older IE
            obj.attachEvent('on' + type, fn);
        }
    }, // End of addEvent() function.
    
    // Function for removing event listeners:
    removeEvent: function(obj, type, fn) {
        'use strict';
        
        if (obj && obj.removeEventListener) { // W3C
            obj.removeEventListener(type, fn, false);
        } else if (obj && obj.detachEvent) { // Older IE
            obj.detachEvent('on' + type, fn);
        }
    }, // End of removeEvent() function.

	enableTooltips: function(id) {
	    'use strict';
	
		// Get a reference to the element:
		var elem = this.$(id);

		// Add four event handlers to the element:
		this.addEvent(elem, 'focus', this.showTooltip);
	    this.addEvent(elem, 'mouseover', this.showTooltip);
	    this.addEvent(elem, 'blur', this.hideTooltip);
	    this.addEvent(elem, 'mouseout', this.hideTooltip);
	
	}, // End of enableTooltips() function.

	showTooltip: function(e) {
	    'use strict';
	
		// Get the event object:
		if (typeof e == 'undefined') var e = window.event;

		// Get the event target:
		var target = e.target || e.srcElement;
		target.previousSibling.lastChild.style.visibility = 'visible';

	}, // End of showTooltip() function.

	hideTooltip: function(e) {
	    'use strict';
	
		// Get the event object:
		if (typeof e == 'undefined') var e = window.event;

		// Get the event target:
		var target = e.target || e.srcElement;
		target.previousSibling.lastChild.style.visibility = 'hidden';

	}, // End of hideTooltip() function.
	draggable : { // object to enable dragging of div
			// When creating a draggable element you have to make sure that you set that elements top and right 
			// position values within the css or else you get odd things that start to happen. 
			element : null,
			mouseStartY : 0, 
			mouseStartX : 0,
			offsetX : 0,
			offsetY : 0,
			scrollX: 0,
			scrollY: 0, 
			startZIndex : 0, 
			// drag functionality object 
			startDrag : function(e){
				
				'use strict'; 
				
				var elem = U.draggable.element;
			
				if(typeof e == 'undefined') e = window.event;
				var currentScrollY = document.documentElement.scrollTop || document.body.scrollTop; 
				var currentScrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				elem.style.left = ((U.draggable.offsetX + currentScrollX) - U.draggable.scrollX  +  e.clientX - U.draggable.mouseStartX) + 'px'; 
				elem.style.top =  ((U.draggable.offsetY + currentScrollY) - U.draggable.scrollY  +  e.clientY - U.draggable.mouseStartY) + 'px';
			
			}, 
			stopDrag : function(){
				
				//var body = document.getElementsByTagName('body')[0];
				
				U.removeEvent(document.documentElement, 'mousemove', U.draggable.startDrag);
				U.draggable.element.style.zIndex = U.draggable.startZIndex; // return z-idex to original value
				U.draggable.element = null;
				
			},
			enableDrag : function(e){
				
				if(e == 'undefined') e = window.event;
					
				var target = e.target || e.srcElement;
				
				if(e.button == 0 && target.className == "drag") {
						
					U.draggable.element = target;
					U.addEvent(document.documentElement, 'mousemove', U.draggable.startDrag);
					
					// crossbrowser way of getting coordinates
					// we also need to account for the scroll bar positions 
					if(e.clientX || e.clientY){
						console.log("We are useing e.clientX and e.clientY");
						// scroll bar position is different cross browser 
						U.draggable.mouseStartY = e.clientY ; 
						U.draggable.mouseStartX = e.clientX ;
					}else if(e.pageX || e.pageY){
						console.log("We are using e.pageX and e.pageY")
						U.draggable.mouseStartY = e.pageY;
						U.draggable.mouseStartX = e.pageX;
							
					}
					
					
					U.draggable.offsetX = target.offsetLeft ; 
					U.draggable.offsetY = target.offsetTop ;
					U.draggable.startZIndex = target.style.zIndex;
					U.draggable.scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
					U.draggable.scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
					target.style.position = 'absolute'; 
					target.style.cursor = 'move';
					target.style.zIndex = 1000; //bring drag element to the front
					// this allows the drag element to follow the scrolling of the page
					// without it things get crazy 
					//target.style.position= 'fixed'; 
					U.addEvent(U.draggable.element, 'mouseup', U.draggable.stopDrag);
						
				}
			} // end enableDrag 
	}, // end draggable object
	accordian : function(e){
		
		'use strict';
			
		var target = e.target || e.srcElement; 
			
		if(target.className=='accordian-init'){
				
			var accordianTarget = target.nextElementSibling;
			var inactiveIndex = accordianTarget.className.indexOf('inactive'); 
			var activeIndex = accordianTarget.className.indexOf(' active');

			if((inactiveIndex == -1) && (activeIndex == - 1)){
				accordianTarget.className += ' inactive'; 
			}else if((activeIndex == -1) && (inactiveIndex > -1)){
				accordianTarget.className += ' active';
			}else if((activeIndex > -1) && (inactiveIndex > -1 )){
				accordianTarget.className = accordianTarget.className.replace(' active', '');
			}	
		}
	}, // end accordian
	getActiveElement : {
		previousElem : null, 
		getClicked : function(elem){
	
			'use strict';
			
			
			if(U.getActiveElement.previousElem != null){
				var removeClick = U.getActiveElement.previousElem; 
				removeClick.className = 'fakelink';
			}
				
			if(elem.className.indexOf('clicked') == -1){
				elem.className += ' clicked'; 	
			}else if(elem.className.indexOf('clicked') > -1){
				elem.className.replace(' clicked', '');
			}
				
			U.getActiveElement.previousElem = elem;
		}
			
	}
}; // End of U declaration.