import clone from "lodash.clonedeep";
import isEqual from "lodash.isequal";

import Settings from "../../data/Settings";
import PluginService from "../../services/PluginService";
import OverlayPluginService from "../../services/PluginService/OverlayPluginService";
import ObjectService from "../../services/ObjectService";
import GameDataProcessor from "../../processors/GameDataProcessor";
import ThemeService from "../../services/ThemeService";
import SampleGameData from "../../constants/SampleGameData";
import SampleHistoryData from "../../constants/SampleHistoryData";
import SampleAggroData from "../../constants/SampleAggroData";
import TTSService from "../../services/TTSService";
import TabSyncService from "../../services/TabSyncService";
import SpellService from "../../services/SpellService";

import PVPZoneData from "../../constants/PVPZoneData";

const querystring = require("querystring");

const params                = new querystring.parse(String(window.location.search).substring(1));
const overlayplugin_service = new OverlayPluginService();
const uuid                  = (window.OverlayPluginApi) ? window.OverlayPluginApi.overlayUuid : "browser";

if (typeof params.mode === "object") {
	params.mode = params.mode[0];
}

const initial_state = {
	plugin_service : new PluginService(),
	settings_data  : Settings,
	last_activity  : (new Date()).getTime() / 1000,
	internal       : {
		last_settings_update : new Date(),
		viewing              : "tables",
		character_name       : "YOU",
		character_id         : null,
		character_job        : null,
		character_level      : null,
		current_zone_id      : null,
		rank                 : "N/A",
		game                 : {},
		enmity               : {},
		aggro                : [],
		data_history         : {},
		encounter_history    : [],
		detail_player        : {},
		party                : [],
		spells               : {
			in_use        : {},
			defaulted     : {},
			allowed_types : {
				skill  : {},
				effect : {},
				dot    : {},
				debuff : {},
			},
		},
		viewing_history      : false,
		overlayplugin        : overlayplugin_service.isOverlayPlugin(),
		overlayplugin_author : overlayplugin_service.getAuthor(),
		new_version          : false,
		mode                 : params.mode || localStorage.getItem(`${uuid}-mode`) || "stats",
		ui_builder           : false,
		toggles              : {
			top_left     : false,
			top_right    : false,
			bottom_left  : false,
			bottom_right : false,
		},
	},
	settings : {},
};

