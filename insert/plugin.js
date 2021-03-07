// (function () {
// 	CKEDITOR.plugins.add('FIB', {
// 		icons: 'fib',
// 		init: function (editor) {
// 			editor.addCommand('Insertfillintheblanks', {
// 				exec: function (editor) {
// 					// var now = new Date();
// 					// editor.insertHtml('The current date and time is: <em>' + now.toString() + '</em>');
// 					editor.insertElement(CKEDITOR.dom.element.createFromHtml(`<span class= "fiblank" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;"> blank</span> </span>`));
// 				},
// 			});
// 			editor.ui.addButton('FIB', {
// 				label: 'Insert Fill in the Blanks',
// 				command: 'Insertfillintheblanks',
// 				toolbar: 'insert',
// 			});
// 		},
// 	});
// })()

/**
 * @license Copyright © 2013 Anish M Prasad<anishmprasad@gmail.com>
 * This is open source, can modify it as you wish.
 *
 * Anish M Prasad
 * ansihmprasad.com
 *
 */

/**
 * List of dicts which define strings to choose from to insert into the editor.
 *
 * Each insertable string dict is defined by three possible keys:
 *    'value': The value to insert.
 *    'name': The name for the string to use in the dropdown.
 *    'label': The voice label (also used as the tooltip title) for the string.
 *
 * Only the value to insert is required to define an insertable string, the
 * value will be used as the name (and the name as the label) if other keys are
 * not provided.
 *
 * If the value key is *not* defined and the name key is, then a group header
 * with the given name will be provided in the dropdown box.  This heading is
 * not clickable and does not insert, it is for organizational purposes only.
 */
CKEDITOR.config.strinsert_strings = [
  // {'name': 'Name', 'value': '*|VALUE|*'},
  { name: "Types" },
  { name: "Blanks", value: "BLANKS", label: "Insert fill in the blanks" },
  { name: "Dropdown", value: "DROPDOWN", label: "Insert dropdown" },
];

/**
 * String to use as the button label.
 */
CKEDITOR.config.strinsert_button_label = "Insert";

/**
 * String to use as the button title.
 */
CKEDITOR.config.strinsert_button_title = "Insert content";

/**
 * String to use as the button voice label.
 */
CKEDITOR.config.strinsert_button_voice = "Insert content";

