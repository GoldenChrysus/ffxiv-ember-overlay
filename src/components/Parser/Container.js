import React from "react";
import { connect } from "react-redux";
import { parseGameData } from "../../redux/actions/index";
import { ContextMenuTrigger } from "react-contextmenu";

import Header from "./Header";
import ContextMenu from "./Container/Menu";
import GameState from "./GameState";
import PlayerTable from "./PlayerTable";
import PlayerDetail from "./PlayerDetail";
import Footer from "./Footer";
import Placeholder from "./Placeholder";
import PlaceholderToggle from "./Placeholder/Toggle";

class Container extends React.Component {
	componentDidMount() {
		document.addEventListener("onOverlayStateUpdate", this.toggleHandle.bind(this));
		document.addEventListener("onOverlayDataUpdate", this.parseData.bind(this));

		this.props.socket_service.initialize();
	}

	render() {
		let encounter = this.props.internal.game.Encounter || {};
		let active    = (["true", true].indexOf(this.props.internal.game.isActive) !== -1);
		let state     = (encounter.title) ? `${encounter.title} - ${encounter.CurrentZoneName} - ${encounter.duration}` : "Awaiting encounter data...";
		let viewing   = this.props.internal.viewing;

		let content;

		if (viewing === "tables") {
			content = <PlayerTable players={this.props.internal.game.Combatant} encounter={encounter} type={this.props.settings.intrinsic.table_type}/>;
		} else if (viewing === "player") {
			content = <PlayerDetail player={this.props.internal.detail_player} players={this.props.internal.game.Combatant} encounter={encounter}/>;
		}

		let header;

		if (false) {
			header = <Header title="Ember Overlay"/>;
		}

		let footer = [];

		if (!this.props.settings.intrinsic.collapsed || viewing !== "tables") {
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
							{header}
							<GameState state={state} active={active} rank={this.props.internal.rank} show_rank={this.props.settings.interface.top_right_rank}/>
							<div id="content">
								{content}
							</div>
							{footer}
						</div>
					</div>
				</ContextMenuTrigger>
				<Placeholder type="top left"/>
				<Placeholder type="top right"/>
				<Placeholder type="bottom left"/>
				<Placeholder type="bottom right"/>
				<ContextMenu/>
			</React.Fragment>
		);
	}

	parseData(e) {
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