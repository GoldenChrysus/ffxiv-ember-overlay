import json
import os.path
import shutil

from os import path

def saveData(data):
	with open("../../src/data/game/skill-indirections.json", "w", encoding = "utf8") as file:
	# with open("test/skill-indirections.json", "w", encoding = "utf8") as file:
		json.dump(data, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

def loadLocal():
	with open("data/actions.json") as file:
		data = json.load(file)

		file.close()
		return data

records = {}
local   = loadLocal()

for key in local:
	record = local[key]
	id     = record["ID"]

	if (record["RecastMs"] < 10000 or record["IsPlayerAction"] == True or record["Indirection"] == None or record["Indirection"] == 0):
		continue

	previous = local[str(record["Indirection"])]

	if (previous["RecastMs"] < 10000 or previous["RecastMs"] != record["RecastMs"]):
		continue

	records[id] = record["Indirection"]

saveData(records)