var pixelLayer = {};

var EVENTS = {
  'ViewContent': {
    'name': 'ViewContent',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids'],
    'required': []
  },
  'Search': {
    'name': 'Search',
    'parameters': ['value', 'currency', 'content_category', 'content_ids', 'search_string'],
    'required': []
  },
  'AddToCart': {
    'name': 'AddToCart',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids'],
    'required': []
  },
  'AddToWishlist': {
    'name': 'AddToWishlist',
    'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids'],
    'required': []
  },
  'InitiateCheckout': {
    'name': 'InitiateCheckout',
    'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids', 'num_items'],
    'required': []
  },
  'AddPaymentInfo': {
    'name': 'AddPaymentInfo',
    'parameters': ['value', 'currency', 'content_category', 'content_ids'],
    'required': []
  },
  'Purchase': {
    'name': 'Purchase',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids', 'num_items'],
    'required': ['value', 'currency']
  },
  'Lead': {
    'name': 'Lead',
    'parameters': ['value', 'currency', 'content_name', 'content_category'],
    'required': []
  },
  'CompleteRegistration': {
    'name': 'CompleteRegistration',
    'parameters': ['value', 'currency', 'content_name', 'status'],
    'required': []
  }
};

function addEventsToMenu() {
  var menu = document.getElementById("event-selector");

  Object.keys(EVENTS).forEach(function (key) {
    var event = EVENTS[key];
    var option = document.createElement("option");
    option.text = event['name'];
    option.value = key;
    menu.appendChild(option);
  });
}

function attributeIDtoLink(link) {
	var id = getSelectedID();
	var text = link.innerHTML;
	pixelLayer.push({text: id});
	link.innerHTML.append(': ' + id);
}

function onEventSelect() {
  var menu = document.getElementById("event-selector");
  var paramsGroupDiv = document.getElementById("pixel-params-group");
  var paramsDiv = document.getElementById("pixel-params");
  var selectedEvent = menu.options[menu.selectedIndex].value;
  var list = document.createElement('ul');

  Object.values(EVENTS[selectedEvent]['parameters']).forEach(function (param) {
    var item = document.createElement('li');
    var link = document.createElement('a');
		link.setAttribute('href', '#');
		link.setAttribute('id', selectedEvent.toString() + '_' + param);
		link.addEventListener('click', () => attributeIDtoLink(this));
    if (EVENTS[selectedEvent]['required'].includes(param)) {
      link.appendChild(document.createTextNode(param + " (required)"));
    } else {
      link.appendChild(document.createTextNode(param));
    }
		item.appendChild(link);
    list.appendChild(item);
  });
  paramsDiv.innerHTML = '';
  paramsDiv.appendChild(list);
  paramsGroupDiv.style.display = 'block';
}

function init() {
  addEventsToMenu();

  var menu = document.getElementById("event-selector");
  menu.addEventListener('change', onEventSelect, false);
}    
document.addEventListener('DOMContentLoaded', init);
