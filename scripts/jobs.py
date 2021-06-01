import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/ClassJob?page=" + str(page_num) + ""
	res = requests.get(url = url)

	return res.json()

def getItem(id):
	url = "https://xivapi.com/ClassJob/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveData(records):
	with open("../src/data/game/jobs.json", "w", encoding = "utf8") as file:
		json.dump(records, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page    = 1
records = {}

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for job in page_data["Results"]:
		id = job["ID"]

		record_data = getItem(id)

		records[id] = {
			"abbreviation" : record_data["Abbreviation_en"]
		}

	if (page == None or page <= page_data["Pagination"]["Page"]):
		saveData(records)
		break