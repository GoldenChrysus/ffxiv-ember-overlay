import React from "react";
import { Button, Select, Input } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../../services/LocalizationService";

class MetricNameTable extends React.Component {
	data = {
		key_path : this.props.key_path,
		value    : {}
	};

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
		let rows = (this.state && this.state.rows) ? Object.values(this.state.rows) : [];

		return(
			<table key="metric-name-table" ref="metric_name_table" className="ui unstackable inverted celled table">
				<thead>
					<tr>
						<th>Metric</th>
						<th>Short Name</th>
						<th>Long Name</th>
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
			? <Button onClick={this.handleAdd.bind(this)}>Add</Button>
			: <Button onClick={this.handleDelete.bind(this)}>Delete</Button>;
		let select = (!options.insert)
			? options.select_text
			: <Select fluid search options={this.props.options} onChange={this.handleSelectChange}/>;
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

	handleSelectChange(e, data) {
		let $row    = $(document).find("#insert-row");
		let $target = (e.currentTarget.tagName === "DIV") ? $(e.currentTarget) : $row.find(".active.selected.item");
		let $select = $target.closest(".ui.dropdown");

		$select
			.attr("data-value", data.value)
			.attr("data-text", $target.text());
	}

	handleInputChange(e) {
		let $this = $(e.currentTarget);
		let $row  = $this.closest("tr[data-key]");

		if (!$row.length) {
			return true;
		}

		let input_key = $this.closest(".ui.input").attr("key_path").split("_")[0];
		let row_key   = $row.attr("data-key");

		if (row_key === "_insert") {
			return true;
		}

		this.data.value[row_key][input_key] = $this.val();

		this.syncData();
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

	handleDelete(e) {
		let key  = $(e.currentTarget).closest("tr").attr("data-key");
		let rows = this.state.rows;

		delete rows[key];
		delete this.data.value[key];

		this.setState({
			rows : rows
		});
		this.syncData();
	}

	syncData() {
		this.props.onChange(undefined, this.data);
	}
}

export default MetricNameTable;