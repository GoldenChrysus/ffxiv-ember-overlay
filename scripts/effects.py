import json
import requests
import shutil

def getPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&indexes=Status&filters=InflictedByActor=0,Category=1"
	res = requests.get(url = url)

	return res.json()

def getEffect(id):
	url = "https://xivapi.com/Status/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveImage(id, xiv_path):
	url = "https://xivapi.com/" + xiv_path
	res = requests.get(url, stream = True)

	if res.status_code == 200:
		res.raw.decode_content = True

		with open("../public/img/icons/effects/" + str(id) + ".jpg", "wb") as file:
			shutil.copyfileobj(res.raw, file)
			file.close()

def saveEffects(effects):
	with open("../src/data/game/effects.json", "w", encoding = "utf8") as file:
		json.dump(effects, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page    = 1
effects = {}

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for effect in page_data["Results"]:
		id = effect["ID"]

		effect_data = getEffect(id)

		effects[id] = {
			"locales" : {
				"name" : {
					"en" : effect_data["Name_en"],
					"de" : effect_data["Name_de"],
					"fr" : effect_data["Name_fr"],
					"jp" : effect_data["Name_ja"]
				}
			}
		}

		saveImage(id, effect_data["Icon"])

	if (page == None):
		saveEffects(effects)
		break