import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";
import { Rnd } from "react-rnd";
import clone from "lodash.clonedeep";

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
			locked          : true,
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
		if (this.props.internal.mode === "stats") {
			TTSService.start();
		}

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
						let settings = this.props.settings.spells_mode;

						if (this.props.settings.spells_mode.ui.use) {
							content = [];

							for (let uuid in this.props.settings.spells_mode.ui.sections) {
								let section = this.state.spells_sections[uuid];

								if (!section) {
									continue;
								}

								let section_settings = clone(settings);
								let layout           = section.layout;

								if (layout.spells_per_row !== -1) {
									section_settings.spells_per_row = layout.spells_per_row;
								}
								
								if (layout.layout !== "default") {
									section_settings.layout = layout.layout;
								}

								section_settings.uuid = uuid;

								if (this.props.internal.ui_builder) {
									if (this.state.locked) {
										content.push(
											<Rnd key={"spell-grid-rnd-" + uuid} bounds="body" minWidth={100} minHeight={100} resizeGrid={[10, 10]} dragGrid={[10, 10]} position={{x : layout.x, y : layout.y}} size={{width : layout.width, height : layout.height}} onDragStop={this.onDrag.bind(this, uuid)} onResizeStop={this.onResize.bind(this, uuid)}>
												<SpellGrid key={"spell-grid-" + uuid} from_builder={true} is_draggable={true} section={section} encounter={encounter} spells={this.props.internal.spells.in_use} settings={section_settings} style={{position: "absolute", width: "100%", height: "100%"}}/>
											</Rnd>
										);
									} else {
										content =
											<div id="lock-warning">
												<span>Please lock the overlay in OverlayPlugin.</span>
											</div>;

										break;
									}
								} else {
									content.push(
										<SpellGrid key={"spell-grid-" + uuid} from_builder={true} section={section} encounter={encounter} spells={this.props.internal.spells.in_use} settings={section_settings} style={{position: "absolute", top: layout.y + "px", left: layout.x + "px", width: layout.width + "px", maxHeight: layout.height + "px"}}/>
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

		let container_classes = [];

		if (this.props.internal.ui_builder) {
			container_classes.push("ui-builder-active");
		}

		return (
			<React.Fragment>
				<ContextMenuTrigger id="right-click-menu" holdToDisplay={-1}>
					<div id="container" className={container_classes.join(" ")}>
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

		state.spells_sections[uuid].layout.x = Math.round(data.x / 10) * 10;
		state.spells_sections[uuid].layout.y = Math.round(data.y / 10) * 10;

		this.setState(state);
	}

	onResize(uuid, e, side, elem, delta) {
		let state = this.state;

		state.spells_sections[uuid].layout.width  += delta.width;
		state.spells_sections[uuid].layout.height += delta.height;

		state.spells_sections[uuid].layout.width  = Math.round(state.spells_sections[uuid].layout.width / 10) * 10;
		state.spells_sections[uuid].layout.height = Math.round(state.spells_sections[uuid].layout.height / 10) * 10;

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
		let state = this.state;
		let body  = document.getElementsByTagName("body")[0];

		state.locked = e.detail.isLocked;

		this.setState(state);

		if (!e.detail.isLocked) {
			body.classList.add("resizeHandle");

			if (this.props.settings.spells_mode.ui.use && this.props.internal.mode === "spells") {
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
	return {
		internal       : state.internal,
		settings       : state.settings,
		plugin_service : state.plugin_service
	}
};

export default connect(mapStateToProps)(Container);