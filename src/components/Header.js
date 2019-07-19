import React from "react";

import PlaceholderToggle from "./Placeholder/Toggle";

class Header extends React.Component {
	render() {
		return (
			<div id="header">
				<div className="title">{this.props.title}</div>
				<div className="subtitle">DPS, heal, and tank tracker</div>
				<div style={{clear: "both"}}></div>
				<PlaceholderToggle type="left"/>
				<PlaceholderToggle type="right"/>
			</div>
		);
	}
}

export default Header;