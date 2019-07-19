import React from "react";
import $ from "jquery";

class Toggle extends React.Component {
	togglePlaceholders() {
		let $container = $(document).find("#container");
		let self       = this;

		$(document).find(".placeholder").each(function() {
			let hidden = (!$(this).hasClass(self.props.type));

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