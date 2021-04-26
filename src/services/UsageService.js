class UsageService {
	getMetricsInUse(settings) {
		return []
			.concat(settings.getSetting("table_columns.dps"))
			.concat(settings.getSetting("table_columns.heal"))
			.concat(settings.getSetting("table_columns.tank"))
			.concat(settings.getSetting("table_columns.raid.dps"))
			.concat(settings.getSetting("table_columns.raid.heal"))
			.concat(settings.getSetting("table_columns.raid.tank"))
			.concat(settings.getSetting("sort_columns.dps"))
			.concat(settings.getSetting("sort_columns.heal"))
			.concat(settings.getSetting("sort_columns.tank"))
			.concat(settings.getSetting("sort_columns.raid"))
			.concat(settings.getSetting("detail_data.dps"))
			.concat(settings.getSetting("detail_data.heal"))
			.concat(settings.getSetting("detail_data.tank"));
	}

	usingCombatData(mode, settings) {
		return (
			mode === "stats" ||
			settings.getSetting("spells_mode.ui.use") ||
			settings.getSetting("spells_mode.party_spells").length ||
			settings.getSetting("spells_mode.party_effects").length ||
			settings.getSetting("spells_mode.party_dots").length
		);
	}

	usingLog(mode, settings) {
		return (mode === "spells" || this.usingLogTTS(settings));
	}

	usingLogTTS(settings) {
		return (
			settings.getSetting("tts.rules.critical.dps") ||
			settings.getSetting("tts.rules.critical.heal") ||
			settings.getSetting("tts.rules.critical.tank") ||
			settings.getSetting("tts.rules.critical.all")
		);
	}

	usingTopTTS(settings, type) {
		return settings.getSetting(`tts.rules.top.${type}`);
	}

	usingTopDPSTTS(settings) {
		return this.usingTopTTS(settings, "dps");
	}

	usingTopHPSTTS(settings) {
		return this.usingTopTTS(settings, "hps");
	}

	usingTopTPSTTS(settings) {
		return this.usingTopTTS(settings, "tps");
	}

	usingAggroTTS(settings) {
		return settings.getSetting("tts.rules.aggro");
	}

	usingEncounterTTS(settings, type) {
		return settings.getSetting(`tts.rules.encounter.${type}`);
	}

	usingEnmity(settings) {
		return (this.getMetricsInUse(settings).indexOf("enmity_percent") !== -1);
	}

	usingMaxDPS(settings) {
		return (this.getMetricsInUse(settings).indexOf("max_enc_dps") !== -1);
	}
}

export default new UsageService();