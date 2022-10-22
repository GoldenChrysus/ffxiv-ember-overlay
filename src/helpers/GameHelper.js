import LocalizationService from "../services/LocalizationService";

export function getEncounterTitle(encounter, exclude_duration) {
	const encounter_state = [];

	if (!encounter.title) {
		encounter_state.push(LocalizationService.getOverlayText("awaiting_encounter"));
	} else {
		if (!exclude_duration) {
			encounter_state.push(encounter.duration);
		}

		if (encounter.title !== "Encounter") {
			encounter_state.push(encounter.title);
		}

		encounter_state.push(encounter.CurrentZoneName);
	}

	return encounter_state.join(" - ");
}
