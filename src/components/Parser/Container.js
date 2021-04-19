import React from "react";
import { connect } from "react-redux";
import { ContextMenuTrigger } from "react-contextmenu";
import ReactTooltip from "react-tooltip";
import { Rnd } from "react-rnd";
import clone from "lodash.clonedeep";

import EmberComponent from "../EmberComponent";
import ContextMenu from "./Container/Menu";
import Import from "./Container/Import";
import GameState from "./GameState";
import PlayerTable from "./PlayerTable";
import PlayerDetail from "./PlayerDetail";
import Footer from "./Footer";
import PlaceholderToggle from "./Placeholder/Toggle";
import AggroTable from "./AggroTable";
import SpellGrid from "./SpellGrid";

import SpellService from "../../services/SpellService";
import TTSService from "../../services/TTSService";

class Container extends EmberComponent {
	constructor(props) {
		super(props);

		this.timer           = null;
		this.no_footer_modes = [
			"spells"
		];

		this.mounted = false;
		this.state   = {
			locked          : true,
			spells_sections : this.props.spells_sections,
			spells          : SpellService.processSpells(this.props.spells_in_use)
		};
	}

	componentDidUpdate(prev_props) {
		let need_state = false;
		let state      = {};

		for (let uuid in this.props.spells_sections) {
			if (!this.state.spells_sections[uuid]) {
				need_state = true;

				state.spells_sections = this.props.spells_sections;

				break;
			}
		}

		if (prev_props.mode !== this.props.mode) {
			this.clearTimer();

			if (this.props.mode === "spells") {
				TTSService.stop();

				need_state = true;

				state.spells = SpellService.processSpells(this.props.spells_in_use);

				this.startSpellsTimer();
			} else if (this.props.mode === "stats") {
				TTSService.start();
			}
		} else if (this.props.mode === "spells") {
			this.setSpellsSettings();

			let new_spells  = false;
			let lost_spells = false;

			for (let i in this.props.spells_in_use) {
				if (!prev_props.spells_in_use[i] || prev_props.spells_in_use[i].time < this.props.spells_in_use[i].time) {
					if (!new_spells) {
						new_spells = {};
					}

					new_spells[i] = this.props.spells_in_use[i];
				}
			}

			for (let i in prev_props.spells_in_use) {
				if (!this.props.spells_in_use[i]) {
					if (!lost_spells) {
						lost_spells = {};
					}

					lost_spells[i] = true;
				}
			}

			if (new_spells || lost_spells) {
				need_state = true;

				state.spells = SpellService.processSpells(new_spells, lost_spells);
			}
		}

		if (need_state) {
			this.setState(state);
		}
	}

	componentDidMount() {
		if (this.props.mode === "stats") {
			TTSService.start();
		} else if (this.props.mode === "spells") {
			this.startSpellsTimer();
		}

		document.addEventListener("onOverlayStateUpdate", this.toggleHandle.bind(this));
		this.props.plugin_service.subscribe();

		this.mounted = true;
	}

	clearTimer() {
		if (this.timer !== null) {
			clearInterval(this.timer);

			this.timer = null;
		}
	}

	startSpellsTimer() {
		this.setSpellsSettings();

		this.timer = setInterval(
			() => {
				this.setState({
					spells : Object.assign({}, this.state.spells, clone(SpellService.updateCooldowns()))
				});
			},
			250
		);
	}

	setSpellsSettings() {
		SpellService.setSettings(this.props.spells_settings.tts_trigger, this.props.spells_settings.warning_threshold);
	}

