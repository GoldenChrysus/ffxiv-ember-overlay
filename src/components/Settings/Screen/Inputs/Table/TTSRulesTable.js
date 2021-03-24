import React from "react";
import { Button, Select, Input } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";

class TTSRulesTable extends Table {
	rule_data_types = {
		aggro     : {
			type : "bool"
		},
		critical  : {
			type : "numeric",
			min  : 0,
			max  : 100
		},
		encounter : {
			type : "bool"
		},
		top       : {
			type : "bool"
		}
	};

	constructor(props) {
		super(props);
		this.provideDataTypes(this.rule_data_types);
	}

	componentWillMount() {
		let rows = Object.assign(
			{
				_insert : this.createRow({insert: true})
			},
			this.buildRows()
		);

		this.setState({
			rows : rows
		});
	}

	render() {
		let rows = (this.state && this.state.rows)
			? Object.keys(this.state.rows).map(key => this.state.rows[key])
			: [];

		return(
			<table key="tts-rules-table" ref="tts_rules_table" className="ui unstackable inverted celled table">
				<thead>
					<tr>
						<th>Criteria</th>
						<th>Value</th>
						<th className="collapsing"></th>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}

	createRow(options) {
		let button = (options.insert)
			? <Button onClick={this.handleAdd.bind(this)}>{LocalizationService.getMisc("add")}</Button>
			: <Button onClick={this.handleDelete.bind(this)}>{this.delete_text}</Button>;
		let select = (!options.insert)
			? options.select_text
			: <Select fluid search options={this.props.options} onChange={this.handleSelectChange.bind(this)}/>;
		let input  = (options.rule_value === true)
			? ""
			: <Input fluid className="rule-value disablable-input" key_path={options.rule_key} defaultValue={options.rule_value} onChange={this.handleInputChange.bind(this)} label={{content: "%"}} labelPosition="right"/>;
		let row    = (
			<tr id="insert-row" key={"metric-key-" + (options.select_value || "_insert")} data-key={options.rule_type} data-select-value={options.select_value}>
				<td>{select}</td>
				<td>{input}</td>
				<td>{button}</td>
			</tr>
		);

		if (!options.auto_add) {
			return row;
		}

		let rows = this.state.rows;

		rows[options.select_value] = row;

		this.setState({
			rows : rows
		});
	}

	handleAdd(e) {
		let $target = $(e.currentTarget);
		let $row    = $target.closest("tr");
		let $select = $row.find(".ui.dropdown");
		let options = {
			select_value : $select.attr("data-value"),
			select_text  : $select.attr("data-text"),
			rule_value   : $row.find("div.rule-value > input").val(),
			auto_add     : true
		};

		let rule_data = options.select_value.split(".");

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
		let rules = this.props.value;
		let rows  = {};

		for (let rule_type in rules) {
			switch (rule_type) {
				case "critical":
				case "top":
				case "encounter":
					if (!this.data.value[rule_type]) {
						this.data.value[rule_type] = {};
					}

					for (let rule_key in rules[rule_type]) {
						let value = rules[rule_type][rule_key];

						this.data.value[rule_type][rule_key] = value;
			
						if (!value) {
							continue;
						}
			
						let key = `${rule_type}.${rule_key}`;
			
						rows[key] = this.createRow({
							select_text  : "na", //this.props.options[key].text,
							select_value : key,
							rule_type    : rule_type,
							rule_key     : rule_key,
							rule_value   : value
						});
					}

					break;

				case "aggro":
					let value = rules[rule_type];

					this.data.value[rule_type] = value;

					if (!value) {
						continue;
					}

					rows[rule_type] = this.createRow({
						select_text  : "ag", // this.props.options.aggro.text,
						select_value : rule_type,
						rule_type    : rule_type,
						rule_key     : "",
						rule_value   : rules[rule_type]
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