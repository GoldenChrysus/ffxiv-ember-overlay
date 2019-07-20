import React from "react";
import { connect } from "react-redux";
import { changeTableType, changeViewing } from "../../redux/actions/index";

class Footer extends React.Component {
	render() {
		let viewing    = this.props.viewing;
		let table_type = this.props.table_type;
		let self       = this;

		let links = function() {
			if (viewing === "tables") {
				let types   = {
					dps  : "DPS",
					heal : "Heal",
					tank : "Tank"
				}
				let links   = [];

				for (let type_key in types) {
					let name   = types[type_key];
					let active = (table_type === type_key) ? "active" : "";

					links.push(
						<div className={"role-link " + active} onClick={self.changeTableType.bind(self, type_key)} key={"navigation-link-" + type_key}>{name}</div>
					);
				}

				return(
					<div id="role-links">
						{links}
					</div>
				);
			} else if (viewing === "player") {
				return(
					<div id="navigation-links">
						<span className="navigation-link" onClick={self.changeViewing.bind(self, "tables")} key="navigation-link-back">&lsaquo; Back</span>
					</div>
				);
			}
		}

		return (
			<div id="footer">
				{links()}
			</div>
		);
	}

	changeTableType(type) {
		this.props.changeTableType(type);
	}

	changeViewing(type) {
		this.props.changeViewing(type);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeTableType : (data) => {
			dispatch(changeTableType(data));
		},

		changeViewing   : (data) => {
			dispatch(changeViewing(data));
		}
	}
};

const mapStateToProps = (state) => {
	return {
		table_type : state.table_type,
		viewing    : state.viewing
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);