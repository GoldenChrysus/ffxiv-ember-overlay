import json
import os.path
import shutil

from os import path

def saveData(data):
	with open("../../src/data/game/pvp-zones.json", "w", encoding = "utf8") as file:
	# with open("test/pvp-zones.json", "w", encoding = "utf8") as file:
		json.dump(data, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def loadLocal():
	with open("data/pvp-zones.json") as file:
		data = json.load(file)

		file.close()
		return data

records = []
local   = loadLocal();

for key in local:
	record = local[key]

	records.append(record["ID"])

saveData(records)