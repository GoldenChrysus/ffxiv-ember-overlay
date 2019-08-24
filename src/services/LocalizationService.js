import Constants from "../constants/index";

class LocalizationService {
	getPlayerDataTitle(language, key, type) {
		let title = Constants.PlayerDataTitles[key];

		title = title[language] || title.en;

		return title[type];
	}

	getPlayerDataTitles(language) {
		let options = [];

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