import React from "react";
import { connect } from "react-redux";
import { updateSettings } from "../../redux/actions/index";
import { Container, Form, Button } from "semantic-ui-react";

import Section from "./Screen/Section";

class Screen extends React.Component {
	componentWillMount() {
		this.setState({
			saving : false
		});
	}

	render() {
		let sections   = [];
		let save_class = (this.state.saving) ? "loading" : "";

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
				<Button floated="right" className={"save " + save_class} onClick={this.handleSave.bind(this)}>Save</Button>
				<div className="clear"></div>
				{sections}
			</Form>
		);
	}

	handleChange(e, data) {
		let key_path  = data.key_path;
		let new_value = data.value || data.checked;

		this.props.new_settings[key_path] = new_value;
	}

	handleSave() {
		this.setState({
			saving : true
		});

		let data = [];

		for (let key_path in this.props.new_settings) {
			data.push({
				key     : key_path,
				payload : this.props.new_settings[key_path]
			});
		}

		this.props.updateSettings({
			data   : data,
			source : "screen-component"
		});

		setTimeout(
			() => {
				this.setState({
					saving : false
				});
			},
			400
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateSettings : (data) => {
			dispatch(updateSettings(data));
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