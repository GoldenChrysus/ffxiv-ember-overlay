import React from "react";
import { Header, Form, Select, TextArea, Checkbox } from "semantic-ui-react";

class Section extends React.Component {
	render() {
		let settings = [];

		for (let setting_data of this.props.data.settings) {
			let setting;

			let label = (setting_data.label) ? <label>{setting_data.label}</label> : "";
			let value = (typeof setting_data.value === "function") ? setting_data.value.call(this) : setting_data.value;

			switch (setting_data.type) {
				case "select":
					if (!value) {
						value = [];
					}

					setting = <Select fluid labeled multiple={setting_data.multiple || false} search={setting_data.search || false}
						options={setting_data.options}
						defaultValue={value}
						key_path={setting_data.key_path}
						onChange={this.props.changeCallback}/>;

					break;

				case "textarea":
					setting = <TextArea defaultValue={value} key_path={setting_data.key_path} rows={20} onChange={this.props.changeCallback}/>;

					break;

				case "checkbox":
					setting = <Checkbox label={label} defaultChecked={value} key_path={setting_data.key_path} onChange={this.props.changeCallback}/>
					label   = "";

				default:
					break;
			}

			settings.push(
				<Form.Field inline key={setting_data.key_path}>
					{label}
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