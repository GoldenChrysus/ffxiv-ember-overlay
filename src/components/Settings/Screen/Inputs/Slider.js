import React from "react";
import $ from "jquery";
import UISlider from "jquery-ui/ui/widgets/slider";

import "jquery-ui/themes/base/theme.css";
import "jquery-ui/themes/base/slider.css";

class Slider extends React.Component {
	componentDidMount() {
		this.$elem = $(this.refs.slider);

		this.$elem.slider({
			range : this.props.range,
			min   : this.props.minimum,
			max   : this.props.maximum,
			value : this.props.value,
			slide : (e, ui) => {
				let change_data = {
					key_path : this.props.key_path,
					value    : ui.value
				}

				this.props.onChange(e, change_data);
			}
		});
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return(
			<div ref="slider"></div>
		);
	}
}

export default Slider;