	render() {
		let encounter = this.props.encounter || {};
		let active    = (["true", true].indexOf(this.props.encounter_active) !== -1);
		let viewing   = this.props.viewing;

		let content;

		switch (this.props.mode) {
			case "stats":
				switch (viewing) {
					case "tables":
						if (this.props.table_type !== "aggro") {
							content = <PlayerTable players={this.props.combatants} encounter={encounter} type={this.props.table_type}/>;
						} else {
							content = <AggroTable monsters={this.props.aggro}/>
						}

						break;

					case "player":
						content = <PlayerDetail player={this.props.detail_player} players={this.props.combatants} encounter={encounter}/>;

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
						let settings = this.props.spells_settings;

						if (this.props.spells_settings.ui.use) {
							content = [];

							for (let uuid in this.props.spells_sections) {
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

								if (this.props.ui_builder) {
									if (this.state.locked) {
										content.push(
											<Rnd key={"spell-grid-rnd-" + uuid} bounds="body" minWidth={100} minHeight={100} resizeGrid={[10, 10]} dragGrid={[10, 10]} position={{x : layout.x, y : layout.y}} size={{width : layout.width, height : layout.height}} onDragStop={this.onDrag.bind(this, uuid)} onResizeStop={this.onResize.bind(this, uuid)}>
												<SpellGrid key={"spell-grid-" + uuid} from_builder={true} is_draggable={true} section={section} encounter={encounter} spells={this.state.spells} settings={section_settings} style={{position: "absolute", width: "100%", height: "100%"}}/>
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
									let spells = SpellService.filterSpells(this.state.spells, section, section_settings, true);

									content.push(
										<SpellGrid key={"spell-grid-" + uuid} from_builder={true} section={section} encounter={encounter} spells={spells} settings={section_settings} style={{position: "absolute", top: layout.y + "px", left: layout.x + "px", width: layout.width + "px", maxHeight: layout.height + "px"}}/>
									);
								}
							}
						} else {
							let spells = SpellService.filterSpells(this.state.spells, {}, settings, false);

							content = <SpellGrid key="spell-grid" encounter={encounter} spells={spells} settings={this.props.spells_settings}/>;
						}

						break;
				}

				break;

			default:
				break;
		}

		let footer = [];

		if (
			this.no_footer_modes.indexOf(this.props.mode) === -1 && 
			(
				!this.props.collapsed ||
				viewing !== "tables" ||
				this.props.footer_when_collapsed
			)
		) {
			footer = [
					<div className="split" key="above-footer-split"></div>,
					<Footer key="parser-footer"/>
			];
		}

		let container_classes = [];

		if (this.props.ui_builder) {
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
		let state = clone(this.state);

		state.spells_sections[uuid].layout.x = Math.round(data.x / 10) * 10;
		state.spells_sections[uuid].layout.y = Math.round(data.y / 10) * 10;

		this.setState(state);
	}

	onResize(uuid, e, side, elem, delta) {
		let state = clone(this.state);

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
		if (this.props.mode === "spells" && (this.props.hide_top_bar || this.props.spells_settings.ui.use)) {
			return "";
		}

		return(
			<GameState encounter={encounter} active={active} rank={this.props.rank} show_rank={this.props.top_right_rank}/>
		);
	}

	toggleHandle(e) {
		let body = document.getElementsByTagName("body")[0];

		this.setState({
			locked : e.detail.isLocked
		});

		if (!e.detail.isLocked) {
			body.classList.add("resizeHandle");

			if (this.props.spells_settings.ui.use && this.props.mode === "spells") {
				body.classList.add("white-background");
			}
		} else {
			body.classList.remove("resizeHandle");

			if (this.props.spells_settings.ui.use || body.classList.contains("white-background")) {
				body.classList.remove("white-background");
			}
		}
	}
}

const mapStateToProps = (state) => {
	return {
		plugin_service        : state.plugin_service,
		mode                  : state.internal.mode,
		encounter             : state.internal.game.Encounter,
		encounter_active      : state.internal.game.isActive,
		combatants            : state.internal.game.Combatant,
		collapsed             : state.settings.intrinsic.collapsed,
		footer_when_collapsed : state.settings.interface.footer_when_collapsed,
		rank                  : state.internal.rank,
		top_right_rank        : state.settings.interface.top_right_rank,
		viewing               : state.internal.viewing,
		table_type            : state.settings.intrinsic.table_type,
		detail_player         : state.internal.detail_player,
		aggro                 : state.internal.aggro,
		spells_sections       : state.settings.spells_mode.ui.sections,
		spells_in_use         : state.internal.spells.in_use,
		spells_settings       : state.settings.spells_mode,
		hide_top_bar          : state.settings.interface.hide_top_bar,
		ui_builder            : state.internal.ui_builder
	}
};

export default connect(mapStateToProps)(Container);