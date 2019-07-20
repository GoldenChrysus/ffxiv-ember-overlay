import React from "react";
import { connect } from "react-redux";
import { ContextMenu, MenuItem } from "react-contextmenu";
import { updateState, loadSampleGameData, clearGameData } from "../../../redux/actions/index";

import PluginService from "../../../services/PluginService";

class Menu extends React.Component {
	render() {
		let self           = this;
		let plugin_service = new PluginService();

		let collapse_item = function() {
			let text = (self.props.collapsed) ? "Uncollapse" : "Collapse";
			let data = {
				key   : "collapsed",
				value : !self.props.collapsed
			};

			return(
				<MenuItem data={data} onClick={self.updateState.bind(self)}>
					{text}
				</MenuItem>
			);
		};

		let plugin_actions = function() {
			return(
				<MenuItem onClick={plugin_service.splitEncounter.bind(plugin_service)}>
					Split Encounter
				</MenuItem>
			);
		}

		return (
			<ContextMenu id="right-click-menu" className="container-context-menu">
				<div className="item-group">
					{collapse_item()}
					<MenuItem onClick={this.loadSampleGameData.bind(this)}>
						Load Sample Data
					</MenuItem>
					<MenuItem onClick={this.clearGameData.bind(this)}>
						Clear Encounter Data
					</MenuItem>
					{plugin_actions()}
				</div>
			</ContextMenu>
		);
	}

	updateState(e, data) {
		this.props.updateState(data);
	}

	loadSampleGameData() {
		this.props.loadSampleGameData();
	}

	clearGameData() {
		this.props.clearGameData();
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		updateState        : (data) => {
			dispatch(updateState(data));
		},

		loadSampleGameData : () => {
			dispatch(loadSampleGameData());
		},

		clearGameData      : () => {
			dispatch(clearGameData());
		}
	}
};

const mapStateToProps = (state) => {
	return {
		collapsed     : state.collapsed,
		overlayplugin : state.overlayplugin
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);