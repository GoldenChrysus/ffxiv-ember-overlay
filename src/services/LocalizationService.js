import Constants from "../constants/index";
import SkillData from "../constants/SkillData";
import { OverlayLocales, SettingsLocales } from "../constants/Locales";
import store from "../redux/store/index";

class LocalizationService {
	getLanguage() {
		return store.getState().settings.interface.language;
	}

	getTTSLanguage() {
		return store.getState().settings.tts.language;
	}

	getPlayerDataTitle(key, type, ignore_custom) {
		let custom = (ignore_custom) ? {} : store.getState().settings.custom.metric_names;

		if (!ignore_custom && custom[key] && custom[key][type]) {
			return custom[key][type];
		}

		let title = Constants.PlayerDataTitles[key];

		title = title[this.getLanguage()] || title.en;

		return title[type];
	}

	getPlayerDataTitles(include_null, ignore_custom) {
		let custom   = (ignore_custom) ? {} : store.getState().settings.custom.metric_names;
		let language = this.getLanguage();
		let options  = [];

		if (include_null) {
			options.push({
				key   : "",
				value : "",
				text  : ""
			});
		}

		for (let data_key in Constants.PlayerDataTitles) {
			let data   = Constants.PlayerDataTitles[data_key];
			let option = {
				key   : data_key,
				value : data_key,
				text  : ""
			};

			if (!ignore_custom && custom[data_key] && custom[data_key].long) {
				option.text = custom[data_key].long
			} else {
				option.text = (data[language]) ? data[language].long : data.en.long;
			}

			options.push(option);
		}

		return options;
	}

	getMonsterDataTitle(key, type) {
		let title = Constants.MonsterDataTitles[key];

		title = title[this.getLanguage()] || title.en;

		return title[type];
	}

	getTTSRuleOptions() {
		let language = this.getLanguage();
		let options  = [];

		for (let data_key of Constants.TTSRules) {
			options.push({
				key   : data_key,
				value : data_key,
				text  : this.getTTSRuleTitle(data_key, language)
			});
		}

		return options;
	}

	getTTSRuleTitle(key, language) {
		language = language || this.getLanguage();

		return SettingsLocales.misc.tts[key][language];
	}

	getTTSTextData(type, current_state) {
		let language = (current_state) ? current_state.settings_data.getSetting("tts.language") : this.getTTSLanguage();

		return OverlayLocales.tts[type][language];
	}

	getOverlayText(key, language) {
		if (!language) {
			language = this.getLanguage();
		}

		return OverlayLocales[key][language] || OverlayLocales[key].en;
	}

	getSettingsSectionText(section) {
		return SettingsLocales.sections[section].title[this.getLanguage()] || SettingsLocales.sections[section].title.en;
	}

	getSettingsSubsectionText(section, index) {
		return SettingsLocales.sections[section].subsections[index][this.getLanguage()] || SettingsLocales.sections[section].subsections[index].en; 
	}

	getSettingText(key_path) {
		return SettingsLocales.setting_labels[key_path][this.getLanguage()] || SettingsLocales.setting_labels[key_path].en;
	}

	getPlayerShortNameOptions() {
		let language = this.getLanguage();
		let data_set = SettingsLocales.misc.short_name_options[language] || SettingsLocales.misc.short_name_options.en;
		
		return [
			{
				key   : "no_short",
				value : "no_short",
				text  : data_set.no_short
			},
			{
				key   : "short_first",
				value : "short_first",
				text  : data_set.short_first
			},
			{
				key   : "short_last",
				value : "short_last",
				text  : data_set.short_last
			},
			{
				key   : "short_both",
				value : "short_both",
				text  : data_set.short_both
			}
		];
	}

	getMisc(key) {
		let language = this.getLanguage();

		return SettingsLocales.misc[key][language] || SettingsLocales.misc[key].en;
	}

	getoGCDSkillName(id, language) {
		language = language || this.getLanguage();

		return SkillData.oGCDSkills[id].locales.name[language] || SkillData.oGCDSkills[id].locales.name.en;
	}

	getoGCDSkillOptions() {
		let language = this.getLanguage();
		let options  = [];

		for (let id in SkillData.oGCDSkills) {
			options.push({
				key   : id,
				value : id,
				text  : this.getoGCDSkillName(id, language)
			});
		}

		options.sort((a, b) => {
			return (a.text < b.text) ? -1 : 1;
		});

		return options;
	}

	getEffectName(id, language) {
		if (!SkillData.Effects[id]) {
			return "";
		}

		language = language || this.getLanguage();

		return SkillData.Effects[id].locales.name[language] || SkillData.Effects[id].locales.name.en;
	}

	getEffectOptions(dot) {
		let language = this.getLanguage();
		let options  = [];
		let used     = {};

		for (let id in SkillData.Effects) {
			let name = this.getEffectName(id, "en");

			if (used[name] || SkillData.Effects[id].dot !== dot) {
				continue;
			}

			options.push({
				key   : id,
				value : id,
				text  : this.getEffectName(id, language)
			});

			used[name] = true;
		}

		options.sort((a, b) => {
			return (a.text < b.text) ? -1 : 1;
		});

		return options;
	}

	getSpellTrackingOption(role, type, language) {
		language = language || this.getLanguage();

		let misc = SettingsLocales.misc.spells;

		role = misc.roles[role][language] || misc.roles[role].en;
		type = misc.types[type][language] || misc.types[type].en;

		return `${role}: ${type}`;
	}

	getSpellTrackingOptions() {
		let language = this.getLanguage();
		let options  = [];

		for (let role in SettingsLocales.misc.spells.roles) {
			for (let type in SettingsLocales.misc.spells.types) {
				let key = `${role}-${type}`;

				options.push({
					key   : key,
					value : key,
					text  : this.getSpellTrackingOption(role, type, language)
				});
			}
		}

		return options;
	}
}

export default new LocalizationService();