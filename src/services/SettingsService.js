class SettingsService {
	openSettingsWindow() {
		window.open("#/settings", "", "width=600,height=400,location=no,menubar=no");
	}
}

export default new SettingsService();