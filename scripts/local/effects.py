import json
import os.path
import shutil

from os import path

def saveData(effects):
	with open("../../src/data/game/effects.json", "w", encoding = "utf8") as file:
	# with open("test/effects.json", "w", encoding = "utf8") as file:
		json.dump(effects, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def saveImage(id):
	desto  = "../../public/img/icons/effects/" + str(id) + ".jpg"
	# desto  = "test/effects/" + str(id) + ".jpg"
	origin = "data/img/status/" + str(id) + ".png"

	if (path.exists(desto)):
		return

	if (path.exists(origin) == False):
		return

	shutil.copyfile(origin, desto)

def loadLocal():
	with open("data/statuses.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadEffects():
	with open("../../src/data/game/effects.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadDots():
	with open("../../src/data/game/dot-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadBuffs():
	with open("../../src/data/game/buff-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadDebuffs():
	with open("../../src/data/game/debuff-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data	

effects          = {}
local            = loadLocal()
existing_effects = loadEffects()
dots             = loadDots()
buffs            = loadBuffs()
debuffs          = loadDebuffs()

for key in local:
	record = local[key]
	id     = record["ID"]

	if str(id) in existing_effects:
		if (existing_effects[str(id)]["locales"]["name"]["en"] != existing_effects[str(id)]["locales"]["name"]["jp"]):
			effects[id] = existing_effects[str(id)]

		continue

	item_type = "effect"

	if (record["Name"]["en"] == record["Name"]["ja"]):
		continue

	if (record["Category"] == 2):
		if record["InflictedByActor"] == True:
			continue
		elif "over time" not in record["Description"]["en"]:
			item_type = "debuff"
		else:
			item_type = "dot"

	effects[id] = {
		"type"    : item_type,
		"dot"     : (item_type == "dot"),
		"debuff"  : (item_type == "debuff"),
		"jobs"    : [],
		"locales" : {
			"name" : {
				"en" : record["Name"]["en"],
				"de" : record["Name"]["de"],
				"fr" : record["Name"]["fr"],
				"jp" : record["Name"]["ja"]
			}
		}
	}

	if record["Name"]["en"] in dots:
		effects[id]["jobs"] = dots[record["Name"]["en"]]
	elif record["Name"]["en"] in buffs:
		effects[id]["jobs"] = buffs[record["Name"]["en"]]
	elif record["Name"]["en"] in debuffs:
		effects[id]["jobs"] = debuffs[record["Name"]["en"]]

	saveImage(id)

saveData(effects)