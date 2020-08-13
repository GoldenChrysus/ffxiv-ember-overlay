import React from "react";
import isEqual from "lodash.isequal";

class EmberComponent extends React.Component {
	shouldComponentUpdate(next_props) {
		for (let i in this.props) {
			if (typeof this.props[i] === "function") {
				continue;
			}

			if (!isEqual(this.props[i], next_props[i])) {
				return true;
			}
		}

		return false;
	}
}

export default EmberComponent;