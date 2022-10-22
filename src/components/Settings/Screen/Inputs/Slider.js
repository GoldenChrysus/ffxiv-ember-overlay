import React from "react";
import $ from "jquery";

// eslint-disable-next-line
import UISlider from "jquery-ui/ui/widgets/slider";

import "jquery-ui/themes/base/theme.css";
import "jquery-ui/themes/base/slider.css";

class Slider extends React.Component {
	componentDidMount() {
		this.$elem = $(this.refs.slider);

		const $elem = this.$elem;

		this.$elem.slider({
			range : this.props.range,
			min   : this.props.minimum,
			max   : this.props.maximum,
			value : this.props.value,
			slide : (e, ui) => {
				const change_data = {
					key_path : this.props.key_path,
					value    : ui.value,
				};

				this.props.onChange(e, change_data);
				$elem
					.closest("div.field")
					.find(".value")
					.text(ui.value);
			},
		});
	}

	componentWillUnmount() {
		this.$elem.slider("destroy");
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<div ref='slider'></div>
		);
	}
}

export default Slider;
