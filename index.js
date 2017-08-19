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

function log(obj) {
  var str = JSON.stringify( obj );
  chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
}

function getSelectedID() {
  var selectedID;
  chrome.devtools.inspectedWindow.eval('$0.id',
  function(res, err) {
    log(res);
    if (res == null) {
      alert('no id');
    } else {
      selectedID = res;
    }
  });
  log(selectedID);
  return selectedID;
}

function getCode() {
  log('start getcode');  

  var eventName = document.getElementById('event-selector').value;
  var contentType = 'product';
  var content_ids = 'product_id';
  var value = 'price';
  var mode = 'pageload';
  var codeSnippet = document.getElementById('code-snippet');
  var generatedCode = generateCode(eventName, contentType, content_ids, value, mode);
  log(generatedCode);
  codeSnippet.append(generatedCode);
  show('code-snippet-block');
  log('end getcode');
}

// eventName - name of the pixel event, string, possible values are ViewContent, AddToCart, Purchase
// contentIdsElement - id or name of the element containing the content_ids, json, eg {id: 'product_id'} or {name: 'product_id'}
// valueElement - id or name of the element containing the value, json, eg {id: 'value'} or {name: 'value'}
// currencyElement - id or name of the element containing the currency, json, eg {id: 'currency'} or {name: 'currency'}
// mode - pageload or buttonclick
// buttonElement - id or name of the element to perform the click
function generateCode(eventName, contentType, contentIdsElement, valueElement, mode, buttonElement = 0) {
	var contentIdsCode = generateCodeForContentIds(contentIdsElement);
	var valueCode = generateCodeForValue(valueElement);
	var currencyCode = "var currency = 'USD';";
	var pixelCode = contentIdsCode +
		valueCode +
		currencyCode +
		"fbq('track','"+eventName+"',{" +
			"content_type: '"+contentType+"'," +
			"content_ids: content_ids," + 
			"value: amount," + 
			"currency: currency" + 
		"});"

	var generatedCode = getCodeByMode(pixelCode, mode, buttonElement);
	return generatedCode;
}

function generateCodeForObject(element) {	
	// if (element.id) {
		return "obj = document.getElementById('" + element + "');";
	// } else {
	// 	return "obj = document.getElementsByName('" + element.name + "')[0];";
	// }
}

function generateCodeForContentIds(element) {
	code = generateCodeForObject(element);
	code = code + "var content_ids = '';" +
		"if (obj.value) {" +
		"content_ids = obj.value;" +
		"} else if (obj.innerHTML) {" +
		"content_ids = obj.innerHTML;" +
		"}";
	return code;
}

function generateCodeForValue(element) {
	code = generateCodeForObject(element);
	code = code + "var amount = 0;" +
		"if (obj.value) {" +
		"amount = obj.value.match(/-?\\d+\\.?\\d*/);" +
		"} else if (obj.innerHTML) {" +
		"results = obj.innerHTML.match(/-?\\d+\\.?\\d*/);" +
		"if (results) {" +
		"amount = results[0];" +
		"}" +
		"}";
	return code;
}

function getCodeByMode(pixelCode, mode, buttonElement = 0) {
	var generatedCode = null;
	if (mode === 'buttonclick' && buttonElement) {
		generatedCode = "<script>" +
			"document.addEventListener('DOMContentLoaded', function() {";

		if (buttonElement.id) {
			generatedCode += "var clickButton = document.getElementById(buttonElement.name);";
		} else {
			generatedCode += "var clickButton = document.getElementsByName(buttonElement.name)[0];";
		}
		generatedCode = generatedCode + "clickButton.addEventListener('click', function() {" +
			pixelCode +
			"}, false);" +
			"});" +
			"</script>";
	} else {
		generatedCode = "<script>" +
			"document.addEventListener('DOMContentLoaded', function() {" +
			pixelCode +
			"});" +
			"</script>";
	}

	return generatedCode;
}

function show(id) {
  var element = document.getElementById(id);
  if (element.style.display === 'none') {
    element.style.display = 'block';
  }
}



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
  document.getElementById('getcode').addEventListener('click', function() {getCode();});
  getSelectedID();

  addEventsToMenu();
  var menu = document.getElementById("event-selector");
  menu.addEventListener('change', onEventSelect, false);
}    
document.addEventListener('DOMContentLoaded', init);