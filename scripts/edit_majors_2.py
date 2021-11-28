import json

with open('result.json') as f:
    courses = json.load(f)

majors = courses['majors']

id_to_major = {}

major_id = 0
for major in majors:
    s = str(major_id)
    if major_id < 100: s = '0' + s
    if major_id < 10: s = '0' + s
    courses['majors'][major]['id'] = s
    id_to_major[s] = major
    major_id += 1

courses['majors'] = majors
courses['major_ids'] = id_to_major

with open('result.json', 'w') as out:
    json.dump(courses, out, indent=4)