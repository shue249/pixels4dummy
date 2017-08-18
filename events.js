var EVENTS = {
  'viewcontent': {
    'name': 'ViewContent',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids'],
    'required': []
  },
  'search': {
    'name': 'Search',
    'parameters': ['value', 'currency', 'content_category', 'content_ids', 'search_string'],
    'required': []
  },
  'addtocart': {
    'name': 'AddToCart',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids'],
    'required': []
  },
  'addtowishlist': {
    'name': 'AddToWishlist',
    'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids'],
    'required': []
  },
  'initiatecheckout': {
    'name': 'InitiateCheckout',
    'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids', 'num_items'],
    'required': []
  },
  'addpaymentinfo': {
    'name': 'AddPaymentInfo',
    'parameters': ['value', 'currency', 'content_category', 'content_ids'],
    'required': []
  },
  'purchase': {
    'name': 'Purchase',
    'parameters': ['value', 'currency', 'content_name', 'content_type', 'content_ids', 'num_items'],
    'required': ['value', 'currency']
  },
  'lead': {
    'name': 'Lead',
    'parameters': ['value', 'currency', 'content_name', 'content_category'],
    'required': []
  },
  'completeregistration': {
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

function onEventSelect() {
  var menu = document.getElementById("event-selector");
  var paramsGroupDiv = document.getElementById("pixel-params-group");
  var paramsDiv = document.getElementById("pixel-params");
  var selectedEvent = menu.options[menu.selectedIndex].value;
  var list = document.createElement('ul');

  Object.values(EVENTS[selectedEvent]['parameters']).forEach(function (param) {
    var item = document.createElement('li');
    if (EVENTS[selectedEvent]['required'].includes(param)) {
      item.appendChild(document.createTextNode(param + " (required)"));
    } else {
      item.appendChild(document.createTextNode(param));
    }
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