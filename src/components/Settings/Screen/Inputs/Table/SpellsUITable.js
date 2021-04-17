import React from "react";
import { Button, Select } from "semantic-ui-react";
import clone from "lodash.clonedeep";
import $ from "jquery";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";
import ObjectService from "../../../../../services/ObjectService";

class SpellsUITable extends Table {
	constructor(props) {
		super(props);

		this.spells_per_row_options = [{
			key   : -1,
			value : -1,
			text  : "Default"
		}];

		for (let i = 1; i <= 20; i++) {
			this.spells_per_row_options.push({
				key   : i,
				value : i,
				text  : i
			});
		}

		this.state = {
			rows    : {},
			_insert : {
				types  : [],
				layout : {
					layout         : "default",
					spells_per_row : -1
				}
			}
		};
	}

	componentWillMount() {
		let rows = {
			_insert : this.createRow({
				insert : true,
				layout : {
					layout         : "default",
					spells_per_row : -1
				}
			})
		};

		for (let uuid in this.props.value) {
			let data = this.props.value[uuid];

			rows[uuid] = this.createRow({
				key    : uuid,
				types  : data.types,
				layout : {
					layout         : data.layout.layout,
					spells_per_row : data.layout.spells_per_row
				},
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
						<th>{LocalizationService.getMisc("track")}</th>
						<th>{LocalizationService.getSettingText("spells_mode.layout")}</th>
						<th>{LocalizationService.getSettingText("spells_mode.spells_per_row")}</th>
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
		let row    = (
			<tr id="insert-row" key={"spells-ui-key-" + (options.key || "_insert")} data-key={options.key || "_insert"}>
				<td>
					<Select multiple search options={this.props.options} defaultValue={options.types} onChange={this.handleSelectChange.bind(this, "types")}/>
				</td>
				<td>
					<Select options={LocalizationService.getSpellLayoutOptions(true)} defaultValue={options.layout.layout || "default"} onChange={this.handleSelectChange.bind(this, "layout.layout")}/>
				</td>
				<td>
					<Select options={this.spells_per_row_options} defaultValue={options.layout.spells_per_row || -1} onChange={this.handleSelectChange.bind(this, "layout.spells_per_row")}/>
				</td>
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

	handleAdd() {
		let options = {
			types    : this.state._insert.types,
			layout   : {
				layout         : this.state._insert.layout.layout,
				spells_per_row : this.state._insert.layout.spells_per_row,
			},
			key      : null,
			auto_add : true
		};

		if (!options.types.length) {
			return false;
		}

		while (options.auto_add && (options.key === null || this.data.value[options.key])) {
			options.key = this.createUUID();
		}

		this.data.value[options.key] = {
			types  : options.types,
			layout : {
				x              : 0,
				y              : 0,
				width          : 300,
				height         : 300,
				layout         : options.layout.layout,
				spells_per_row : options.layout.spells_per_row,
			}
		};

		this.createRow(options);
		this.syncData();
	}

	handleSelectChange(field, e, select) {
		let value = select.value;
		let key   = this.getDeleteKey(e);

		if (key === "_insert") {
			let state = clone(this.state);

			ObjectService.setByKeyPath(state._insert, field, value);
			this.setState(state);
		} else {
			ObjectService.setByKeyPath(this.data.value[key], field, value);
			this.syncData();
		}
	}

	getDeleteKey(e) {
		return $(e.currentTarget).closest("tr").attr("data-key");
	}

	createUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0;

			// eslint-disable-next-line
			let v = (c === "x") ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}
}

export default SpellsUITable;