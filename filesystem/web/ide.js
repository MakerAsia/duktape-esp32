/**
 * This is the IDE for ESP32-Duktape
 */
$(document).ready(function() {
	var consoleWS = null;
	var settings;
	window._kbxIde = {
		alive: true,
		isFsDirty: true,
		saveAsAutoStart: false,
		fsCachedData: [],
		setFsDirty: function(status) {
			_kbxIde.isFsDirty = status;
		}
	};

	setInterval(function() {
		if (_kbxIde.alive) {
			$("#serverStatus").text("(connected)");
		}
		else {
			$("#serverStatus").text("(disconnected)");
		}
	}, 1000);
	/*
	setInterval(function() { 
		$.ajax({
			url: "http://" + settings.esp32_host + "/heartbeat",
			contentType: "application/javascript",
			method: "GET",
			success: function(data) {
				_kbxIde.alive = true;
				console.log("heap size = " + data)
			},
			error: function(err) {
				_kbxIde.alive = false;
			},
			timeout: 3*1000,
		}); // .ajax 
	}, 30*1000);
	*/

	if (localStorage.settings) {
		settings = JSON.parse(localStorage.settings);
	} else {
		var settings = {
			esp32_host: location.host,
			theme: "eclipse"
		};
	}

	/*
	 * Determine if the enable console checkbox is checked and, if yes then return true.
	 */
	function isConsoleEnabled() {
		ret = $("#consoleCheckbox").prop("checked");
		//console.log("Console enabled: " + ret);
		return ret;
	}

	/**
	 * Run a script on the ESP32 Duktape environment by sending in a POST request
	 * with the body of the message being the script to execute.
	 *
	 * @param script A string representation of the script to run.
	 * @returns N/A
	 */
	function runScript(script) {
		$.ajax({
			url: "http://" + settings.esp32_host + "/run",
			contentType: "application/javascript",
			method: "POST",
			data: script,
			success: function() {
				console.log("Code sent for execution.");
			}
		}); // .ajax
	} // runScript

	/**
	 * Connect to the ESP32 for the console websocket.
	 * @param onOpen A callback function to be invoked when the socket has been established.
	 * @returns N/A
	 */
	function createConsoleWebSocket(onOpen) {
		consoleWS = new WebSocket("ws://" + location.hostname + ":8002/console");
		// When a console message arrives, append it to the console log and scroll so that it is visible.
		consoleWS.onmessage = function(event) {
			console.log("WS message received!");
			$("#console").val($("#console").val() + event.data);
			$("#console").scrollTop($("#console")[0].scrollHeight);
		};
		consoleWS.onclose = function() {
			$("#newWebSocket").button("enable");
			$("#console").prop("disabled", true);
			consoleWS = null;
		};
		consoleWS.onopen = function() {
			$("#console").prop("disabled", false);
			if (onOpen != null) {
				onOpen();
			}
		};
	} // createConsoleWebSocket

	/**
	 * We have the need to populate a <select> with the names of files stored on the ESP32.
	 * This function performs that task by making a REST request to the ESP32 to retrieve
	 * them.  The results are then inserted into the <select>
	 * @param selectObj The jQuery object representing the <select>
	 * @param callback A callback to invoke when done.
	 * @returns N/A
	 */
	function populateSelectWithFiles(selectObj, callback) {
		function showPopup(data, callback) {
			data.sort(function(a, b) {
				if (a.name < b.name) {
					return -1;
				}
				if (a.name > b.name) {
					return 1;
				}
				return 0;
			});
			$(selectObj).empty();
			for (var i = 0; i < data.length; i++) {
				$(selectObj).append($("<option>", {value: data[i].name, text: data[i].name}));
			}
			if (callback) {
				callback();
			}
		}

		if (_kbxIde.isFsDirty) {
			$.ajax({
				url: "http://" + settings.esp32_host + "/files",
				method: "GET",
				dataType: "json",
				success: function(data) {
					_kbxIde.fsCachedData = data.slice(0);
					_kbxIde.setFsDirty(false);
					showPopup(data, callback);
				} // Success
			}); // .ajax
		}
		else {
			showPopup(_kbxIde.fsCachedData, callback);
		}
	} // populateSelectWithFiles

	// Create the page layout.
	$("#c1").layout({
		applyDefaultStyles: true,
		// The center pane is the editor.
		center: {
			onresize: function() {
				editor.resize();
			}
		},
		// The south pane is the console.
		south: {
			size: 200, // Set its initial height.
			closable: true // Flag the console pane as closable.
		}
	});

	// Create the ace editor
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/" + settings.theme);
	editor.getSession().setMode("ace/mode/javascript"); // Set the language to be JavaScript
	editor.setFontSize(16);
	editor.setOption("showPrintMargin", false);
	editor.$blockScrolling = Infinity;

	// Handle the run button
	$("#run").button({
		icon: "ui-icon-play" // Set the icon on the button to be the play icon.
	}).click(function() {
		if (consoleWS != null || !isConsoleEnabled()) {
			runScript(editor.getValue());
		} else {
			createConsoleWebSocket(function() {
				console.log("Web socket open!");
				runScript(editor.getValue());
			});
		}
	});

	$("#consoleCheckbox").checkboxradio().change(function() {
		//console.log("Checkbox change: " + isConsoleEnabled());
		if (!isConsoleEnabled()) {
			if (consoleWS != null) {
				consoleWS.close();
				consoleWS = null;
			}
		} else {
			// Console was not enabled, so enable it now.
			createConsoleWebSocket(null);
		}
	}); // #consoleCheckbox checkBox changed.

	// Handle the clear console button.
	$("#clearConsole").button({
		icon: "ui-icon-trash" // Set the icon on the button to be the trash can.
	}).click(function() {
		$("#console").val("");
	});

	$("#load").button().click(function() {
		populateSelectWithFiles($("#loadSelect"), function() {
			$("#loadDialog").dialog("open");
		});
		// $.ajax({
		// 	url: "http://" + settings.esp32_host + "/files",
		// 	method: "GET",
		// 	dataType: "json",
		// 	success: function(data) {
		// 	} // Success
		// }); // .ajax
	});

	// Handle the stop script button.
	$("#stopScript").button({
		icon: "ui-icon-stop" // Set the icon on the button to be the trash can.
	}).click(function() {
		runScript("console.log('')");
	});

	// Handle the save as autostart program
	$("#saveAsAutoStart").button({
		// icon: "ui-icon-save"
	}).click(function() {
		_kbxIde.saveAsAutoStart = true;
		populateSelectWithFiles($("#saveSelect"), function() {
			$("#saveFileNameText").val("");
			$("#saveDialog").dialog("open");
		});
	});

	$("#saveSelect").change(function(event) {
		populateSelectWithFiles($("#saveSelect"), function() {
			$("#saveFileNameText").val("");
			$("#saveDialog").dialog("open");
		});
	});

	/**
	 * Handle the save button being pressed on the main window.
	 * This will open the save dialog.
	 */
	$("#save").button().click(function() {
		populateSelectWithFiles($("#saveSelect"), function() {
			$("#saveFileNameText").val("");
			$("#saveDialog").dialog("open");
		});
	});

	// Handle the settings button.
	$("#settings").button({
		icon: "ui-icon-wrench" // Set the icon on the button to be the wrench.
	}).click(function() {
		$("#settingsHost").val(settings.esp32_host);
		$("#fontSize").val(editor.getFontSize());
		$("#theme").val(settings.theme);
		$("#settingsDialog").dialog("open");
	});

	$("#info").click(function() {
		console.log("Info!");
		open("https://github.com/nkolban/duktape-esp32");
	});

	$("#repl").on("keypress", function(e) {
		if (e.keyCode == 13) {
			runScript($("#repl").val());
			return false;
		}
	});

	$("#evalRun").button().click(function() {
		runScript($("#repl").val());
	});

	// Create and handle the save file dialog
	$("#saveDialog").dialog({
		autoOpen: false,
		modal: true,
		width: 400,
		buttons: [
			{
				text: "Save",
				click: function() {
					var selectedFile = $("#saveFileNameText").val().trim(); // Get the input file name.
					if (selectedFile.length == 0) { // Check that it is not empty
						return; // No file name entered.
					}

					if (selectedFile.charAt(0) != "/") { // File must start with a "/".  Add it if not present.
						selectedFile = "/" + selectedFile;
					}

					// Make a REST call to the ESP32 to save the data.  The URL is:
					// POST /files/<fileName>
					// Body: Data to save
					var saveOption = "";
					if (_kbxIde.saveAsAutoStart) {
						saveOption = "?autoStart";
					}
					_kbxIde.saveAsAutoStart = false;
					$.ajax({
						url: "http://" + settings.esp32_host + "/files" + selectedFile + saveOption,
						method: "POST",
						data: editor.getValue(),
						success: function(data) {
							_kbxIde.setFsDirty(true);
							$("#saveDialog").dialog("close");
						}
					}); // .ajax
				}
			},
			{
				text: "Cancel",
				click: function() {
					_kbxIde.saveAsAutoStart = false;
					$(this).dialog("close");
				}
			}
		]
	}); // #saveDialog

	// Create and handle the load file dialog
	$("#loadDialog").dialog({
		autoOpen: false,
		modal: true,
		width: 400,
		buttons: [
			{
				text: "Run",
				click: function() {
					// Determine which file was selected in the list
					var selectedFile = $("#loadSelect option:selected").val();

					if (!(selectedFile.substr(0, "/".length) === "/")) {
						selectedFile = "/" + selectedFile;
					}
					/*
					// Ensure the selected file starts with "/
					if (!selectedFile.startsWith("/")) {
						selectedFile = "/" + selectedFile;
					}
					*/

					// Run the named file.
					$.ajax({
						url: "http://" + settings.esp32_host + "/run" + selectedFile,
						method: "GET",
						dataType: "text",
						success: function(data) {}
					});
				}
			},
			{
				text: "Load",
				click: function() {
					// Determine which file was selected in the list
					var selectedFile = $("#loadSelect option:selected").val();
					// Ensure the selected file starts with "/
					if (!(selectedFile.substr(0, "/".length) === "/")) {
						selectedFile = "/" + selectedFile;
					}

					/*
					if (!selectedFile.startsWith("/")) {
						selectedFile = "/" + selectedFile;
					}
					*/

					// Retrieve the content of a file from ESP32 file store.
					// the REST request format is:
					// GET /files/<fileName>
					runScript("console.log('')");

					$.ajax({
						url: "http://" + settings.esp32_host + "/files" + selectedFile,
						method: "GET",
						dataType: "text",
						success: function(data) {
							editor.setValue(data);
						}
					});
					$(this).dialog("close");
				} // Click on the load button
			},
			{
				text: "Cancel",
				click: function() {
					$(this).dialog("close");
				}
			}
		]
	});

	// Create and handle the settings dialog.
	$("#settingsDialog").dialog({
		autoOpen: false, // Do not auto open the dialog
		modal: true, // Dialog should be model.
		width: 400, // Width of dialog.
		buttons: [
			// The OK button is clicked to confirm the entries.
			{
				text: "OK",
				click: function() {
					settings.esp32_host = $("#settingsHost").val();
					settings.theme = $("#theme option:selected").val();
					localStorage = JSON.stringify(settings);

					editor.setFontSize($("#fontSize").val());
					editor.setTheme("ace/theme/" + settings.theme);
					$(this).dialog("close");
				}
			},
			// The Cancel button is clicked to cancel any settings changes.
			{
				text: "Cancel",
				click: function() {
					$(this).dialog("close");
				}
			}
		] // Array of buttons
	}); // Settings dialog
}); // onReady.