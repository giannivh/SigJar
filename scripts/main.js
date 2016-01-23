//
// Functions
//

openOptions = function(info, tab) {

  chrome.runtime.openOptionsPage();
};

createSignatureMenuItem = function(parentMenu, signature) {

    chrome.contextMenus.create(
        {
            title: "Insert \"" + signature.name + "\"",
            parentId: parentMenu,
            contexts: ["editable"],
            onclick: function (info, tab) {

                chrome.tabs.query(
                    { active: true, currentWindow: true },
                    function (tabs) {

                        chrome.tabs.sendMessage( tabs[0].id, {action: "insertSig", signature: signature} );
                    }
                );
            }
        }
    );
};

createContextMenu = function() {

    //Remove all menus
    chrome.contextMenus.removeAll();

    var parentMenu = chrome.contextMenus.create( { title: "SigJar", contexts: ["all"] } );

    //For each signature: add
    chrome.storage.sync.get(
        { signatures: [] },
        function( items ) {

            var signatures = items.signatures;

            for(var i = 0; i < signatures.length; i++) {

                var sig = signatures[i];

                createSignatureMenuItem( parentMenu, sig );
            }

            //Now add separator and options
            chrome.contextMenus.create( { type: "separator", parentId: parentMenu, contexts: ["editable"] } );
            chrome.contextMenus.create( { title: "Options", parentId: parentMenu, contexts: ["all"], onclick: openOptions } );
        }
    );
};

initializeOptions = function() {

    //
    // Initialize default signatures, if needed
    //

    chrome.storage.sync.get(
        { signatures: [] },
        function( items ) {

            if (items.signatures.length == 0) {

                var defaultSignatures =
                    [
                        {
                            name: 'Personal',
                            code: '<p>Kind regards,<br/>John Doe</p>'
                        },
                        {
                            name: 'Work',
                            code: '<p>Kind regards,<br/>John Doe</p>'
                        }
                    ];

                chrome.storage.sync.set(
                    { signatures: defaultSignatures },
                    function() {

                        console.log( 'Default signatures created!' );
                    }
                );
            }
        }
    );
};

//
// Initiate app
//

initializeOptions();
createContextMenu();

chrome.storage.onChanged.addListener(
    function(changes, namespace) {

        createContextMenu();
    }
);