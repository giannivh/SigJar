chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    if (request.action == "insertSig") {

        //Get selection or current caret position
        var range = window.getSelection().getRangeAt( 0 );

        if (window.location.hostname.indexOf( 'mail.live' ) > -1) {

            //If outlook.com (mail.live.com), then get the iframe first.
            var frame = document.getElementById( 'ComposeRteEditor_surface' );
            var frameWindow = frame && frame.contentWindow;
            var frameDocument = frameWindow && frameWindow.document;
            var selection = frameDocument.getSelection() || frameWindow.getSelection();
            range = selection.getRangeAt( 0 );
        }

		//Create the signature element
		var sigElement = document.createElement( "div" );
		sigElement.innerHTML = request.signature.code;

		//Delete selection, if any
		range.deleteContents();

		//Insert signature
		range.insertNode( sigElement );
    }

});