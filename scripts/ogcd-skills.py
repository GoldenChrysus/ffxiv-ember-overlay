import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&filters=ClassJobCategory!,Recast100ms>=100,IsPvP=0"
	res = requests.get(url = url)

	return res.json()

def getSkill(id):
	url = "https://xivapi.com/Action/" + str(id)
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

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for skill in page_data["Results"]:
		id = skill["ID"]

		skill_data = getSkill(id)

		skills[id] = {
			"recast"  : skill_data["Recast100ms"] / 10.0,
			"locales" : {
				"name" : {
					"en" : skill_data["Name_en"],
					"de" : skill_data["Name_de"],
					"fr" : skill_data["Name_fr"],
					"jp" : skill_data["Name_ja"]
				}
			}
		}

		saveImage(id, skill_data["Icon"])

	if (page == None):
		saveSkills(skills)
		break