CKEDITOR.plugins.add("insert", {
  requires: ["richcombo"],
  init: function (editor) {
    var config = editor.config;

    // Gets the list of insertable strings from the settings.
    var strings = config.strinsert_strings;
    var blanklimit = config.insert.blanklimit;
    var dropdownlimit = config.insert.dropdownlimit;

    // CKEDITOR.instances.editor.fire('disableblanks')
    // editor.on( 'disableblanks', function( event ){
    // 	console.log( 'disableblanks',event );
    // 	if(event.data){
    // 		strings.splice(1,1);
    // 	}
    // 	strings = config.strinsert_strings;
    // 	console.log(strings)
    // });

    var dropdownTemplate = `<span id= "dropdown_" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;">dropdown</span> </span>`;
    var blanksTemplate = `<span id= "blank_" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;"> blank</span> </span>`;

    // var buildListHasRunOnce = 0;
    // var buildList = function () {
    // 	console.log('buildList',this)
    // 	if (buildListHasRunOnce) {
    // 		this._.committed = 0;
    // 		this.commit()
    // 	}
    // 	buildListHasRunOnce = 1;
    // }

    // add the menu to the editor
    var initializeRichCombo = 0;
    editor.ui.addRichCombo("insert", {
      label: config.strinsert_button_label,
      title: config.strinsert_button_title,
      voiceLabel: config.strinsert_button_voice,
      toolbar: "insert",
      className: "cke_format",
      multiSelect: false,
      panel: {
        css: [editor.config.contentsCss, CKEDITOR.skin.getPath("editor")],
        voiceLabel: editor.lang.panelVoiceLabel,
      },

      init: function () {
        // var rebuildList = CKEDITOR.tools.bind(buildList, this);
        // rebuildList();

        initializeRichCombo = 1;
        var lastgroup = "";
        for (var i = 0, len = strings.length; i < len; i++) {
          string = strings[i];
          // If there is no value, make a group header using the name.
          if (!string.value) {
            this.startGroup(string.name);
          }
          // If we have a value, we have a string insert row.
          else {
            // If no name provided, use the value for the name.
            if (!string.name) {
              string.name = string.value;
            }
            // If no label provided, use the name for the label.
            if (!string.label) {
              string.label = string.name;
            }
            // Listener...
            // // Your command...
            // editor.addCommand( 'disableblank',
            // {
            // 	exec : function( editor )
            // 	{
            // 		editor.fire( 'customSave', editor.getData() );
            // 	}
            // //...
            // } );
            if (string.value === "DROPDOWN") {
              if (
                (editor.getData().match(/dropdown_/g) || []).length <=
                dropdownlimit
              ) {
                // const dropdownTemplate = `<span class= "DROPDOWN_1" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;">dropdown</span> </span>`
                this.add(dropdownTemplate, string.name, string.label);
              }

              // this.disable()
              // this.hideItem(dropdownTemplate)
            } else if (string.value === "BLANKS") {
              if (
                (editor.getData().match(/blank_/g) || []).length <= blanklimit
              ) {
                // const blanksTemplate = `<span class= "BLANK_1" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;"> blank</span> </span>`
                this.add(blanksTemplate, string.name, string.label);
              }
            } else {
              this.add(string.value, string.name, string.label);
            }
          }
        }
      },

      onRender: function () {
        var initialData = editor.getData();
        editor.on(
          "change",
          function (event) {
            // console.log('editor',editor.setData('anish'))
            // (editor.getData().match(/dropdown_/g) || []).forEach((element,index) => {
            // 	editor.getData().split('dropdown_').join(`dropdown_`+index)
            // 	editor.getData().split('dropdown&nbsp').join(`dropdown&nbsp`+index)
            // });
            function getid(html) {
              var revised = (html.match(/id="(.*?)"/g) || []).map((val) => {
                return val.replace(/id="/g, "").replace('"', "");
              });
              return revised;
            }
            var updatedHTML = editor.getData();
            var revisedHTML;
            // (updatedHTML.match(/blank_/g) || []).forEach((element, index) => {
            // 	console.log(getid(updatedHTML))
            getid(updatedHTML)
              .filter((classname) => classname.includes("blank_"))
              .map((matched, index) => {
                // console.log(matched,index+1)
                revisedHTML = updatedHTML
                  .split(matched)
                  .join(`blank_${index + 1}`);
              });
            if (initialData !== editor.getData()) {
              console.log("content changed");
              // editor.setData(updatedHTMLx)
              initialData = editor.getData();
            }
            console.log({ revisedHTML });
            // console.log('change =>',editor.getData(),editor.getData().split('blank_').join(`blank_` + index+1).split('blank&nbsp;').join(`blank&nbsp;`+ index+1))
            // });
            // this.select((items) => console.log(items))
            // console.log('change', this.showItem, event)
            // console.log('initializeRichCombo', initializeRichCombo)
            if (
              blanklimit &&
              blanklimit !== 0 &&
              initializeRichCombo &&
              (editor.getData().match(/blank_/g) || []).length <= blanklimit
            ) {
              this.styleItem(blanksTemplate, "pointer-events", "");
              this.styleItem(blanksTemplate, "color", "black");
              // Object.keys(this._.items).length !==0 && this.showAll()
              // editor.element.getDocument().getById(this._.items[blanksTemplate]) && editor.element.getDocument().getById(this._.items[blanksTemplate]).setStyle('display', '');
            }
            if (
              dropdownlimit &&
              dropdownlimit !== 0 &&
              initializeRichCombo &&
              (editor.getData().match(/dropdown_/g) || []).length <=
                dropdownlimit
            ) {
              this.styleItem(dropdownTemplate, "pointer-events", "");
              this.styleItem(dropdownTemplate, "color", "black");
              // Object.keys(this._.items).length !==0 && this.showAll()
              // editor.element.getDocument().getById(this._.items[dropdownTemplate]) && editor.element.getDocument().getById(this._.items[dropdownTemplate]).setStyle('display', '');
            }
          }.bind(this)
        );
      },

      onClick: function (value) {
        var updatedValue;
        if (value.includes("dropdown_")) {
          updatedValue = `<span id= "dropdown_${
            (editor.getData().match(/dropdown_/g) || []).length + 1
          }" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;">dropdown ${
            (editor.getData().match(/dropdown_/g) || []).length + 1
          }</span> </span>`;
        }
        if (value.includes("blank_")) {
          updatedValue = `<span id= "blank_${
            (editor.getData().match(/blank_/g) || []).length + 1
          }" contentEditable="false" style="border: 1px solid #D4DAE9;background: #fbfcfe;padding: 0 .4rem;margin: 0 .4rem;border-radius: 4px;display: inline-block;"><span contentEditable='false'style="color: #A7A7B4;font: normal 14px/16px Gilroy;text-transform: capitalize;"> blank ${
            (editor.getData().match(/blank_/g) || []).length + 1
          }</span> </span>`;
        }
        editor.focus();
        editor.fire("saveSnapshot");
        editor.insertHtml(updatedValue);
        editor.fire("saveSnapshot");
        // console.log('onClick items', this._.items[blanksTemplate])
        if (
          dropdownlimit &&
          dropdownlimit !== 0 &&
          (editor.getData().match(/dropdown_/g) || []).length >= dropdownlimit
        ) {
          // this.hideItem(dropdownTemplate)
          this.styleItem(dropdownTemplate, "pointer-events", "none");
          this.styleItem(dropdownTemplate, "color", "gray");
        }
        if (
          blanklimit &&
          blanklimit !== 0 &&
          (editor.getData().match(/blank_/g) || []).length >= blanklimit
        ) {
          // this.hideItem(blanksTemplate)
          this.styleItem(blanksTemplate, "pointer-events", "none");
          this.styleItem(blanksTemplate, "color", "gray");
        }
      },
    });
  },
});
