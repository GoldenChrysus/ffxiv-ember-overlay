// React
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// Styles
import "semantic-ui-less/semantic.less";
import "./index.css";

// Custom
import Parser from "./components/Parser";
import Settings from "./components/Settings";
import MigrationService from "./services/MigrationService";

console.info(`Welcome and thank you for using Ember Overlay & Spell Timers! Join the Discord at ${process.env.REACT_APP_DISCORD_URL}. GitHub is located at ${process.env.REACT_APP_GITHUB_URL}.`);

let state = store.getState();

state
	.settings_data
	.loadSettings()
	.then((settings_result) => {
		MigrationService
			.migrate()
			.then(() => {
				state
					.settings_data
					.restoreFromOverlayPluginIfNecessary(settings_result.used_default)
					.then(() => {
						ReactDOM.render(
							<Router basename={process.env.REACT_APP_ROUTER_BASE}>
								<Provider store={store}>
									<Route exact path="/" component={Parser}/>
									<Route path="/settings" component={Settings}/>
								</Provider>
							</Router>,
							document.getElementById("root")
						);
					});
			});
	})
	.catch((e) => {

	});
