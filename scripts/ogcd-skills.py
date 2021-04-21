import json
import os.path
import re
import requests
import shutil

from os import path

def getTraitPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&indexes=Trait&string=recast%20timer%20to&string_column=Description_en"
	res = requests.get(url = url)

	return res.json()

def getActionPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&filters=ClassJobCategory!,Recast100ms>=100,IsPvP=0"
	res = requests.get(url = url)

	return res.json()

def getItem(item_type, id):
	url = "https://xivapi.com/" + item_type + "/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveImage(id, xiv_path):
	local_path = "../public/img/icons/skills/" + str(id) + ".jpg"

	if (path.exists(local_path)):
		return

	url = "https://xivapi.com/" + xiv_path
	res = requests.get(url, stream = True)

	if res.status_code == 200:
		res.raw.decode_content = True

		with open(local_path, "wb") as file:
			shutil.copyfileobj(res.raw, file)
			file.close()

def saveSkills(skills):
	with open("../src/data/game/ogcd-skills.json", "w", encoding = "utf8") as file:
		json.dump(skills, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page   = 1
skills = {}
traits = {}

while (True):
	page_data = getTraitPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for item in page_data["Results"]:
		id        = item["ID"]
		item_data = getItem("Trait", id)
		regex     = re.compile(r"<span.+>([:\w ]+)<\/span> recast timer to (\d+) seconds")
		match     = regex.findall(item_data["Description_en"])

		if (len(match) == 0):
			continue

		skill  = match[0][0]
		recast = int(match[0][1])
		level  = item_data["Level"]

		if skill not in traits:
			traits[skill] = []

		traits[skill].append({
			"level"  : level,
			"recast" : recast
		})

	if (page == None or page <= page_data["Pagination"]["Page"]):
		break

while (True):
	page_data = getActionPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for item in page_data["Results"]:
		id           = item["ID"]
		item_data    = getItem("Action", id)
		english_name = item_data["Name_en"]

		skills[id] = {
			"recast"        : item_data["Recast100ms"] / 10.0,
			"level_recasts" : sorted(traits[english_name], key = lambda item: item["level"], reverse = True) if english_name in traits else None,
			"locales"       : {
				"name" : {
					"en" : item_data["Name_en"],
					"de" : item_data["Name_de"],
					"fr" : item_data["Name_fr"],
					"jp" : item_data["Name_ja"]
				}
			}
		}

		saveImage(id, item_data["Icon"])

	if (page == None):
		saveSkills(skills)
		break