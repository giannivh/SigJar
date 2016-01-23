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
    // Initialize default templates
    //

    chrome.storage.sync.get(
        { templates: [] },
        function( items ) {

            if (items.templates.length == 0) {

                var defaultTemplates =
                    [
                        {
                            id: 0,
                            name: 'Basic',
                            code: '<table border="0" cellspacing="0" cellpadding="0" width="470" style="width: 470px;"><tbody><tr valign="top"><td style="padding-left: 10px; width: 10px; padding-right: 10px;"><img src="https://giannivanhoecke.com/sig/nopicture.png" width="65" height="71" alt="" style="border-radius: 4px; moz-border-radius: 4px; khtml-border-radius: 4px; o-border-radius: 4px; webkit-border-radius: 4px; ms-border-radius: 4px; width: 65px; height: 71px; max-width: 120px;" /></td><td style="border-right: 1px solid #64B634;"><p>&nbsp;</p></td><td style="text-align: initial; font: 14px Arial; color: #646464; padding: 0 10px;"><div><b>John Doe</b><br /><span>Software Engineer</span>, <span>MyCompany Inc.</span></div><div style="color: #8d8d8d; font-size: 13px; padding: 5px 0;"><span style="display: inline-block;"><a href="tel:+32012345678" style="color: #8d8d8d; text-decoration: none;">+32 012 34 56 78</a></span><span style="color: #64B634; display: inline-block;">&nbsp;|&nbsp;</span><span style="white-space: nowrap; display: inline-block;"><a href="https://github.com/giannivh/SigJar" target="_blank" style="color: #8d8d8d; text-decoration: none;">website</a></span></div></td></tr></tbody></table>'
                        },
                        {
                            id: 1,
                            name: 'Professional',
                            code: '<table border="0" cellspacing="0" cellpadding="0" width="470" style="width: 470px;"><tbody><tr><td colspan="3" style="font: 13px Helvetica,serif; color: #333333; border-bottom: 1px solid #0072b1;"><b style="color: #0072b1; font-size:13px;">John Doe</b> <span style="font-size: 13px;">Software Engineer, MyCompany Inc.</span></td></tr><tr><td valign="top" style="text-align: initial; font-family: Tahoma,serif; white-space: nowrap; color: #777777; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/mobile.png">&nbsp;<a href="tel:+32012345678" style="color: #777777; text-decoration: none;font-size:11px;">+32 012 34 56 78</a></td><td valign="top" style="text-align: initial; font-family: Tahoma,serif; white-space: nowrap; color: #777777; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/website.png">&nbsp;<a href="https://github.com/giannivh/SigJar" target="_blank" style="color: #777777; text-decoration: none;font-size:11px;">https://github.com/giannivh/SigJar</a></td><td valign="top" style="text-align: end; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/nopicture.png" width="65" height="71" style="border-radius:4px;moz-border-radius:4px;khtml-border-radius:4px;o-border-radius:4px;webkit-border-radius:4px;ms-border-radius: 4px;"></td></tr><tr><td colspan="3" style="padding-top: 5px;"><p style="border-top:1px solid #0072b1; font-size:1px;">&nbsp;</p></td></tr></tbody></table>'
                        }
                    ];

                chrome.storage.sync.set(
                    { templates: defaultTemplates },
                    function() {

                        console.log( 'Default templates created!' );
                    }
                );
            }
        }
    );

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
                            code: '<table border="0" cellspacing="0" cellpadding="0" width="470" style="width: 470px;"><tbody><tr><td colspan="3" style="font: 13px Helvetica,serif; color: #333333; border-bottom: 1px solid #0072b1;"><b style="color: #0072b1; font-size:13px;">John Doe</b> <span style="font-size: 13px;">Software Engineer, MyCompany Inc.</span></td></tr><tr><td valign="top" style="text-align: initial; font-family: Tahoma,serif; white-space: nowrap; color: #777777; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/mobile.png">&nbsp;<a href="tel:+32012345678" style="color: #777777; text-decoration: none;font-size:11px;">+32 012 34 56 78</a></td><td valign="top" style="text-align: initial; font-family: Tahoma,serif; white-space: nowrap; color: #777777; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/website.png">&nbsp;<a href="https://github.com/giannivh/SigJar" target="_blank" style="color: #777777; text-decoration: none;font-size:11px;">https://github.com/giannivh/SigJar</a></td><td valign="top" style="text-align: end; padding-top: 5px;"><img src="https://giannivanhoecke.com/sig/nopicture.png" width="65" height="71" style="border-radius:4px;moz-border-radius:4px;khtml-border-radius:4px;o-border-radius:4px;webkit-border-radius:4px;ms-border-radius: 4px;"></td></tr><tr><td colspan="3" style="padding-top: 5px;"><p style="border-top:1px solid #0072b1; font-size:1px;">&nbsp;</p></td></tr></tbody></table>'
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