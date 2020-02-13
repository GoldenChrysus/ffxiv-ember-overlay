import React from "react";
import { connect } from "react-redux";
import { parseGameData, updateState } from "../../redux/actions/index";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";

import ContextMenu from "./Container/Menu";
import Import from "./Container/Import";
import GameState from "./GameState";
import PlayerTable from "./PlayerTable";
import PlayerDetail from "./PlayerDetail";
import Footer from "./Footer";
import PlaceholderToggle from "./Placeholder/Toggle";
import PluginService from "../../services/PluginService";

class Container extends React.Component {
	componentDidMount() {
		document.addEventListener("onOverlayStateUpdate", this.toggleHandle.bind(this));
		(new PluginService()).subscribe();
		this.props.socket_service.initialize();
	}

	render() {
		let encounter = this.props.internal.game.Encounter || {};
		let active    = (["true", true].indexOf(this.props.internal.game.isActive) !== -1);
		let viewing   = this.props.internal.viewing;

		let content;

		switch (viewing) {
			case "tables":
				content = <PlayerTable players={this.props.internal.game.Combatant} encounter={encounter} type={this.props.settings.intrinsic.table_type}/>;

				break;

			case "player":
				content = <PlayerDetail player={this.props.internal.detail_player} players={this.props.internal.game.Combatant} encounter={encounter}/>;

				break;

			case "import":
				content = <Import/>;

				break;

			default:
				break;
		}

		let footer = [];

		if (!this.props.settings.intrinsic.collapsed || viewing !== "tables" || this.props.settings.interface.footer_when_collapsed) {
			footer = [
					<div className="split" key="above-footer-split"></div>,
					<Footer key="parser-footer"/>
			];
		}

		return (
			<React.Fragment>
				<ContextMenuTrigger id="right-click-menu" holdToDisplay={-1}>
					<div id="container">
						<PlaceholderToggle type="top left"/>
						<PlaceholderToggle type="top right"/>
						<PlaceholderToggle type="bottom left"/>
						<PlaceholderToggle type="bottom right"/>
						<div id="inner">
							<GameState encounter={encounter} active={active} rank={this.props.internal.rank} show_rank={this.props.settings.interface.top_right_rank}/>
							<div id="content">
								{content}
							</div>
							{footer}
							<ReactTooltip className="react-tooltip" effect="solid" multiline={false} place="left"/>
						</div>
					</div>
				</ContextMenuTrigger>
				<ContextMenu/>
			</React.Fragment>
		);
	}

	parseData(e) {
		console.log(e);
		if (!e) return;
		this.props.parseGameData(e.detail);
	}

	toggleHandle(e) {
		if (!e.detail.isLocked) {
			document.getElementsByTagName("body")[0].classList.add("resizeHandle");
		} else {
			document.getElementsByTagName("body")[0].classList.remove("resizeHandle");
		}
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		parseGameData : (data) => {
			dispatch(parseGameData(data));
		}
	}
};

const mapStateToProps = (state) => {
	return state;
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);