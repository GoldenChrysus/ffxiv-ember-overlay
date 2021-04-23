import React from "react";
import { Button, Select } from "semantic-ui-react";
import clone from "lodash.clonedeep";
import $ from "jquery";
import Sortable from "sortablejs/modular/sortable.core.esm.js";

import LocalizationService from "../../../../../services/LocalizationService";
import Table from "../Table";
import ObjectService from "../../../../../services/ObjectService";

class SpellsUITable extends Table {
	constructor(props) {
		super(props);

		this.type_sort_data         = {};
		this.bound_sortable         = [];
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

	componentDidMount() {
		this.processSortable();
	}

	componentDidUpdate() {
		this.processSortable();
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
		let key      = options.key || "_insert";
		let button   = (options.insert)
			? <Button onClick={this.handleAdd.bind(this)}>{LocalizationService.getMisc("add")}</Button>
			: <Button onClick={this.handleDelete.bind(this)}>{this.delete_text}</Button>;
		let row      = (
			<tr id={"spells-ui-row-" + key} key={"spells-ui-key-" + key} data-key={key}>
				<td>
					<Select className="ui-table" data-uuid={key} multiple search options={this.props.options} defaultValue={options.types} onChange={this.handleSelectChange.bind(this, "types")}/>
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

	handleSelectChange(field, e, select, custom_value) {
		let value    = custom_value || select.value;
		let key      = this.getDeleteKey(e);
		let max_sort = 0;

		if (field === "types") {
			if (!this.type_sort_data[key]) {
				this.type_sort_data[key] = {};
			}

			for (let tmp_value in this.type_sort_data[key]) {
				if (value.indexOf(tmp_value) === -1) {
					delete this.type_sort_data[key][tmp_value];
					continue;
				}

				max_sort = Math.max(max_sort, this.type_sort_data[key][tmp_value]);
			}

			for (let tmp_value of value) {
				if (!this.type_sort_data[key][tmp_value]) {
					this.type_sort_data[key][tmp_value] = ++max_sort;
				}
			}

			value.sort((a, b) => {
				return (this.type_sort_data[key][a] < this.type_sort_data[key][b]) ? -1 : 1;
			});
		}

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
		return $(e.currentTarget || e.target).closest("tr").attr("data-key");
	}

	createUUID() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			let r = Math.random() * 16 | 0;

			// eslint-disable-next-line
			let v = (c === "x") ? r : (r & 0x3 | 0x8);

			return v.toString(16);
		});
	}

	processSortable() {
		for (let uuid in this.state.rows) {
			if (this.bound_sortable.indexOf(uuid) !== -1) {
				continue;
			}

			this.bindSortable(uuid);
		}
	}

	bindSortable(uuid) {
		Array.prototype.forEach.call(document.getElementById(`spells-ui-row-${uuid}`).querySelectorAll(".multiple.selection.ui-table"), (el) => {
			Sortable.create(
				el,
				{
					draggable: "a",
					onUpdate: (evt, originalEvent) => {
						let value = [];
						let uuid  = evt.target.getAttribute("data-uuid");

						Array.prototype.forEach.call(evt.target.getElementsByTagName("a"), (el) => {
							value.push($(el).attr("value"));
						});

						this.type_sort_data[uuid] = {};

						for (let i in value) {
							this.type_sort_data[uuid][value[i]] = i;
						}

						this.handleSelectChange("types", evt, undefined, value);
					}
				}
			);
		});
	}
}

export default SpellsUITable;