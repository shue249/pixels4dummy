var pixelLayer = {};

var EVENTS = {
  'ViewContent': {
    'name': 'ViewContent',
    'parameters': [
    	{id: 'content_type', availability: 'required', type: 'select', values: ['product', 'product_group'], datatype: 'string'},
    	{id: 'content_ids', availability: 'required', type: 'link', datatype: 'string'},
    	{id: 'value', availability: 'recommended', type: 'link', datatype: 'number'},
    	{id: 'currency', availability: 'recommended', type: 'select', values: ['USD', 'SGD'], datatype: 'string'},
    	{id: 'content_name', availability: '', type: 'link', datatype: 'string'}
    ]
  },
  'AddToCart': {
    'name': 'AddToCart',
    'parameters': [
    	{id: 'content_type', availability: 'required', type: 'select', values: ['product', 'product_group'], datatype: 'string'},
    	{id: 'content_ids', availability: 'required', type: 'link', datatype: 'string'},
    	{id: 'value', availability: 'recommended', type: 'link', datatype: 'number'},
    	{id: 'currency', availability: 'recommended', type: 'select', values: ['USD', 'SGD'], datatype: 'string'},
    	{id: 'content_name', availability: '', type: 'link', datatype: 'string'}
    ]
  },
  'Purchase': {
    'name': 'Purchase',
    'parameters': [
    	{id: 'content_type', availability: 'required', type: 'select', values: ['product', 'product_group'], datatype: 'string'},
    	{id: 'content_ids', availability: 'required', type: 'link', datatype: 'string'},
    	{id: 'value', availability: 'recommended', type: 'link', datatype: 'number'},
    	{id: 'currency', availability: 'recommended', type: 'select', values: ['USD', 'SGD'], datatype: 'string'},
    	{id: 'content_name', availability: '', type: 'link', datatype: 'string'},
    	{id: 'num_items', availability: '', type: 'link', datatype: 'number'}
    ]
  }
};

// var EVENTS = {
//   'ViewContent': {
//     'name': 'ViewContent',
//     'parameters': ['content_type', 'content_ids', 'value', 'currency', 'content_name'],
//     'required': []
//   },
//   'AddToCart': {
//     'name': 'AddToCart',
//     'parameters': ['content_type', 'content_ids', 'value', 'currency', 'content_name'],
//     'required': []
//   },
//   'Purchase': {
//     'name': 'Purchase',
//     'parameters': ['content_type', 'content_ids', 'value', 'currency', 'content_name', 'num_items'],
//     'required': ['value', 'currency']
//   },  
//   'Search': {
//     'name': 'Search',
//     'parameters': ['value', 'currency', 'content_category', 'content_ids', 'search_string'],
//     'required': []
//   },
//   'AddToWishlist': {
//     'name': 'AddToWishlist',
//     'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids'],
//     'required': []
//   },
//   'InitiateCheckout': {
//     'name': 'InitiateCheckout',
//     'parameters': ['value', 'currency', 'content_name', 'content_category', 'content_ids', 'num_items'],
//     'required': []
//   },
//   'AddPaymentInfo': {
//     'name': 'AddPaymentInfo',
//     'parameters': ['value', 'currency', 'content_category', 'content_ids'],
//     'required': []
//   },
//   'Lead': {
//     'name': 'Lead',
//     'parameters': ['value', 'currency', 'content_name', 'content_category'],
//     'required': []
//   },
//   'CompleteRegistration': {
//     'name': 'CompleteRegistration',
//     'parameters': ['value', 'currency', 'content_name', 'status'],
//     'required': []
//   }
// };

function log(obj) {
  var str = JSON.stringify( obj );
  chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
}

function getAndStoreSelectedID(link) {
  chrome.devtools.inspectedWindow.eval('$0.id',
	  function(res, err) {
	    if (res == null) {
	      alert('no id found');
	    } else {
	      selectedID = res;
	      pixelLayer[link.id] = selectedID;
	      link.text = link.id + " (ID of selected element = " + selectedID + ")";
	      log(pixelLayer);
	    }
	  });
}

