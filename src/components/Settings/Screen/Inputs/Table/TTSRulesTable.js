import React from "react";
import { Button, Select, Input } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";

class TTSRulesTable extends Table {
	rule_data_types = {
		aggro : {
			type : "bool",
		},
		critical_hp : {
			type : "numeric",
			min  : 0,
			max  : 100,
		},
		critical_mp : {
			type : "numeric",
			min  : 0,
			max  : 100,
		},
		encounter : {
			type : "bool",
		},
		top : {
			type : "bool",
		},
	};

	constructor(props) {
		super(props);
		this.provideDataTypes(this.rule_data_types);
	}

	UNSAFE_componentWillMount() {
		const rows = {
			_insert : this.createRow({ insert : true }),
			...this.buildRows(),
		};

		this.setState({
			rows,
		});
	}

	render() {
		const rows = (this.state && this.state.rows)
			? Object.keys(this.state.rows).map(key => this.state.rows[key])
			: [];

		return (
			<table key='tts-rules-table' ref='tts_rules_table' className='ui unstackable inverted celled table'>
				<thead>
					<tr>
						<th>{LocalizationService.getMisc("criteria")}</th>
						<th>{LocalizationService.getMisc("value")}</th>
						<th className='collapsing'></th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}

	createRow(options) {
		const button = (options.insert)
			? <Button onClick={this.handleAdd.bind(this)}>{LocalizationService.getMisc("add")}</Button>
			: <Button onClick={this.handleDelete.bind(this)}>{this.delete_text}</Button>;
		const select = (!options.insert)
			? options.select_text
			: <Select fluid search options={this.props.options} onChange={this.handleSelectChange.bind(this)}/>;
		const input  = (options.rule_value === true)
			? ""
			: <Input fluid className='rule-value disablable-input' key_path={options.rule_key} defaultValue={options.rule_value} onChange={this.handleInputChange.bind(this)} label={{ content : "%" }} labelPosition='right'/>;
		const row    = (
			<tr id='insert-row' key={"metric-key-" + (options.select_value || "_insert")} data-key={options.rule_type} data-select-value={options.select_value}>
				<td>{select}</td>
				<td>{input}</td>
				<td>{button}</td>
			</tr>
		);

		if (!options.auto_add) {
			return row;
		}

		const rows = this.state.rows;

		rows[options.select_value] = row;

		this.setState({
			rows,
		});
	}

	handleAdd(e) {
		const $target = $(e.currentTarget);
		const $row    = $target.closest("tr");
		const $select = $row.find(".ui.dropdown");
		const options = {
			select_value : $select.attr("data-value"),
			select_text  : $select.attr("data-text"),
			rule_value   : $row.find("div.rule-value > input").val(),
			auto_add     : true,
		};

		const rule_data = options.select_value.split(".");

		options.rule_type = rule_data[0];
		options.rule_key  = rule_data[1] || "";

		if (!options.select_value) {
			return false;
		}

		options.rule_value = this.normalizeData(options.rule_type, options.rule_value);

		if (options.rule_value === undefined) {
			return false;
		}

		if (options.rule_key) {
			this.data.value[options.rule_type][options.rule_key] = options.rule_value;
		} else {
			this.data.value[options.rule_type] = options.rule_value;
		}

		this.createRow(options);
		this.syncData();
	}

	buildRows() {
		const rules = this.props.value;
		const rows  = {};

		for (const rule_type in rules) {
			switch (rule_type) {
				case "critical_hp":
				case "critical_mp":
				case "top":
				case "encounter":
					if (!this.data.value[rule_type]) {
						this.data.value[rule_type] = {};
					}

					for (const rule_key in rules[rule_type]) {
						const value = rules[rule_type][rule_key];

						this.data.value[rule_type][rule_key] = value;

						if (!value) {
							continue;
						}

						const key = `${rule_type}.${rule_key}`;

						rows[key] = this.createRow({
							select_text  : LocalizationService.getTTSRuleTitle(key),
							select_value : key,
							rule_type,
							rule_key,
							rule_value   : value,
						});
					}

					break;

				case "aggro":
					const value = rules[rule_type];

					this.data.value[rule_type] = value;

					if (!value) {
						continue;
					}

					rows[rule_type] = this.createRow({
						select_text  : LocalizationService.getTTSRuleTitle(rule_type),
						select_value : rule_type,
						rule_type,
						rule_key     : "",
						rule_value   : rules[rule_type],
					});

					break;

				default:
					break;
			}
		}

		return rows;
	}
}

export default TTSRulesTable;
