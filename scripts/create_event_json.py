import json
import hashlib
from pathlib import Path
p = Path('./events')
json_output = [
]
m = hashlib.md5()
for json_file in p.glob('**/event.json'):
    with open(json_file) as input_file:
        data = json.load(input_file)
        data["path"] = "events/" + json_file.parent.name
        m.update((data["date"] + "_" + data["eventName"] + data["talkName"]).encode('utf-8'))
        data["id"] = str(int(m.hexdigest(), 16))[0:12]
        json_output.append(data)

with open('./website/src/data/events.json', 'w') as f:
    json.dump(json_output, f, indent=4)      