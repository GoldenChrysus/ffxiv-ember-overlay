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

def cleanText(s):
	return re.sub("<[A-Za-z]+/>", "", s)

skills        = {}
recast_traits = {}
charge_traits = {}
local         = loadLocal()
local_traits  = loadTraits()

for key in local_traits:
	record       = local_traits[key]
	trait_skills = record["Action"].split("::")
	level        = record["Level"]

	for skill in trait_skills:
		if record["Type"] == "Recast":
			recast = int(record["Time"]) / 1.0

			if skill not in recast_traits:
				recast_traits[skill] = []

			recast_traits[skill].append({
				"level"  : level,
				"recast" : recast
			})
		elif record["Type"] == "Charge":
			if skill not in charge_traits:
				charge_traits[skill] = []

			charge_traits[skill].append({
				"level"   : level,
				"charges" : record["Charges"]
			})

for key in local:
	record = local[key]

	if (record["RecastMs"] < 10000 or record["Jobs"] == ""):
		continue

	id           = record["ID"]
	english_name = record["Name"]["en"]
	classes      = record["Jobs"]
	pvp          = ("", " (PVP)")[record["IsPVP"] == True]

	if cleanText(record["Name"]["en"]) == '':
		continue

	skills[id] = {
		"recast"        : record["RecastMs"] / 1000.0,
		"charges"       : record["MaxCharges"],
		"level_recasts" : sorted(recast_traits[english_name], key = lambda item: item["level"], reverse = True) if english_name in recast_traits else None,
		"level_charges" : sorted(charge_traits[english_name], key = lambda item: item["level"], reverse = True) if english_name in charge_traits else None,
		"jobs"          : ("*", classes.split())[classes != "All Classes"],
		"pvp"           : record["IsPVP"],
		"locales"       : {
			"name" : {
				"en" : cleanText(record["Name"]["en"]) + pvp,
				"de" : cleanText(record["Name"]["de"]) + pvp,
				"fr" : cleanText(record["Name"]["fr"]) + pvp,
				"jp" : cleanText(record["Name"]["ja"]) + pvp
			}
		}
	}

	saveImage(id)

saveData(skills)
