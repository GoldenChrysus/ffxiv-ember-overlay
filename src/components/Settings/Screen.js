import React from "react";
import { connect } from "react-redux";
import { updateSetting } from "../../redux/actions/index";
import { Container, Form, Button } from "semantic-ui-react";

import Section from "./Screen/Section";

class Screen extends React.Component {
	render() {
		let sections = [];

		for (let i in this.props.sections) {
			let section_data = this.props.sections[i];
			
			sections.push(
				<Container fluid key={section_data.title} className="section-container">
					<Section data={section_data} settings={this.props.settings} changeCallback={this.handleChange.bind(this)}/>
				</Container>
			)
		}

		return(
			<Form>
				<Button floated="right" className="save" onClick={this.handleSave.bind(this)}>Save</Button>
				{sections}
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