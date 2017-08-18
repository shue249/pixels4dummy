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
    console.log(event);
    option.text = event['name'];
    option.value = key;
    menu.appendChild(option);
  });
}    

function init() {
  addEventsToMenu();
}    
document.addEventListener('DOMContentLoaded', init);