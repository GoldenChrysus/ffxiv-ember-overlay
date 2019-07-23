import React from "react";
import { connect } from "react-redux";
import { updateSetting } from "../../redux/actions/index";
import Constants from "../../constants/index";
import { Container, Header, Form, Button, Label, Select, Dropdown } from "semantic-ui-react";
import clone from "lodash.clonedeep";

import ObjectService from "../../services/ObjectService";

class Screen extends React.Component {
	render() {
		let column_options = [];
		let values         = [];

		for (let data_key in Constants.PlayerDataTitles) {
			let data = Constants.PlayerDataTitles[data_key];

			column_options.push({
				key   : data_key,
				value : data_key,
				text  : data.long
			});
		}

		return(
			<Form>
				<Button floated="right" className="save" onClick={this.handleSave.bind(this)}>Save</Button>
				<Container fluid>
					<Header as="h2">DPS</Header>
					<div>
						<Form.Field inline>
							<label>Table Columns</label>
							<Select fluid multiple search labeled
								options={column_options}
								defaultValue={this.props.settings.table_columns.dps}
								key_path="table_columns.dps"
								onChange={this.handleChange.bind(this)}/>
						</Form.Field>
					</div>
				</Container>
			</Form>
		);
	}

	handleChange(e, data) {
		let key_path  = data.key_path;
		let new_value = data.value;

		this.props.new_settings[key_path] = new_value;
	}

	handleSave() {
		for (let key_path in this.props.new_settings) {
			this.props.updateSetting({
				key   : key_path,
				value : this.props.new_settings[key_path]
			});
		}
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateSetting : (data) => {
			dispatch(updateSetting(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		settings     : state.settings,
		new_settings : {}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Screen);