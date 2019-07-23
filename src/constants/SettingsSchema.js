import Constants from "./index";

let table_column_options = [];

for (let data_key in Constants.PlayerDataTitles) {
	let data = Constants.PlayerDataTitles[data_key];

	table_column_options.push({
		key   : data_key,
		value : data_key,
		text  : data.long
	});
}

const SettingsSchema = {
	sections : [
		{
			title    : "Interface",
			path     : "interface",
			sections : []
		},
		{
			title    : "Player Table",
			path     : "player-table",
			sections : [
				{
					title    : "DPS",
					settings : [
						{
							key_path : "table_columns.dps",
							label    : "Table Columns",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.dps;
							}
						},
						{
							key_path : "sort_columns.dps",
							label    : "Default Sort Column",
							type     : "select",
							multiple : false,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.sort_columns.dps;
							}
						}
					]
				},
				{
					title    : "Heal",
					settings : [
						{
							key_path : "table_columns.heal",
							label    : "Table Columns",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.heal;
							}
						},
						{
							key_path : "sort_columns.heal",
							label    : "Default Sort Column",
							type     : "select",
							multiple : false,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.sort_columns.heal;
							}
						}
					]
				},
				{
					title    : "Tank",
					settings : [
						{
							key_path : "table_columns.tank",
							label    : "Table Columns",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.tank;
							}
						},
						{
							key_path : "sort_columns.tank",
							label    : "Default Sort Column",
							type     : "select",
							multiple : false,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.sort_columns.tank;
							}
						}
					]
				}
			]
		},
		{
			title    : "Player Detail",
			path     : "player-detail",
			sections : [
				{
					title    : "DPS",
					settings : [
						{
							key_path : "detail_data.dps",
							label    : "Player Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.detail_data.dps;
							}
						}
					]
				},
				{
					title    : "Heal",
					settings : [
						{
							key_path : "detail_data.heal",
							label    : "Player Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.detail_data.heal;
							}
						}
					]
				},
				{
					title    : "Tank",
					settings : [
						{
							key_path : "detail_data.tank",
							label    : "Player Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.detail_data.tank;
							}
						}
					]
				}
			]
		},
		{
			title    : "Raid View",
			path     : "raid-view",
			sections : [
				{
					title    : "General",
					settings : [
						{
							key_path : "sort_columns.dps",
							label    : "Default Sort Metric",
							type     : "select",
							multiple : false,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.sort_columns.raid;
							}
						}
					]
				},
				{
					title    : "DPS",
					settings : [
						{
							key_path : "table_columns.raid.dps",
							label    : "Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.raid.dps;
							}
						}
					]
				},
				{
					title    : "Heal",
					settings : [
						{
							key_path : "table_columns.raid.heal",
							label    : "Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.raid.heal;
							}
						}
					]
				},
				{
					title    : "Tank",
					settings : [
						{
							key_path : "table_columns.raid.tank",
							label    : "Metrics",
							type     : "select",
							multiple : true,
							search   : true,
							options  : table_column_options,
							values   : function() {
								return this.props.settings.table_columns.raid.tank;
							}
						}
					]
				}
			]
		},
		{
			title    : "Custom CSS",
			path     : "custom-css",
			sections : []
		}
	]
}

export default SettingsSchema;