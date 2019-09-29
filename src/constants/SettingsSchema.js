import LocalizationService from "../services/LocalizationService";

const language_options = [
	{
		key   : "en",
		value : "en",
		text  : "English"
	},
	{
		key   : "cn",
		value : "cn",
		text  : "中文"
	},
	{
		key   : "de",
		value : "de",
		text  : "Deutsch"
	},
	{
		key   : "jp",
		value : "jp",
		text  : "日本語"
	},
	{
		key   : "pt",
		value : "pt",
		text  : "Português"
	}
];
const decimal_options  = [
	{
		key   : "0",
		value : "0",
		text  : "0"
	},
	{
		key   : "1",
		value : 1,
		text  : "1"
	},
	{
		key   : "2",
		value : 2,
		text  : "2"
	},
];

const SettingsSchema = {
	sections : [
		{
			path     : "interface",
			sections : [
				{
					settings : [
						{
							key_path : "interface.language",
							type     : "select",
							options  : language_options,
							value    : obj => obj.props.settings.interface.language
						},
						{
							key_path : "interface.player_name",
							type     : "textbox",
							value    : function() {
								return this.props.settings.interface.player_name;
							}
						},
						{
							key_path : "interface.opacity",
							type     : "slider",
							range    : "min",
							minimum  : 0,
							maximum  : 100,
							value    : function() {
								return this.props.settings.interface.opacity;
							}
						},
						{
							key_path : "interface.zoom",
							type     : "slider",
							range    : "min",
							minimum  : 1,
							maximum  : 500,
							value    : function() {
								return this.props.settings.interface.zoom;
							}
						},
						{
							key_path : "interface.top_right_rank",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.top_right_rank;
							}
						},
						{
							key_path : "interface.blur_job_icons",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.blur_job_icons;
							}
						},
						{
							key_path : "interface.collapse_down",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.collapse_down;
							}
						},
						{
							key_path : "interface.footer_when_collapsed",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.footer_when_collapsed;
							}
						},
						{
							key_path : "interface.footer_dps",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.footer_dps;
							}
						},
						{
							key_path : "interface.decimal_accuracy",
							type     : "select",
							options  : decimal_options,
							value    : function() {
								return this.props.settings.interface.decimal_accuracy;
							}
						},
						{
							key_path : "interface.shorten_thousands",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.shorten_thousands;
							}
						},
						{
							key_path : "interface.light_theme",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.interface.light_theme;
							}
						}
					]
				}
			]
		},
		{
			path     : "player-table",
			sections : [
				{
					settings : [
						{
							key_path : "table_settings.general.table.short_names",
							type     : "select",
							options  : () => LocalizationService.getPlayerShortNameOptions(),
							value    : function() {
								return this.props.settings.table_settings.general.table.short_names;
							}
						},
						{
							key_path : "table_settings.general.table.footer_at_top",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.general.table.footer_at_top;
							}
						},
						{
							key_path : "table_settings.general.table.percent_bars",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.general.table.percent_bars;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.dps",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.dps;
							}
						},
						{
							key_path : "sort_columns.dps",
							type     : "select",
							multiple : false,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.sort_columns.dps;
							}
						},
						{
							key_path : "table_settings.dps.show_footer",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.dps.show_footer;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.heal",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.heal;
							}
						},
						{
							key_path : "sort_columns.heal",
							type     : "select",
							multiple : false,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.sort_columns.heal;
							}
						},
						{
							key_path : "table_settings.heal.show_footer",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.heal.show_footer;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.tank",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.tank;
							}
						},
						{
							key_path : "sort_columns.tank",
							type     : "select",
							multiple : false,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.sort_columns.tank;
							}
						},
						{
							key_path : "table_settings.tank.show_footer",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.tank.show_footer;
							}
						}
					]
				}
			]
		},
		{
			path     : "player-detail",
			sections : [
				{
					settings : [
						{
							key_path : "detail_data.dps",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.detail_data.dps;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "detail_data.heal",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.detail_data.heal;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "detail_data.tank",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.detail_data.tank;
							}
						}
					]
				}
			]
		},
		{
			path     : "raid-view",
			sections : [
				{
					settings : [
						{
							key_path : "sort_columns.raid",
							type     : "select",
							multiple : false,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.sort_columns.raid;
							}
						},
						{
							key_path : "table_settings.general.raid.short_names",
							type     : "select",
							options  : () => LocalizationService.getPlayerShortNameOptions(),
							value    : function() {
								return this.props.settings.table_settings.general.raid.short_names;
							}
						},
						{
							key_path : "table_settings.general.raid.percent_bars",
							type     : "checkbox",
							value    : function() {
								return this.props.settings.table_settings.general.raid.percent_bars;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.raid.dps",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.raid.dps;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.raid.heal",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.raid.heal;
							}
						}
					]
				},
				{
					settings : [
						{
							key_path : "table_columns.raid.tank",
							type     : "select",
							multiple : true,
							search   : true,
							options  : () => LocalizationService.getPlayerDataTitles(),
							value    : function() {
								return this.props.settings.table_columns.raid.tank;
							}
						}
					]
				}
			]
		},
		{
			path     : "custom-css",
			sections : [
				{
					settings : [
						{
							key_path : "custom.css",
							type     : "code",
							value    : function() {
								return this.props.settings.custom.css;
							}
						}
					]
				}
			]
		}
	]
}

export default SettingsSchema;