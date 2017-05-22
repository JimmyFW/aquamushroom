window.addEventListener("load", loadSettings);

function loadSettings() {
	configureToggleUI("toggleAdmin", "admin");
}

function configureToggleUI(toggle, setting) {
	var toggleUI = document.getElementById(toggle);
	var toggleValue = localStorage.getItem(setting);
	toggleUI.onclick = getSettingFunction(toggle, setting);
	refresh(toggle, toggleValue);
}

function getSettingFunction(toggle, setting) {
	var toggle = toggle;
	var setting = setting;
	return function() {
		setSetting(toggle, setting);
	}
}

function refresh(toggle, setTo) {
	var toggleUI = document.getElementById(toggle);
	if (setTo === "true") {
		toggleUI.checked = true;
	} else {
		toggleUI.checked = false;
	}
}

function setSetting(toggle, setting) {
	var settingValue = localStorage.getItem(setting);
	var toggleUI = document.getElementById(toggle)
	console.log("setSetting: localStorage " + setting + " value is " + settingValue);
	if (settingValue === null) {
		console.log("setting " + setting + " to toggle value " + toggleUI.checked);
		localStorage.setItem(setting, toggleUI.checked);
	} else if (settingValue === "false") {
		console.log("settingValue is false: " + settingValue + ", setting to true");
		localStorage.setItem(setting, true);
		refresh(toggle, "true");
	} else {
		console.log("settingValue is true: " + settingValue + ", setting to false");
		localStorage.setItem(setting, false);
		refresh(toggle, "false");
	}
}