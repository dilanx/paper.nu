import json

with open('result.json') as f:
    courses = json.load(f)

colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 
            'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
            'fuchsia', 'pink', 'rose']

cur_color = 0
for major in courses['majors']:
    courses['majors'][major]['color'] = colors[cur_color]
    cur_color += 1
    if cur_color == len(colors):
        cur_color = 0

with open('result.json', 'w') as out:
    json.dump(courses, out, indent=4)