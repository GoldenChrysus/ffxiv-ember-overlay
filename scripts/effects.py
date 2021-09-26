import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&indexes=Status"
	res = requests.get(url = url)

	return res.json()

def getEffect(id):
	url = "https://xivapi.com/Status/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveImage(id, xiv_path):
	local_path = "../public/img/icons/effects/" + str(id) + ".jpg"

	if (path.exists(local_path)):
		return

	url = "https://xivapi.com/" + xiv_path
	res = requests.get(url, stream = True)

	if res.status_code == 200:
		res.raw.decode_content = True

		with open(local_path, "wb") as file:
			shutil.copyfileobj(res.raw, file)
			file.close()

def saveEffects(effects):
	with open("../src/data/game/effects.json", "w", encoding = "utf8") as file:
		json.dump(effects, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def loadEffects():
	with open("../src/data/game/effects.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadDots():
	with open("../src/data/game/dot-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadBuffs():
	with open("../src/data/game/buff-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadDebuffs():
	with open("../src/data/game/debuff-jobs.json") as file:
		data = json.load(file)

		file.close()
		return data	

page             = 1
effects          = {}
existing_effects = loadEffects()
dots             = loadDots()
buffs            = loadBuffs()
debuffs          = loadDebuffs()

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for effect in page_data["Results"]:
		id = effect["ID"]

		if str(id) in existing_effects:
			if (existing_effects[str(id)]["locales"]["name"]["en"] != existing_effects[str(id)]["locales"]["name"]["jp"]):
				effects[id] = existing_effects[str(id)]

			continue

		effect_data = getEffect(id)
		item_type   = "effect"

		if (effect_data["Name_en"] == effect_data["Name_ja"]):
			continue

		if (effect_data["Category"] == 2):
			if effect_data["InflictedByActor"] == 1:
				continue
			elif "over time" not in effect_data["Description_en"]:
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
					"en" : effect_data["Name_en"],
					"de" : effect_data["Name_de"],
					"fr" : effect_data["Name_fr"],
					"jp" : effect_data["Name_ja"]
				}
			}
		}

		if effect_data["Name_en"] in dots:
			effects[id]["jobs"] = dots[effect_data["Name_en"]]
		elif effect_data["Name_en"] in buffs:
			effects[id]["jobs"] = buffs[effect_data["Name_en"]]
		elif effect_data["Name_en"] in debuffs:
			effects[id]["jobs"] = debuffs[effect_data["Name_en"]]

		saveImage(id, effect_data["Icon"])

	if (page == None or page <= page_data["Pagination"]["Page"]):
		saveEffects(effects)
		break