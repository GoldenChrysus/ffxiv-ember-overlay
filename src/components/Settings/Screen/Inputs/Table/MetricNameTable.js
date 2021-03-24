import React from "react";
import { Button, Select, Input } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";

class MetricNameTable extends Table {
	componentWillMount() {
		let rows = {
			_insert : this.createRow({insert: true})
		};

		for (let metric_key in this.props.value) {
			let value_data = this.props.value[metric_key];
			let short_name = value_data.short;
			let long_name  = value_data.long;

			rows[metric_key] = this.createRow({
				select_text  : LocalizationService.getPlayerDataTitle(metric_key, "long", true),
				select_value : metric_key,
				short_name   : short_name,
				long_name    : long_name
			});

			this.data.value[metric_key] = {
				short : short_name,
				long  : long_name
			};
		}

		this.setState({
			rows : rows
		});
	}

	render() {
		let rows = (this.state && this.state.rows)
			? Object.keys(this.state.rows).map(key => this.state.rows[key])
			: [];

		return(
			<table key="metric-name-table" ref="metric_name_table" className="ui unstackable inverted celled table">
				<thead>
					<tr>
						<th>{LocalizationService.getMisc("metric")}</th>
						<th>{LocalizationService.getMisc("short_name")}</th>
						<th>{LocalizationService.getMisc("long_name")}</th>
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
		let row    = (
			<tr id="insert-row" key={"metric-key-" + (options.select_value || "_insert")} data-key={options.select_value}>
				<td>{select}</td>
				<td><Input fluid key_path="short_name" defaultValue={options.short_name} onChange={this.handleInputChange.bind(this)}/></td>
				<td><Input fluid key_path="long_name" defaultValue={options.long_name} onChange={this.handleInputChange.bind(this)}/></td>
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
			short_name   : $row.find("div[key_path=short_name] > input").val(),
			long_name    : $row.find("div[key_path=long_name] > input").val(),
			auto_add     : true
		};

		if (!options.select_value) {
			return false;
		}

		this.data.value[options.select_value] = {
			short : options.short_name,
			long  : options.long_name
		};

		this.createRow(options);
		this.syncData();
	}
}

export default MetricNameTable;