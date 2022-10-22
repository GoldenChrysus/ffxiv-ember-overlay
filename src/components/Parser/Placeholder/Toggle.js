import React from "react";
import $ from "jquery";

class Toggle extends React.Component {
	togglePlaceholders() {
		const $container = $(document).find("#container");
		const self       = this;

		$(document).find(".placeholder").each(function() {
			const hidden = (!$(this).hasClass(self.props.type));

			$(this).toggleClass("hidden", hidden);
		});

		$container.toggleClass("hidden", true);
	}

	render() {
		return (
			<div className={"toggle " + this.props.type} onClick={this.togglePlaceholders.bind(this)}></div>
		);
	}
}

export default Toggle;
