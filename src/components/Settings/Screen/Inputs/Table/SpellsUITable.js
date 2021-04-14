import React from "react";
import { Button, Select, Input } from "semantic-ui-react";
import $ from "jquery";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";

class SpellsUITable extends Table {
	componentWillMount() {
		let rows = {
			_insert : this.createRow({insert: true})
		};

		for (let uuid in this.props.value) {
			let data = this.props.value[uuid];

			rows[uuid] = this.createRow({
				select_value : data.types
			});

			this.data.value[uuid] = data;
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
			<table key="spells-ui-table" ref="spells_ui_table" className="ui unstackable inverted celled table">
				<thead>
					<tr>
						<th>Track</th>
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
		let select = <Select fluid multiple search options={this.props.options} onChange={this.handleSelectChange.bind(this)}/>;
		let row    = (
			<tr id="insert-row" key={"spells-ui-key-" + (options.key || "_insert")} data-key={options.key || "_insert"}>
				<td>{select}</td>
				<td>{button}</td>
			</tr>
		);

		if (!options.auto_add) {
			return row;
		}

		let rows = this.state.rows;

		rows[options.key] = row;

		this.setState({
			rows : rows
		});
	}

	handleAdd(e) {
		let $target = $(e.currentTarget);
		let $row    = $target.closest("tr");
		let $select = $row.find(".ui.dropdown");
		let options = {
			select_value : $select.attr("data-value"), // fix
			key          : null,
			auto_add     : true
		};

		while (options.auto_add && (options.key === null || this.data.value[options.key])) {
			options.key = this.createUUID();
		}

		if (!options.select_value.length) {
			return false;
		}

		this.data.value[options.key] = {
			types  : options.select_value,
			layout : {
				x      : 0,
				y      : 0,
				width  : 300,
				height : 300
			}
		};

		this.createRow(options);
		this.syncData();
	}

	getSelectValues(e) {

	}

	getDeleteKey(e) {
		return $(e.currentTarget).closest("tr").attr("data-key");
	}

	createUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0;
			let v = (c === "x") ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}
}

export default SpellsUITable;