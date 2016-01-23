chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    if (request.action == "insertSig") {

		//Get selection or current caret position
		var range = window.getSelection().getRangeAt( 0 );

		//Create the signature element
		var sigElement = document.createElement( "div" );
		sigElement.innerHTML = request.signature.code;

		//Delete selection, if any
		range.deleteContents();

		//Insert signature
		range.insertNode( sigElement );
    }

});