function getCode() {
  	log('start getcode');  

  	var eventName = document.getElementById('event-selector').value;  
  	var mode = document.getElementById('mode-selector').value;
	var pixelCode = "";

	pixelLayer = {
		content_type: 'product',
		content_ids: 'product_id',
		value: 'price',
		currency: 'USD',
		content_name: 'name'
	};
	Object.values(EVENTS[eventName]['parameters']).forEach(function (param) {
		if (pixelLayer[param.id]) {
			if (param.type === 'link') {
				if (param['datatype'] === 'string') {
					pixelCode += generateCodeForString(param);
				}
				if (param['datatype'] === 'number') {
					pixelCode += generateCodeForNumber(param);
				}
			}
			if (param.type === 'select') {
				pixelCode = pixelCode + "var " + param['id'] + " = ";
				if (param['datatype'] === 'string') {
					pixelCode = pixelCode + "'" + pixelLayer[param['id']] + "';"
				}
				if (param['datatype'] === 'number') {
					pixelCode = pixelCode + pixelLayer[param['id']] + ";";
				}				
			}	
		}
	});

	pixelCode = pixelCode + "fbq('track','"+eventName+"',{source:'pixels4dummy'";
	Object.values(EVENTS[eventName]['parameters']).forEach(function (param) {
		pixelCode = pixelCode + "," + param.id + ":" + param.id;
	});
	pixelCode += "});"
	
	var generatedCode = getCodeByMode(pixelCode, mode);
	console.log(generatedCode);
  	var codeSnippet = document.getElementById('code-snippet');
  	codeSnippet.innerHTML = "";
  	codeSnippet.append(generatedCode);
  	show('code-snippet-block');

  	log('end getcode');
}

function generateCodeForObject(element) {	
	return "obj = document.getElementById('" + element + "');";
}

function generateCodeForString(param) {
	code = generateCodeForObject(pixelLayer[param.id]);
	code = code + "var " + param.id + " = '';" +
		"if (obj.value) {" +
		param.id + " = obj.value;" +
		"} else if (obj.innerHTML) {" +
		param.id + " = obj.innerHTML;" +
		"}";
	return code;
}

function generateCodeForNumber(param) {
	code = generateCodeForObject(pixelLayer[param.id]);
	code = code + "var " + param.id + " = 0;" +
		"if (obj.value) {" +
		param.id + " = obj.value.match(/-?\\d+\\.?\\d*/);" +
		"} else if (obj.innerHTML) {" +
		"results = obj.innerHTML.match(/-?\\d+\\.?\\d*/);" +
		"if (results) {" +
		param.id + " = results[0];" +
		"}" +
		"}";
	return code;
}

function getCodeByMode(pixelCode, mode, buttonElement = 0) {
	var generatedCode = null;
	log(mode);
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

function setSelectedValue(select) {
	pixelLayer[select.id] = select.value;
}

function onEventSelect() {
  var menu = document.getElementById("event-selector");
  var paramsGroupDiv = document.getElementById("pixel-params-group");
  var paramsDiv = document.getElementById("pixel-params");
  var selectedEvent = menu.options[menu.selectedIndex].value;
  var list = document.createElement('ul');

  Object.values(EVENTS[selectedEvent]['parameters']).forEach(function (param) {
    var item = document.createElement('li');

    if (param['type'] === 'link') {
	    var link = document.createElement('a');
		link.setAttribute('href', '#');
		link.setAttribute('id', param['id']);
		link.addEventListener('click', () => getAndStoreSelectedID(link));
		linkText = param['id'];		
	    if (param['availability'] === 'required') {
	      linkText = "** " + linkText;
	    }
	    if (param['availability'] === 'recommended') {
	      linkText = "* " + linkText;
	    }
	    link.appendChild(document.createTextNode(linkText));	    
		item.appendChild(link);
	}

	if (param['type'] === 'select') {
	    var select = document.createElement('select');
		select.setAttribute('id', param['id']);
		select.addEventListener('change', () => setSelectedValue(select));
		for (i = 0; i < param['values'].length; i++) {
			var option = document.createElement('option');
			option.text = param['values'][i];
			option.label = param['values'][i];
			select.appendChild(option);
		}
		item.appendChild(select);
	}
    list.appendChild(item);
  });
  paramsDiv.innerHTML = '';
  paramsDiv.appendChild(list);
  paramsGroupDiv.style.display = 'block';
  pixelLayer = {};
}

function init() {
  document.getElementById('getcode').addEventListener('click', function() {getCode();});

  addEventsToMenu();
  var menu = document.getElementById("event-selector");
  menu.addEventListener('change', onEventSelect, false);
}    
document.addEventListener('DOMContentLoaded', init);