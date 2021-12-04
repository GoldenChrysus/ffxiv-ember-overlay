import json
import os.path
import shutil

from os import path

def saveData(instances):
	with open("../../src/data/game/instances.json", "w", encoding = "utf8") as file:
	# with open("test/instances.json", "w", encoding = "utf8") as file:
		json.dump(instances, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def loadLocal():
	with open("data/instances.json") as file:
		data = json.load(file)

		file.close()
		return data

instances = {}
local     = loadLocal();

for key in local:
	record = local[key]
	id     = record["ID"]

	instances[id] = {
		"zone_id" : record["ZoneID"],
		"locales" : {
			"name" : {
				"en" : record["Name"]["en"],
				"de" : record["Name"]["de"],
				"fr" : record["Name"]["fr"],
				"jp" : record["Name"]["ja"]
			}
		}
	}

saveData(instances)