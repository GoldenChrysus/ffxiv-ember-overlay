import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/ActionIndirection?page=" + str(page_num)
	res = requests.get(url = url)

	return res.json()

def getItem(id):
	url = "https://xivapi.com/ActionIndirection/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveData(data):
	with open("../src/data/game/skill-indirections.json", "w", encoding = "utf8") as file:
		json.dump(data, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page    = 1
records = {}

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for record in page_data["Results"]:
		id = record["ID"]

		record_data = getItem(id)

		if (record_data["NameTarget"] != "Action" or record_data["NameTargetID"] == None or record_data["NameTargetID"] == 0 or record_data["Name"]["Recast100ms"] < 100):
			continue

		if (record_data["PreviousComboActionTarget"] != "Action" or record_data["PreviousComboActionTargetID"] == None or record_data["PreviousComboActionTargetID"] == 0 or record_data["PreviousComboAction"]["Recast100ms"] < 100):
			continue

		records[record_data["NameTargetID"]] = record_data["PreviousComboActionTargetID"]

	if (page == None or page <= page_data["Pagination"]["Page"]):
		saveData(records)
		break