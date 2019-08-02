import React from "react";
import { Icon } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";

class IconButton extends React.Component {
	componentDidMount() {
		ReactTooltip.rebuild();
	}

	render() {
		let additional_class = this.props.class || "";

		return (
			<div className={"icon-container " + additional_class}>
				<Icon name={this.props.icon} alt={this.props.title} data-tip={this.props.title} title={this.props.title} onClick={this.props.onClick}/>
			</div>
		);
	}
}

export default IconButton;