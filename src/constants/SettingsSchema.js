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
			title    : "Raid View",
			path     : "raid-view",
			sections : []
		},
		{
			title    : "Custom CSS",
			path     : "custom-css",
			sections : []
		}
	]
}

export default SettingsSchema;