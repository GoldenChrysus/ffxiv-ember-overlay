import React from "react";
import $ from "jquery";

import LocalizationService from "../../../../services/LocalizationService";

class Table extends React.Component {
	data_types = {};

	constructor(props) {
		super(props);

		this.data        = {
			key_path : this.props.key_path,
			value    : {}
		};
		this.delete_text = LocalizationService.getMisc("delete");
	}

	provideDataTypes(types) {
		this.data_types = types;
	}

	handleSelectChange(e, data) {
		let $row    = $(document).find("#insert-row");
		let $target = (e.currentTarget.tagName === "DIV") ? $(e.currentTarget) : $row.find(".active.selected.item");
		let $select = $target.closest(".ui.dropdown");
		let type    = data.value.split(".")[0];

		if (this.data_types[type]) {
			let data_type = this.data_types[type].type;
			let disabled  = (data_type === "bool");
			let $inputs   = $select
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
		let key      = $(e.currentTarget).closest("tr").attr("data-select-value") || $(e.currentTarget).closest("tr").attr("data-key");
		let rows     = this.state.rows;
		let key_data = key.split(".");

		delete rows[key];

		if (key_data.length === 2) {
			delete this.data.value[key_data[0]][key_data[1]];
		} else {
			delete this.data.value[key];
		}

		this.setState({
			rows : rows
		});
		this.syncData();
	}

	syncData() {
		this.props.onChange(undefined, this.data);
	}

	normalizeData(key, value, revert_on_bad) {
		let data_type = this.data_types[key];
		let new_value = undefined;

		switch (data_type.type) {
			case "numeric":
				if (isNaN(value)) {
					new_value = undefined;
				}

				new_value = +value;

				if (
					(data_type.hasOwnProperty("min") && new_value < data_type.min) ||
					(data_type.hasOwnProperty("max") && new_value > data_type.max)
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