import React from "react";
import $ from "jquery";

class Placeholder extends React.Component {
	togglePlaceholders() {
		let $container = $(document).find("#container");
		let active     = $container.hasClass("hidden");

		$(document).find(".placeholder").each(function() {
			$(this).toggleClass("hidden", active);
		});

		$container.toggleClass("hidden", !active);
	}

	render() {
		return (
			<div className={"placeholder " + this.props.type + " hidden"} onClick={this.togglePlaceholders.bind(this)}>
				<div className="inner">
					<img src="img/icons/placeholder.png" alt="Minimized button"></img>
				</div>
			</div>
		);
	}
}

export default Placeholder;