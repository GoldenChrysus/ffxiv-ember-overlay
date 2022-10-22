import React from "react";
import clone from "lodash.clonedeep";
import $ from "jquery";

import LocalizationService from "../../../../services/LocalizationService";

class Table extends React.Component {
	data_types = {};

	constructor(props) {
		super(props);

		this.data = {
			key_path : this.props.key_path,
			value    : {},
		};
		this.delete_text = LocalizationService.getMisc("delete");
	}

	provideDataTypes(types) {
		this.data_types = types;
	}

	handleSelectChange(e, data) {
		const $row    = $(document).find("#insert-row");
		const $target = (e.currentTarget.tagName === "DIV") ? $(e.currentTarget) : $row.find(".active.selected.item");
		const $select = $target.closest(".ui.dropdown");
		const type    = data.value.split(".")[0];

		if (this.data_types[type]) {
			const data_type = this.data_types[type].type;
			const disabled  = (data_type === "bool");
			const $inputs   = $select
				.closest("tr")
				.find(".disablable-input > input");

			$inputs.attr("disabled", disabled);

			if (disabled) {
				$inputs
					.val("")
					.trigger("change");
			}
		}

		$select
			.attr("data-value", data.value)
			.attr("data-text", $target.text());
	}

	handleInputChange(e) {
		const $this = $(e.currentTarget);
		const $row  = $this.closest("tr[data-key]");

		if (!$row.length) {
			return true;
		}

		const input_key = $this.closest(".ui.input").attr("key_path").split("_")[0];
		const row_key   = $row.attr("data-key");

		if (row_key === "_insert") {
			return true;
		}

		let value = $this.val();

		if (this.data_types[row_key]) {
			value = this.normalizeData(row_key, value, true);
		}

		if (input_key) {
			this.data.value[row_key][input_key] = value;
		} else {
			this.data.value[row_key] = value;
		}

		this.syncData();
	}

	handleDelete(e) {
		const key      = this.getDeleteKey(e);
		const rows     = clone(this.state.rows);
		const key_data = key.split(".");

		delete rows[key];

		if (key_data.length === 2) {
			delete this.data.value[key_data[0]][key_data[1]];
		} else {
			delete this.data.value[key];
		}

		this.setState({
			rows,
		});
		this.syncData();
	}

	getDeleteKey(e) {
		return $(e.currentTarget).closest("tr").attr("data-select-value");
	}

	syncData() {
		this.props.onChange(undefined, this.data);
	}

	normalizeData(key, value, revert_on_bad) {
		const data_type = this.data_types[key];
		let new_value;

		switch (data_type.type) {
			case "numeric":
				if (isNaN(value)) {
					new_value = undefined;
				}

				new_value = Number(value);

				if (
					("min" in data_type && new_value < data_type.min) ||
					("max" in data_type && new_value > data_type.max)
				) {
					new_value = undefined;
				}

				break;

			case "bool":
				new_value = true;

				break;

			default:
				new_value = value;

				break;
		}

		return (revert_on_bad && new_value === undefined) ? value : new_value;
	}
}

export default Table;