function rootReducer(state, action) {
	if (!state) {
		state = initial_state;

		ThemeService.setMode(state.internal.mode);
	}

	let new_state = false;
	let full_key  = action.key;

	switch (action.type) {
		case "setSetting":
			let set_setting = false;

			if (!Array.isArray(action.key)) {
				state.settings_data.setSetting(action.key, action.payload, true);

				full_key    = `settings.${action.key}`;
				new_state   = createNewState(state, full_key, action);
				set_setting = true;
			} else {
				for (const i in action.key) {
					set_setting = true;
					full_key    = `settings.${action.key[i]}`;
					new_state   = createNewState(
						new_state || state,
						full_key,
						{
							type    : action.type,
							key     : full_key,
							payload : action.payload[i],
						},
					);

					new_state.settings_data.setSetting(action.key[i], action.payload[i], true);
				}
			}

			if (!window.parser) {
				TabSyncService.saveAction(action);
			} else if (set_setting) {
				new_state.internal.last_settings_update = new Date();

				new_state.settings_data.saveSettings(true);
			}

			break;

		case "setSettings":
			new_state = clone(state);

			for (const setting of action.data) {
				new_state.settings_data.setSetting(setting.key, setting.payload, true);

				full_key  = `settings.${setting.key}`;
				new_state = createNewState(new_state || state, full_key, setting);
			}

			new_state.internal.last_settings_update = new Date();

			if (!action.skip_sync) {
				new_state.settings_data.saveSettings(true).then(() => TabSyncService.saveAction(action));
			} else {
				new_state.settings_data.saveSettings(true);
			}

			break;

		case "parseGameData":
			// When the encounter is inactive and the new data is also inactive, do nothing
			if (
				state.internal.game &&
				state.internal.game.isActive === action.payload.isActive &&
				(action.payload.isActive === false || action.payload.isActive === "false")
			) {
				break;
			}

			const new_history = (
				!action.payload.Encounter ||
				!state.internal.encounter_history.length ||
				!state.internal.encounter_history[0].game.Encounter ||
				(
					Number(action.payload.Encounter.DURATION) < Number(state.internal.encounter_history[0].game.Encounter.DURATION) &&
					Number(action.payload.Encounter.DURATION) === 0
				)
			);

			if (state.internal.mode === "stats") {
				action.payload = GameDataProcessor.normalizeLocales(action.payload, state.settings.interface.language, (new_history) ? undefined : state);
				action.payload = GameDataProcessor.injectEnmity(action.payload, state);
			}

			new_state = createNewState(state, full_key, action);

			if (new_history) {
				if (new_state.internal.encounter_history.length === 5) {
					new_state.internal.encounter_history.pop();
				}

				new_state.internal.encounter_history.unshift({
					game         : {},
					aggro        : [],
					enmity       : {},
					data_history : {},
				});
			}

			GameDataProcessor.appendHistory(action.payload, new_state);

			new_state.internal.encounter_history[0].game = action.payload;

			if ((new_history && !new_state.internal.viewing_history) || !new_state.internal.viewing_history) {
				new_state.internal.game         = new_state.internal.encounter_history[0].game;
				new_state.internal.data_history = new_state.internal.encounter_history[0].data_history;
			}

			GameDataProcessor.processCombatDataTTS(new_state.internal.game, new_state);
			break;

		case "loadSampleData":
			let tmp_action;

			switch (state.internal.mode) {
				case "stats":
					tmp_action = {
						type : "loadSampleData",
					};

					state.internal.data_history = SampleHistoryData;

					tmp_action.payload = GameDataProcessor.normalizeLocales(SampleGameData, state.settings.interface.language, state, true);

					new_state  = createNewState(state, "internal.game", tmp_action);
					tmp_action = {
						payload : GameDataProcessor.normalizeAggroList(SampleAggroData),
					};

					new_state = createNewState(new_state, "internal.aggro", tmp_action);

					break;

				case "spells":
					tmp_action = {
						payload : {
							"skill-7499" : {
								type     : "skill",
								subtype  : "skill",
								id       : 7499,
								time     : new Date(),
								log_type : "you-skill",
								party    : false,
							},
							"skill-16481" : {
								type     : "skill",
								subtype  : "skill",
								id       : 16481,
								time     : new Date(),
								log_type : "you-skill",
								party    : false,
							},
							"skill-16482" : {
								type     : "skill",
								subtype  : "skill",
								id       : 16482,
								time     : new Date(),
								log_type : "you-skill",
								party    : false,
							},
							"effect-Jinpu" : {
								type     : "effect",
								subtype  : "effect",
								id       : 1298,
								time     : new Date(),
								duration : 40,
								log_type : "you-effect",
								party    : false,
							},
							"effect-Shifu" : {
								type     : "effect",
								subtype  : "effect",
								id       : 1299,
								time     : new Date(),
								duration : 40,
								log_type : "you-effect",
								party    : false,
							},
							"effect-Higanbana" : {
								type     : "effect",
								subtype  : "dot",
								id       : 1228,
								time     : new Date(),
								duration : 60,
								log_type : "you-dot",
								party    : false,
							},
							"effect-Trick Attack" : {
								type     : "effect",
								subtype  : "debuff",
								id       : 2014,
								time     : new Date(),
								duration : 15,
								log_type : "you-debuff",
								party    : false,
							},
							"skill-3571-party" : {
								type     : "skill",
								subtype  : "skill",
								id       : 3571,
								time     : new Date(),
								log_type : "heal-skill",
								party    : true,
							},
							"effect-Divine Benison-party" : {
								type     : "effect",
								subtype  : "effect",
								id       : 1218,
								time     : new Date(),
								duration : 15,
								log_type : "heal-effect",
								party    : true,
							},
							"effect-Dia-party" : {
								type     : "effect",
								subtype  : "dot",
								id       : 1871,
								time     : new Date(),
								duration : 30,
								log_type : "heal-dot",
								party    : true,
							},
							"skill-3557-party" : {
								type     : "skill",
								subtype  : "skill",
								id       : 3557,
								time     : new Date(),
								log_type : "dps-skill",
								party    : true,
							},
							"effect-Battle Litany-party" : {
								type     : "effect",
								subtype  : "effect",
								id       : 1414,
								time     : new Date(),
								duration : 20,
								log_type : "dps-effect",
								party    : true,
							},
							"effect-Chaos Thrust-party" : {
								type     : "effect",
								subtype  : "dot",
								id       : 118,
								time     : new Date(),
								duration : 24,
								log_type : "dps-dot",
								party    : true,
							},
							"effect-Death's Design-party" : {
								type     : "effect",
								subtype  : "debuff",
								id       : 2586,
								time     : new Date(),
								duration : 30,
								log_type : "dps-debuff",
								party    : true,
							},
							"skill-44-party" : {
								type     : "skill",
								subtype  : "skill",
								id       : 44,
								time     : new Date(),
								log_type : "tank-skill",
								party    : true,
							},
							"effect-Vengeance-party" : {
								type     : "effect",
								subtype  : "effect",
								id       : 89,
								time     : new Date(),
								duration : 15,
								log_type : "tank-effect",
								party    : true,
							},
							"effect-Sonic Break-party" : {
								type     : "effect",
								subtype  : "dot",
								id       : 1837,
								time     : new Date(),
								duration : 30,
								log_type : "tank-dot",
								party    : true,
							},
						},
					};

					new_state = createNewState(state, "internal.spells.in_use", tmp_action);

					break;

				default:
					break;
			}

			break;

		case "loadHistoryEntry":
			const index = action.payload;

			new_state = clone(state);

			new_state.internal.viewing_history = (index !== 0);

			for (const key in new_state.internal.encounter_history[index]) {
				new_state.internal[key] = new_state.internal.encounter_history[index][key];
			}

			break;

		case "parseEnmity":
			if (!state.internal.encounter_history.length) {
				return state;
			}

			action.payload = GameDataProcessor.processEnmity(action.payload);

			if (isEqual(action.payload, state.internal.encounter_history[0].enmity)) {
				return state;
			}

			new_state = clone(state);

			new_state.internal.encounter_history[0].enmity = action.payload;

			if (!new_state.internal.viewing_history) {
				new_state.internal.enmity = action.payload;
			}

			break;

		case "parseAggroList":
			if (!state.internal.encounter_history.length) {
				return state;
			}

			action.payload = GameDataProcessor.normalizeAggroList(action.payload);
			new_state      = clone(state);

			new_state.internal.encounter_history[0].aggro = action.payload;

			if (!new_state.internal.viewing_history) {
				new_state.internal.aggro = action.payload;
			}

			GameDataProcessor.processAggroTTS(new_state.internal.aggro, new_state);
			break;

		case "parseParty":
			new_state = clone(state);

			new_state.internal.party = GameDataProcessor.processParty(action.payload);

			break;

		case "changeMode":
			new_state = createNewState(state, full_key, action);

			new_state.plugin_service.updateSubscriptions(new_state.settings_data, new_state.internal);

			localStorage.setItem(`${uuid}-mode`, new_state.internal.mode);
			break;

		case "parseLogLine":
			switch (state.internal.mode) {
				case "stats":
					TTSService.processLogLine(action.payload, state);
					break;

				case "spells":
					const state_data = GameDataProcessor.parseSpellLogLine(action.payload, state);

					if (state_data.char_job || state_data.char_job === null) {
						new_state = createNewState(
							state,
							"internal.character_job",
							{
								payload : (state_data.char_job) ? state_data.char_job.abbreviation : state_data.char_job,
							},
						);

						new_state.internal.character_level = state_data.char_level;
					} else if (state_data === "wipe") {
						new_state = clone(state);

						updateSpells(new_state, true);
					} else if (state_data !== false) {
						new_state = clone(state);

						new_state.internal.spells.in_use    = state_data.in_use;
						new_state.internal.spells.defaulted = state_data.defaulted;
					}

					break;

				default:
					break;
			}

			break;

		case "changeUIBuilder":
			if (state.internal.ui_builder) {
				for (const uuid in action.payload) {
					for (const dimension of ["x", "y"]) {
						const dim_key = `_${dimension}`;

						if (dim_key in action.payload[uuid].layout) {
							action.payload[uuid].layout[dimension] = action.payload[uuid].layout[dim_key];

							delete action.payload[uuid].layout[dim_key];
						}
					}
				}
			}

			new_state = (state.internal.ui_builder) ? createNewState(state, "settings.spells_mode.ui.sections", action) : clone(state);

			new_state.settings_data.setSetting("spells_mode.ui.sections", action.payload, true);

			new_state.internal.ui_builder = !new_state.internal.ui_builder;

			new_state.settings_data.saveSettings(true);
			break;

		case "updateToggle":
			new_state                   = clone(state);
			const { location, enabled } = action.payload;

			for (const tmp_location in new_state.internal.toggles) {
				new_state.internal.toggles[tmp_location] = (location === tmp_location) ? enabled : false;
			}

			break;

		default:
			if (!Array.isArray(full_key)) {
				new_state = createNewState(state, full_key, action);
			} else {
				for (const i in full_key) {
					new_state = createNewState(
						new_state || state,
						full_key[i],
						{
							type    : action.type,
							key     : full_key[i],
							payload : action.payload[i],
						},
					);
				}
			}

			break;
	}

	return {

		...new_state || state,
	};
}

