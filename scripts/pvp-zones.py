import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/search?page=" + str(page_num) + "&indexes=Map&filters=TerritoryType.IsPvpZone=1"
	res = requests.get(url = url)

	return res.json()

def getZone(id):
	url = "https://xivapi.com/Map/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveData(data):
	with open("../src/data/game/pvp-zones.json", "w", encoding = "utf8") as file:
		json.dump(data, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page    = 1
records = []

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for record in page_data["Results"]:
		id = record["ID"]

		record_data = getZone(id)

		records.append(record_data["TerritoryType"]["ID"])

	if (page == None or page <= page_data["Pagination"]["Page"]):
		saveData(records)
		break