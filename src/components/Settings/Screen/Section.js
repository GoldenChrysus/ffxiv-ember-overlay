import React from "react";
import { Header, Form, Select, Input, TextArea, Checkbox } from "semantic-ui-react";
import Editor from "react-simple-code-editor";

import LocalizationService from "../../../services/LocalizationService";

import Slider from "./Inputs/Slider";

class Section extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	getSettingValue(setting_data) {
		return (typeof setting_data.value === "function") ? setting_data.value.call(this, this) : setting_data.value;
	}

	componentWillMount() {
		let state_data = {};

		for (let setting_data of this.props.data.settings) {
			let value = this.getSettingValue(setting_data);

			state_data[setting_data.key_path] = value;
		}

		this.setState(state_data);
	}

	render() {
		let settings = [];
		let language = this.props.settings.interface.language;

		for (let setting_data of this.props.data.settings) {
			let setting;

			let label_text = LocalizationService.getSettingText(setting_data.key_path) || "";
			let label      = (label_text) ? <label>{label_text}</label> : "";
			let value      = this.getSettingValue(setting_data);

			switch (setting_data.type) {
				case "select":
					if (!value) {
						value = [];
					}

					let options = (typeof setting_data.options === "function") ? setting_data.options() : setting_data.options;

					setting = <Select fluid labeled multiple={setting_data.multiple || false} search={setting_data.search || false}
						options={options}
						defaultValue={value}
						key_path={setting_data.key_path}
						onChange={this.props.changeCallback}/>;

					break;

				case "textbox":
					setting = <Input defaultValue={value} key_path={setting_data.key_path} onChange={this.props.changeCallback}/>;

					break;

				case "textarea":
					setting = <TextArea defaultValue={value} key_path={setting_data.key_path} rows={20} onChange={this.props.changeCallback}/>;

					break;

				case "code":
					let key_path = setting_data.key_path;

					setting = <Editor
						className="code"
						value={this.state[key_path]}
						key_path={setting_data.key_path}
						onValueChange={(code) => {
							this.props.changeCallback({}, {key_path : setting_data.key_path, value : code});

							let state_data = {};

							state_data[key_path] = code;

							this.setState(state_data);
						}}
						highlight={code => code}/>;

					break;

				case "checkbox":
					setting = <Checkbox toggle label={label} defaultChecked={value} key_path={setting_data.key_path} onChange={this.props.changeCallback}/>;
					label   = "";

					break;

				case "slider":
					let range = setting_data.range || "min";
					let min   = setting_data.minimum || 0;
					let max   = setting_data.maximum || 100;

					label = <label>{label_text}: <span className="value">{value}</span></label>;

					setting = <Slider range={range} minimum={min} maximum ={max} key_path={setting_data.key_path} value={value} onChange={this.props.changeCallback}/>;

					break;

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
				<Header as="h2">{LocalizationService.getSettingsSubsectionText(this.props.parent_path, this.props.index)}</Header>
				<div>
					{settings}
				</div>
			</React.Fragment>
		);
	}
}

export default Section;