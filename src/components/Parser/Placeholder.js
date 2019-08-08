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
		let image_src = (this.props.light_theme) ? "img/icons/placeholder-light-theme.png" : "img/icons/placeholder-dark-theme.png";

		return (
			<div className={"placeholder " + this.props.type + " hidden"} onClick={this.togglePlaceholders.bind(this)}>
				<div className="inner">
					<img src={image_src} alt="Minimized button"></img>
				</div>
			</div>
		);
	}
}

export default Placeholder;