function createNewState(state, full_key, action) {
	if (!full_key) {
		return false;
	}

	const new_state = clone(state);

	new_state.plugin_service = state.plugin_service;

	if (["parseGameData", "loadSampleData"].indexOf(action.type) !== -1) {
		if (action.payload.isActive === "true" || action.payload.isActive === true) {
			new_state.last_activity = (new Date()).getTime() / 1000;
		}

		if (action.type === "parseGameData") {
			return new_state;
		}
	}

	ObjectService.setByKeyPath(new_state, full_key, action.payload);

	if (["settings", "settings.interface.theme"].indexOf(full_key) !== -1) {
		const theme = (full_key === "settings") ? action.payload.interface.theme : action.payload;

		ThemeService.setTheme(theme);
	}

	if (["settings", "settings.interface.minimal_theme"].indexOf(full_key) !== -1) {
		let minimal_theme = (full_key === "settings") ? action.payload.interface.minimal_theme : action.payload;

		if (new_state.internal.mode === "spells") {
			minimal_theme = true;
		}

		ThemeService.toggleMinimal(minimal_theme);
	}

	if (["settings", "settings.interface.horizontal", "internal.viewing", "interal.mode"].indexOf(full_key) !== -1) {
		let horizontal = (full_key === "settings")
			? action.payload.interface.horizontal
			: ((full_key === "settings.interface.horizontal")
				? action.payload
				: new_state.settings.interface.horizontal);

		if (new_state.internal.mode !== "stats" || new_state.internal.viewing !== "tables") {
			horizontal = false;
		}

		if (
			full_key === "settings.interface.horizontal" &&
			horizontal &&
			!["dps", "heal", "tank"].includes("settings.intrinsic.table_type")
		) {
			new_state.settings.intrinsic.table_type = "dps";

			new_state.settings_data.setSetting("intrinsic.table_type", "dps", true);
		}

		ThemeService.toggleHorizontal(horizontal);
	}

	if (full_key === "internal.mode") {
		ThemeService.setMode(action.payload);
	}

	if (["settings", "settings.tts.rules"].indexOf(full_key) !== -1) {
		const rules = (full_key === "settings") ? action.payload.tts.rules : action.payload;

		TTSService.updateRules(rules);
	}

	if (["settings", "settings.spells_mode.ui.use"].indexOf(full_key) !== -1) {
		if (!new_state.settings.spells_mode.ui.use) {
			document.getElementsByTagName("body")[0].classList.remove("white-background");
		}
	}

	if (["settings", "settings.spells_mode.ui.sections", "settings.spells_mode.ui.use"].indexOf(full_key) !== -1) {
		new_state.internal.spells.allowed_types = GameDataProcessor.getAllowedSpellTypes(new_state);
	}

	if (
		[
			"settings",
			"internal.character_job",
			"internal.character_level",
			"internal.current_zone_id",
			"settings.spells_mode.spells",
			"settings.spells_mode.effects",
			"settings.spells_mode.dots",
			"settings.spells_mode.debuffs",
			"settings.spells_mode.party_spells",
			"settings.spells_mode.party_effects",
			"settings.spells_mode.party_dots",
			"settings.spells_mode.party_debuffs",
			"settings.spells_mode.always_skill",
			"settings.spells_mode.always_effect",
			"settings.spells_mode.always_dot",
			"settings.spells_mode.always_debuff",
		].indexOf(full_key) !== -1
	) {
		let reset = false;

		if (
			(full_key === "internal.character_level" && state.internal.character_level !== new_state.internal.character_level) ||
			(full_key === "internal.character_job" && state.internal.character_job !== new_state.internal.character_job)
		) {
			reset = true;
		}

		if (full_key === "internal.current_zone_id" && !reset) {
			const old_is_pvp = (PVPZoneData.Zones.indexOf(state.internal.current_zone_id) !== -1);
			const new_is_pvp = (PVPZoneData.Zones.indexOf(new_state.internal.current_zone_id) !== -1);

			if (old_is_pvp === new_is_pvp) {
				return new_state;
			}

			reset = true;
		}

		updateSpells(new_state, reset);
	}

	if (full_key === "internal.character_id") {
		new_state.plugin_service.getCombatants();
	}

	return new_state;
}

function updateSpells(state, reset) {
	if (reset) {
		SpellService.resetAllSpells();

		state.internal.spells.defaulted = {};
		state.internal.spells.in_use    = {};
	}

	SpellService.updateValidNames(state);
	SpellService.injectDefaults(state);
}

export default rootReducer;
