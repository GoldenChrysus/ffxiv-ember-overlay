import React from "react";
import isEqual from "lodash.isequal";

class EmberComponent extends React.Component {
	shouldComponentUpdate(next_props, next_state) {
		for (let i in this.props) {
			if (typeof this.props[i] === "function") {
				continue;
			}

			if (typeof this.props[i] !== "object") {
				if (this.props[i] !== next_props[i]) {
					return true;
				}

				continue;
			}

			if (!isEqual(this.props[i], next_props[i])) {
				return true;
			}
		}

		return !isEqual(this.state, next_state);
	}
}

export default EmberComponent;