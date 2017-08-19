pixelLayer = {
	content_ids: 'product_id',
	value: 'price',	
	currency: 'currency'
};

function log(obj) {
  var str = JSON.stringify( obj );
  chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
  // console.log(obj);
}

function getCode() {
  log('start getcode');
  var eventName = document.getElementById('event-selector').value;
  var contentType = 'product';
  var mode = 'pageload';
  generatedCode = generateCode(eventName, contentType, pixelLayer.content_ids, pixelLayer.value, pixelLayer.currency, mode);
  log(generatedCode);
  $('#codeSnippet').innerHTML = generatedCode;
  log('end getcode');
}

function init() {
  document.getElementById('getcode').addEventListener('click', function() {getCode();});
  log('a');

}
document.addEventListener('DOMContentLoaded', init);

// eventName - name of the pixel event, string, possible values are ViewContent, AddToCart, Purchase
// contentIdsElement - id or name of the element containing the content_ids, json, eg {id: 'product_id'} or {name: 'product_id'} 
// valueElement - id or name of the element containing the value, json, eg {id: 'value'} or {name: 'value'} 
// currencyElement - id or name of the element containing the currency, json, eg {id: 'currency'} or {name: 'currency'} 
// mode - pageload or buttonclick
// buttonElement - id or name of the element to perform the click
function generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode, buttonElement = 0) {
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
	if (element.id) {
		return "obj = document.getElementById('" + element.id + "');";
	} else {
		return "obj = document.getElementsByName('" + element.name + "')[0];";
	}
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