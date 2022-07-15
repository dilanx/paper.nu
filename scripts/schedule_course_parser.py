import json

days = {
    'Mo': '0',
    'Tu': '1',
    'We': '2',
    'Th': '3',
    'Fr': '4',
}

with open('courses.json') as a, open('discussions.json') as b, open('sections.json') as c:
    courses = json.load(a)
    discussions = json.load(b)
    sections = json.load(c)

for course_id in sections:
    for section in sections[course_id]:
        section['course_id'] = course_id
        section['section_id'] = course_id + '-' + section['section']
        meeting_days = section['meeting_days']
        start_time = section['start_time']
        end_time = section['end_time']

        if meeting_days is not None:
            md = ''
            for day in days:
                if day in meeting_days:
                    md += days[day]
            section['meeting_days'] = md
        
        if start_time is not None:
            start_time = start_time.split(':')
            st = {
                'h': int(start_time[0]),
                'm': int(start_time[1])
            }
            section['start_time'] = st

        if end_time is not None:
            end_time = end_time.split(':')
            et = {
                'h': int(end_time[0]),
                'm': int(end_time[1])
            }
            section['end_time'] = et

with open('sections.json', 'w') as f:
    json.dump(sections, f, indent=2)
