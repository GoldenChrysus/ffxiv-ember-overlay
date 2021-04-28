import json
import os.path
import requests
import shutil

from os import path

def getPage(page_num):
	url = "https://xivapi.com/InstanceContent?page=" + str(page_num) + ""
	res = requests.get(url = url)

	return res.json()

def getInstance(id):
	url = "https://xivapi.com/InstanceContent/" + str(id)
	res = requests.get(url = url)

	return res.json()

def saveInstances(instances):
	with open("../src/data/game/instances.json", "w", encoding = "utf8") as file:
		json.dump(instances, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
		file.close()

page      = 1
instances = {}

while (True):
	page_data = getPage(page)
	page      = page_data["Pagination"]["PageNext"]

	for record in page_data["Results"]:
		id = record["ID"]

		instance_data = getInstance(id)

		if (instance_data["ContentFinderCondition"] == None):
			continue

		instances[id] = {
			"zone_id" : instance_data["ContentFinderCondition"]["TerritoryType"]["ID"],
			"locales" : {
				"name" : {
					"en" : instance_data["Name_en"],
					"de" : instance_data["Name_de"],
					"fr" : instance_data["Name_fr"],
					"jp" : instance_data["Name_ja"]
				}
			}
		}

	if (page == None or page <= page_data["Pagination"]["Page"]):
		saveInstances(instances)
		break