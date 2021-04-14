import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";
import { Rnd } from "react-rnd";

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

		this.state = {
			spells_sections : this.props.settings.spells_mode.ui.sections
		};
	}

	componentDidUpdate(prev_props) {
		let state      = this.state;
		let need_state = false;

		for (let uuid in this.props.settings.spells_mode.ui.sections) {
			if (!state.spells_sections[uuid]) {
				need_state = true;

				break;
			}
		}

		state.spells_sections = this.props.settings.spells_mode.ui.sections;

		if (need_state) {
			this.setState(state);
		}
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
						if (this.props.settings.spells_mode.ui.use) {
							content = [];

							for (let uuid in this.props.settings.spells_mode.ui.sections) {
								let section = this.state.spells_sections[uuid];

								if (!section) {
									continue;
								}

								let layout = section.layout;

								if (this.props.internal.ui_builder) {
									content.push(
										<Rnd key={"spell-grid-rnd-" + uuid} bounds="body" minWidth={100} minHeight={100} resizeGrid={[1, 1]} dragGrid={[1, 1]} position={{x : layout.x, y : layout.y}} size={{width : layout.width, height : layout.height}} onDragStop={this.onDrag.bind(this, uuid)} onResizeStop={this.onResize.bind(this, uuid)} data-key={uuid}>
											<SpellGrid key={"spell-grid-" + uuid} from_builder="true" is_draggable={true} section={section} encounter={encounter} spells={this.props.internal.spells.in_use} settings={this.props.settings.spells_mode} style={{position: "absolute", width: "100%", height: "100%"}}/>
										</Rnd>
									);
								} else {
									content.push(
										<SpellGrid key={"spell-grid-" + uuid} from_builder="true" section={section} encounter={encounter} spells={this.props.internal.spells.in_use} settings={this.props.settings.spells_mode} style={{position: "absolute", top: layout.y + "px", left: layout.x + "px", width: layout.width + "px", maxHeight: layout.height + "px"}}/>
									);
								}
							}
						} else {
							content = <SpellGrid key="spell-grid" encounter={encounter} spells={this.props.internal.spells.in_use} settings={this.props.settings.spells_mode}/>;
						}

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
				<ContextMenu getUIData={this.getUIData.bind(this)}/>
			</React.Fragment>
		);
	}

	onDrag(uuid, e, data) {
		let state = this.state;

		state.spells_sections[uuid].layout.x = data.x;
		state.spells_sections[uuid].layout.y = data.y;

		this.setState(state);
	}

	onResize(uuid, e, side, elem, delta) {
		let state = this.state;

		state.spells_sections[uuid].layout.width += delta.width;
		state.spells_sections[uuid].layout.height += delta.height;

		this.setState(state);
	}

	getUIData() {
		return this.state.spells_sections;
	}

	getGameState(encounter, active) {
		if (this.props.internal.mode === "spells" && (this.props.settings.interface.hide_top_bar || this.props.settings.spells_mode.ui.use)) {
			return "";
		}

		return(
			<GameState encounter={encounter} active={active} rank={this.props.internal.rank} show_rank={this.props.settings.interface.top_right_rank}/>
		);
	}

	toggleHandle(e) {
		let body = document.getElementsByTagName("body")[0];

		if (!e.detail.isLocked) {
			body.classList.add("resizeHandle");

			if (this.props.settings.spells_mode.ui.use) {
				body.classList.add("white-background");
			}
		} else {
			body.classList.remove("resizeHandle");

			if (this.props.settings.spells_mode.ui.use || body.classList.contains("white-background")) {
				body.classList.remove("white-background");
			}
		}
	}
}

const mapStateToProps = (state) => {
	return state;
};

export default connect(mapStateToProps)(Container);