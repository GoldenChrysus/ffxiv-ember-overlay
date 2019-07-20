import React from "react";
import { connect } from "react-redux";
import { changeTableType, changeViewing } from "../../redux/actions/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut } from "@fortawesome/free-solid-svg-icons";

import OverlayPluginService from "../../services/OverlayPluginService";

class Footer extends React.Component {
	render() {
		let viewing        = this.props.viewing;
		let table_type     = this.props.table_type;
		let self           = this;
		let plugin_service = new OverlayPluginService();

		let navigation = function() {
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

		let actions = function() {
			let actions = [];

			if (self.props.overlayplugin) {
				actions.push(
					<FontAwesomeIcon icon={faCut} alt="Split encounter" title="Split encounter" onClick={plugin_service.splitEncounter} key="split-encounter"/>
				);
			}

			return actions;
		}

		return (
			<div id="footer">
				{navigation()}
				<div id="footer-actions">
					{actions()}
				</div>
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
		table_type    : state.table_type,
		viewing       : state.viewing,
		overlayplugin : state.overlayplugin
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);