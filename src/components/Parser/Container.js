import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";

import ContextMenu from "./Container/Menu";
import Import from "./Container/Import";
import GameState from "./GameState";
import PlayerTable from "./PlayerTable";
import PlayerDetail from "./PlayerDetail";
import Footer from "./Footer";
import PlaceholderToggle from "./Placeholder/Toggle";
import AggroTable from "./AggroTable";

import TTSService from "../../services/TTSService";
import SpellGrid from "./SpellGrid";

class Container extends React.Component {
	constructor(props) {
		super(props);

		this.no_footer_modes = [
			"spells"
		];
	}

	componentDidMount() {
		TTSService.start();
		document.addEventListener("onOverlayStateUpdate", this.toggleHandle.bind(this));
		this.props.plugin_service.subscribe();
	}

	render() {
		let encounter = this.props.internal.game.Encounter || {};
		let active    = (["true", true].indexOf(this.props.internal.game.isActive) !== -1);
		let viewing   = this.props.internal.viewing;

		let content;

		switch (this.props.internal.mode) {
			case "stats":
				switch (viewing) {
					case "tables":
						if (this.props.settings.intrinsic.table_type !== "aggro") {
							content = <PlayerTable players={this.props.internal.game.Combatant} encounter={encounter} type={this.props.settings.intrinsic.table_type}/>;
						} else {
							content = <AggroTable monsters={this.props.internal.aggro}/>
						}

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

				break;

			case "spells":
				switch (viewing) {
					case "import":
						content = <Import/>;

						break;

					default:
						content = <SpellGrid encounter={encounter} spells={this.props.internal.spells.in_use} settings={this.props.settings.spells_mode}/>
						break;
				}

				break;

			default:
				break;
		}

		let footer = [];

		if (
			this.no_footer_modes.indexOf(this.props.internal.mode) === -1 && 
			(
				!this.props.settings.intrinsic.collapsed ||
				viewing !== "tables" ||
				this.props.settings.interface.footer_when_collapsed
			)
		) {
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
							{this.getGameState(encounter, active)}
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

	getGameState(encounter, active) {
		if (this.props.internal.mode === "spells" && this.props.settings.interface.hide_top_bar) {
			return "";
		}

		return(
			<GameState encounter={encounter} active={active} rank={this.props.internal.rank} show_rank={this.props.settings.interface.top_right_rank}/>
		);
	}

	toggleHandle(e) {
		if (!e.detail.isLocked) {
			document.getElementsByTagName("body")[0].classList.add("resizeHandle");
		} else {
			document.getElementsByTagName("body")[0].classList.remove("resizeHandle");
		}
	}
}

const mapStateToProps = (state) => {
	return state;
};

export default connect(mapStateToProps)(Container);