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

// Other React
import * as serviceWorker from "./serviceWorker";

// Custom
import Parser from "./components/Parser";
import Settings from "./components/Settings";
import MigrationService from "./services/MigrationService";

console.info(`Welcome and thank you for using Ember Overlay! Join the Discord at ${process.env.REACT_APP_DISCORD_URL}. GitHub is located at ${process.env.REACT_APP_GITHUB_URL}.`);

store
	.getState()
	.settings_data
	.loadSettings()
	.then(() => {
		MigrationService
			.migrate()
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
	})
	.catch((e) => {

	});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
