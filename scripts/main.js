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
        { signatures: [ {name: 'Personal', code: '<p>Kind regards,<br/>John Doe</p>'}, {name: 'Work', code: '<p>Kind regards,<br/>John Doe</p>'} ] },
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

//
// Create context menu
//

createContextMenu();

chrome.storage.onChanged.addListener(
    function(changes, namespace) {

        createContextMenu();
    }
);