import Constants from "../constants/index";
import SkillData from "../constants/SkillData";
import ZoneData from "../constants/ZoneData";
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

	getSettingText(key_path, language) {
		language = language || this.getLanguage();

		return SettingsLocales.setting_labels[key_path][language] || SettingsLocales.setting_labels[key_path].en;
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

	getAlignmentOptions() {
		let language = this.getLanguage();
		let data_set = SettingsLocales.misc.alignment_options[language] || SettingsLocales.misc.alignment_options.en;
		
		return [
			{
				key   : "left",
				value : "left",
				text  : data_set.left
			},
			{
				key   : "center",
				value : "center",
				text  : data_set.center
			},
			{
				key   : "right",
				value : "right",
				text  : data_set.right
			}
		];
	}

	getMisc(key, language) {
		if (!SettingsLocales.misc[key]) {
			return false;
		}

		language = language || this.getLanguage();

		return SettingsLocales.misc[key][language] || SettingsLocales.misc[key].en;
	}

	getSpellName(type, id, language) {
		switch (type) {
			case "dot":
			case "debuff":
			case "effect":
				return this.getEffectName(id, language);

			case "skill":
			case "spell":
				return this.getoGCDSkillName(id, language);

			default:
				return "";
		}	
	}

	getoGCDSkillName(id, language) {
		if (!SkillData.oGCDSkills[id]) {
			return "";
		}

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

	getEffectOptions(type, party) {
		type = type || "effect";

		let language = this.getLanguage();
		let options  = [];
		let used     = {};
		let key      = type + "s"

		if (party) {
			key = `party_${key}`;
		}

		let existing = store.getState().settings.spells_mode[key];

		for (let id of existing) {
			if (!SkillData.Effects[id]) {
				continue;
			}

			let name = this.getEffectName(id, "en");

			options.push({
				key   : id,
				value : id,
				text  : this.getEffectName(id, language)
			});

			used[name] = true;
		}

		for (let id in SkillData.Effects) {
			let name = this.getEffectName(id, "en");

			if (used[name] || SkillData.Effects[id].type !== type) {
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

	getSpellTrackingOption(role, type, language, is_job) {
		let misc = SettingsLocales.misc.spells;

		if ((!is_job && !misc.roles[role]) || (is_job && !Constants.GameJobs[role])) {
			return false;
		}

		language = language || this.getLanguage();

		role = (is_job) ? role : (misc.roles[role][language] || misc.roles[role].en);
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
					key     : key,
					value   : key,
					is_role : true,
					role    : role,
					text    : this.getSpellTrackingOption(role, type, language)
				});
			}
		}

		for (let job in Constants.GameJobs) {
			for (let type in SettingsLocales.misc.spells.types) {
				let key = `${job}-${type}`;

				options.push({
					key     : key,
					value   : key,
					is_role : false,
					role    : job,
					text    : this.getSpellTrackingOption(job, type, language, true)
				});
			}
		}

		options.sort((a, b) => {
			if (a.role === b.role) {
				return (a.text < b.text) ? -1 : 1;
			}

			if (a.role === "you") {
				return -1;
			} else if (b.role === "you") {
				return 1;
			}

			if (a.is_role && !b.is_role) {
				return -1;
			} else if (!a.is_role && b.is_role) {
				return 1;
			}

			return (a.role < b.role) ? -1 : 1;
		});

		return options;
	}

	getSpellsTTSTriggerOptions() {
		let language = this.getLanguage();
		let data_set = SettingsLocales.misc.spells.tts_trigger_options[language] || SettingsLocales.misc.spells.tts_trigger_options.en;
		let options  = [];

		for (let key in data_set) {
			options.push({
				key   : key,
				value : key,
				text  : data_set[key]
			});
		}
		
		return options;
	}

	getSpellLayoutOptions(include_default) {
		let language = this.getLanguage();
		let data_set = SettingsLocales.misc.spells.layout_options[language] || SettingsLocales.misc.spells.layout_options.en;
		let options  = [];

		if (include_default) {
			options.push({
				key   : "default",
				value : "default",
				text  : this.getMisc("default")
			});
		}

		for (let key in data_set) {
			options.push({
				key   : key,
				value : key,
				text  : data_set[key]
			});
		}
		
		return options;
	}

	getSpellUIBuilderInfo() {
		let language = this.getLanguage();
		let info     = this.getMisc("spells_ui_builder_info", language);

		for (let match of info.match(/\{\{[\w.]+}}/g)) {
			let key = match.replace(/\{|}/g, "");

			info = info.replace(match, this.getMisc(key, language) || this.getSettingText(key, language));
		}

		return info;
	}

	getSpellDesignerIndicatorOptions() {
		let language = this.getLanguage();
		let data_set = SettingsLocales.misc.spells.indicator_options[language] || SettingsLocales.misc.spells.indicator_options.en;
		let options  = [];

		for (let key in data_set) {
			options.push({
				key   : key,
				value : key,
				text  : data_set[key]
			});
		}
		
		return options;
	}

	getInstanceName(id, language) {
		if (!ZoneData.Instances[id]) {
			return "";
		}

		language = language || this.getLanguage();		

		return ZoneData.Instances[id].locales.name[language] || ZoneData.Instances[id].locales.name.en;
	}

	getZoneOptions() {
		let language  = this.getLanguage();
		let options   = [];
		let processed = [];

		for (let id in ZoneData.Instances) {
			let zone_id = ZoneData.Instances[id].zone_id;

			if (processed.indexOf(zone_id) !== -1) {
				continue;
			}

			options.push({
				key   : String(zone_id),
				value : String(zone_id),
				text  : this.getInstanceName(id, language)
			});
			processed.push(zone_id);
		}

		options.sort((a, b) => {
			return (a.text < b.text) ? -1 : 1;
		});

		processed = null;

		return options;
	}

	getDiscordWebhookInfo() {
		const language = this.getLanguage();

		let info = this.getMisc("discord_webhook_info", this.getLanguage());

		for (let match of info.match(/\{\{[\w.]+}}/g)) {
			let key = match.replace(/\{|}/g, "");

			info = info.replace(match, this.getOverlayText(key, language) || this.getOverlayText(key, language));
		}

		return info;
	}
}

export default new LocalizationService();