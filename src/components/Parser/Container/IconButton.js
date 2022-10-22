import React from "react";
import { Icon } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";

class IconButton extends React.Component {
	componentDidMount() {
		ReactTooltip.rebuild();
	}

	render() {
		const icon_attributes  = {
			name       : this.props.icon,
			alt        : this.props.title,
			"data-tip" : this.props.title,
			title      : this.props.title,
		};

		if (this.props.no_container) {
			icon_attributes.onClick = this.props.onClick;
		}

		const additional_class = this.props.class || "";
		const icon             = <Icon {...icon_attributes}/>;

		return (
			(this.props.no_container) ?
				icon :
				<div className={"icon-container " + additional_class} onClick={this.props.onClick}>
					{icon}
				</div>
		);
	}
}

export default IconButton;
