import json

days = {
    'Mo': '0',
    'Tu': '1',
    'We': '2',
    'Th': '3',
    'Fr': '4',
}

def modify_section(course_id, section):
    del section['unique_id']
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
    return section

with open('courses.json') as a, open('discussions.json') as b, open('sections.json') as c:
    courses = json.load(a)
    discussions = json.load(b)
    sections = json.load(c)

result = []

for course in courses:
    course_id = course['course_id']
    del course['unique_id']
    course_sections = []

    if course_id in sections:
        for section in sections[course_id]:
            course_sections.append(modify_section(course_id, section))

    if course_id in discussions:
        for discussion in discussions[course_id]:
            course_sections.append(modify_section(course_id, discussion))

    course['sections'] = course_sections

    result.append(course)

with open('data.json', 'w') as f:
    json.dump(result, f, indent=2)
