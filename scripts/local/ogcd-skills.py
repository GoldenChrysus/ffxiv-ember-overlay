import json
import os.path
import re
import shutil

from os import path

def saveImage(id):
	desto  = "../../public/img/icons/skills/" + str(id) + ".jpg"
	# desto  = "test/skills/" + str(id) + ".jpg"
	origin = "data/img/action/" + str(id) + ".png"

	if (path.exists(desto)):
		return

	if (path.exists(origin) == False):
		return

	shutil.copyfile(origin, desto)

def saveData(skills):
	with open("../../src/data/game/ogcd-skills.json", "w", encoding = "utf8") as file:
	# with open("test/ogcd-skills.json", "w", encoding = "utf8") as file:
		json.dump(skills, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def loadLocal():
	with open("data/actions.json") as file:
		data = json.load(file)

		file.close()
		return data

def loadTraits():
	with open("data/traits.json") as file:
		data = json.load(file)

		file.close()
		return data

skills       = {}
traits       = {}
local        = loadLocal();
local_traits = loadTraits();

for key in local_traits:
	record = local_traits[key]
	skill  = record["Action"]
	recast = int(record["Time"]) / 1.0
	level  = record["Level"]

	if skill not in traits:
		traits[skill] = []

	traits[skill].append({
		"level"  : level,
		"recast" : recast
	})

for key in local:
	record = local[key]

	if (record["RecastMs"] < 10000 or record["Jobs"] == ""):
		continue

	id           = record["ID"]
	english_name = record["Name"]["en"]
	classes      = record["Jobs"]
	pvp          = ("", " (PVP)")[record["IsPVP"] == True]

	skills[id] = {
		"recast"        : record["RecastMs"] / 1000.0,
		"level_recasts" : sorted(traits[english_name], key = lambda item: item["level"], reverse = True) if english_name in traits else None,
		"jobs"          : ("*", classes.split())[classes != "All Classes"],
		"pvp"           : record["IsPVP"],
		"locales"       : {
			"name" : {
				"en" : record["Name"]["en"] + pvp,
				"de" : record["Name"]["de"] + pvp,
				"fr" : record["Name"]["fr"] + pvp,
				"jp" : record["Name"]["ja"] + pvp
			}
		}
	}

	saveImage(id)

saveData(skills)