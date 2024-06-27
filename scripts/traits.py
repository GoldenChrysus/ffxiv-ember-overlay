import json
import re
import requests
from typing import Dict, List, Optional


def getTraitPage(after: int) -> List:
    url = f'https://beta.xivapi.com/api/1/sheet/Trait?version=6.58x2&limit=500&after={after}'
    res = requests.get(url = url)

    return res.json()['rows']


def getTrait(id: int):
    url = f'https://beta.xivapi.com/api/1/sheet/Trait/{id}?version=6.58x2'
    res = requests.get(url = url)

    return res.json()['fields']


def saveTraits(traits):
    with open("./local/data/traits-api.json", "w", encoding = "utf8") as file:
        json.dump(traits, file, indent = "\t", separators = (",", " : "), ensure_ascii = False)
        file.close()


def tryRecast(trait: Dict) -> Optional[Dict]:
    pattern = re.compile(r"<span.+>([:\w ]+)<\/span> recast timer? to (\d+) seconds")
    match = pattern.findall(trait['description'])

    if not match:
        return None

    action  = match[0][0]
    recast = int(match[0][1])

    return {
        'Type': 'Recast',
        'Action': action,
        'Time': recast,
    }


def tryCharges(trait: Dict) -> Optional[Dict]:
    data = {
        'Type': 'Charge',
    }
    pattern = r'a ([\w]+) charge of ([:\w ]+)\.'
    match = re.findall(pattern, trait['description'])

    if match:
        charges = 0
        charge_match = match[0][0]

        if charge_match == 'second':
            charges = 2
        elif charge_match == 'third':
            charges = 3
        elif charge_match == 'fourth':
            charges = 4
        else:
            raise ValueError(f'Unknown charge match: "{charge_match}"')

        data['Action'] = match[0][1]
        data['Charges'] = charges

        return data

    pattern = r'accumulation of charges for consecutive uses of ([:\w ]+)\.'
    match = re.findall(pattern, trait['description'])

    if match:
        data['Action'] = match[0][0]
        pattern = r'Maximum Charges: ([\d]+)'
        match = re.findall(pattern, trait['description'])

        data['Charges'] = int(match[0][0])

        return data


def main():
    after  = 0
    traits = {}

    while True:
        rows = getTraitPage(after)

        if not rows:
            break

        for row in traits:
            trait = getTrait(row['row_id'])
            data = {
                'Level': trait['Level'],
            }

            if (recast := tryRecast(trait)) is not None:
                data.update(recast)
            elif (charges := tryCharges(trait)) is not None:
                data.update(charges)
            else:
                continue

            traits[trait['Name']] = data

    saveTraits(traits)


if __name__ == '__main__':
    main()
