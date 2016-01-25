# SigJar

![SigJar](https://raw.githubusercontent.com/giannivh/SigJar/master/images/signature48.png "SigJar logo") A Google Chrome extension that allows you to create fancy HTML signatures which can be used when composing mails.

## Why SigJar?

If you use a webmail app as your default emailing app, you'll notice the lack of support for decent HTML signatures. And if they allow you to configure a signature, it's usually one - with very basic HTML support. Google Inbox, for one, allows you to configure a HTML signature by copy-pasting a HTML page/selection into the editor box, but without a HTML code editor, you'll lose a lot of markup. It makes it useless if you want to have a fancier signature.

That's why SigJar was created. It's a simple Google Chrome extension which can insert HTML code into a content editor, like a mail composer window. You can create one or more signatures through the SigJar options.

## Features

* Create fancy HTML signatures withouth knowledge of HTML or CSS.
* One-time configuration of your personal information. You can edit this later on.
* Create multiple signatures.
* New Signature wizard with templates and preview.
* Custom messages are available, like a disclaimer.
* Use your signature in any webmail app, e.g. Gmail or Google Inbox.
* Advanced: edit the HTML code of the signature.

## How to install?

SigJar is not yet available in the Google Chrome Web Store, because it's still work in progress. Eventually it will be available in the Google Chrome Web Store.

For now, you'll have to download the project and install it manually:

* Visit `chrome://extensions` in your browser (or open up the Chrome menu by clicking the icon to the far right of the Omnibox:  The menu's icon is three horizontal bars. and select Extensions under the Tools menu to get to the same place).
* Ensure that the Developer mode checkbox in the top right-hand corner is checked.
* Click Load unpacked extension… to pop up a file-selection dialog.
* Navigate to the directory in which you've downloaded SigJar, and select it.

Alternatively, you can drag and drop the SigJar directory onto `chrome://extensions` in your browser to load it.

## How to create a signature?

Go to the Google Chrome extensions page `chrome://extensions`, and select "Options" of the SigJar extension. Alternatively, right click anywhere in a page, hover over "SigJar" and select "Options" from the submenu.

Follow the on-screen instructions to create your fancy HTML signature. There are a few templates to get you started.

<img src="https://raw.githubusercontent.com/giannivh/SigJar/master/images/sigjar_01_options.png" width=400 height=auto />
<img src="https://raw.githubusercontent.com/giannivh/SigJar/master/images/sigjar_02_templates.png" width=400 height=auto />

## How to insert the signature?

Right click inside the content editor where you want your signature to appear. Hover over "SigJar" and select one of your signatures from the submenu. 

<img src="https://raw.githubusercontent.com/giannivh/SigJar/master/images/sigjar_03_menu.png" width=400 height=auto />