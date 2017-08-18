// eventName - name of the pixel event, string, possible values are ViewContent, AddToCart, Purchase
// contentIdsElement - id or name of the element containing the content_ids, json, eg {id: 'product_id'} or {name: 'product_id'} 
// valueElement - id or name of the element containing the value, json, eg {id: 'value'} or {name: 'value'} 
// currencyElement - id or name of the element containing the currency, json, eg {id: 'currency'} or {name: 'currency'} 
// mode - pageload or buttonclick
// buttonElement - id or name of the element to perform the click
function generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode, buttonElement = 0) {
	var content_ids = getValueFromElement(contentIdsElement);
	var value = getValueFromText(getValueFromElement(valueElement));
	var currency = getCurrencyFromText(getValueFromElement(contentIdsElement));

	var pixelCode = "fbq('track','"+eventName+"',{" + 
		"content_type: '"+contentType+"'," +
		"content_ids: '"+content_ids+"'," + 
		"value: "+value+"," + 
		"currency: '"+currency+"'" + 
		"});"

	var generatedCode = getCodeByMode(pixelCode, mode, buttonElement);
	return generatedCode;
}

function getObject(element) {
	var foundObject = null;
	if (element.id) {
		foundObject = document.getElementById(element);
	} 

	if (!foundObject && element.name) {
		var objects = document.getElementsByName(element);
		if (objects && objects.length > 0) {
			foundObject = objects[0];
		}
	}
	return foundObject;	
}

function getValueFromElement(element) {
	var foundObject = getObject(element);

	if (foundObject) {
		if (foundObject.value) {
			return foundObject.value;
		}
		if (foundObject.innerHTML) {
			return foundObject.innerHTML;
		}
	}
		
	return null;
}

function getValueFromText(input) {
	return parseFloat(input);
}

function getCurrencyFromText(input) {
	return input;
}

function getCodeByMode(pixelCode, mode, buttonElement = 0) {
	var generatedCode = null;
	if (mode === 'buttonclick' && buttonElement) {
		generatedCode = "<script>" +
			pixelCode +
			"</script>";
	} else {
		if (buttonElement.id || buttonElement.name) {
			generatedCode = "<script>";
			if (buttonElement.id) {
				generatedCode += "var clickButton = document.getElementById(buttonElement.name);";
			} else {
				generatedCode += "var clickButton = document.getElementsByName(buttonElement.name)[0];";
			}
			generatedCode += "clickButton.addEventListener('click', function() {" +
				pixelCode +
				"}, false);" +
				"</script>";
		}
	}

	return generatedCode;
}