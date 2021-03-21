import React from "react";
import $ from "jquery";

import LocalizationService from "../../../../services/LocalizationService";

class Table extends React.Component {
	constructor(props) {
		super(props);

		this.data        = {
			key_path : this.props.key_path,
			value    : {}
		};
		this.delete_text = LocalizationService.getMisc("delete");
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

export default Table;