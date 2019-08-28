import Constants from "../constants/index";
import store from "../redux/store/index";

class LocalizationService {
	getLanguage() {
		return store.getState().settings.interface.language;
	}

	getPlayerDataTitle(key, type) {
		let title = Constants.PlayerDataTitles[key];

		title = title[this.getLanguage()] || title.en;

		return title[type];
	}

	getPlayerDataTitles() {
		let language = this.getLanguage();
		let options  = [];

		for (let data_key in Constants.PlayerDataTitles) {
			let data   = Constants.PlayerDataTitles[data_key];
			let option = {
				key   : data_key,
				value : data_key,
				text  : ""
			};

			option.text = (data[language]) ? data[language].long : data.en.long;

			options.push(option);
		}

		return options;
	}
}

export default new LocalizationService();