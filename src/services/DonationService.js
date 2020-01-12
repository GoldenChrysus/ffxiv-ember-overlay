class DonationService {
	buildLocalDonationLink(rel) {
		let search     = window.location.search || "";
		let search_add = (search.slice(0, 1) === "?") ? "&" : "?";

		search += search_add + `default=${rel}`;

		return window.location.pathname + search + "#/settings/donate";
	}

	getRealDonationLink(rel) {
		rel = rel.toUpperCase();

		return process.env[`REACT_APP_${rel}_DONATE_LINK`];
	}
}

export default new DonationService();