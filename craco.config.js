const { getLoader, loaderByName, throwUnexpectedConfigError } = require("@craco/craco");

module.exports = {
	webpack : {
		alias : {
			"../../theme.config$" : require("path").join(__dirname, "/src/semantic-ui/theme.config"),
		},
	},
	plugins : [
		{
			plugin  : require("craco-less"),
			options : {
				lessLoaderOptions : {
					javascriptEnabled : true,
				},
			},
		},
		{
			plugin : {
				overrideWebpackConfig({ context, webpackConfig }) {
					const { isFound, match: fileLoaderMatch } = getLoader(
						webpackConfig,
						loaderByName("file-loader"),
					);

					if (!isFound) {
						throwUnexpectedConfigError({
							message : `Can't find file-loader in the ${context.env} webpack config!`,
						});
					}

					fileLoaderMatch.loader.exclude.push(/theme.config$/);
					fileLoaderMatch.loader.exclude.push(/\.variables$/);
					fileLoaderMatch.loader.exclude.push(/\.overrides$/);

					if (["development", "staging"].indexOf(process.env.REACT_APP_ENV) !== -1) {
						webpackConfig.mode                      = "development";
						webpackConfig.optimization.minimize     = false;
						webpackConfig.optimization.runtimeChunk = false;
						webpackConfig.optimization.splitChunks  = {
							cacheGroups : {
								default : false,
							},
						};
						webpackConfig.output.filename           = "[name].js";
					}

					return webpackConfig;
				},
			},
		},
	],
	eslint : {
		enable : false,
	},
};
