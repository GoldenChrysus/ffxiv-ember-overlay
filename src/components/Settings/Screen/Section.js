import React from "react";
import Constants from "../../../constants/index";
import { Container, Header, Form, Button, Label, Select, Dropdown } from "semantic-ui-react";

class Section extends React.Component {
	render() {
		let settings = [];

		for (let setting_data of this.props.data.settings) {
			let setting;

			switch (setting_data.type) {
				case "select":
					let values = (typeof setting_data.values === "function") ? setting_data.values.call(this) : setting_data.values;

					if (!values) {
						values = [];
					}

					let attributes = setting_data.attributes || "";

					setting = <Select fluid labeled multiple={setting_data.multiple || false} search={setting_data.search || false}
						options={setting_data.options}
						defaultValue={values}
						key_path={setting_data.key_path}
						onChange={this.props.changeCallback}/>
					break;

				default:
					break;
			}

			settings.push(
				<Form.Field inline key={setting_data.key_path}>
					<label>{setting_data.label}</label>
					{setting}
				</Form.Field>
			);
		}

		return(
			<React.Fragment>
				<Header as="h2">{this.props.data.title}</Header>
				<div>
					{settings}
				</div>
			</React.Fragment>
		);
	}
}

export default Section;