import React from "react";
import { Icon } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";

class IconButton extends React.Component {
	componentDidMount() {
		ReactTooltip.rebuild();
	}

	render() {
		let additional_class = this.props.class || "";
		let icon             = <Icon name={this.props.icon} alt={this.props.title} data-tip={this.props.title} title={this.props.title} onClick={this.props.onClick}/>;

		return (
			(this.props.no_container)
				? icon
				: <div className={"icon-container " + additional_class}>
					{icon}
				</div>
		);
	}
}

export default IconButton;