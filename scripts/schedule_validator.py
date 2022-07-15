import json

with open('courses.json') as a, open('discussions.json') as b, open('sections.json') as c:
    courses = json.load(a)
    discussions = json.load(b)
    sections = json.load(c)

print('Checking for duplicate course IDs')

course_ids = set()
duplicates = []

for course in courses:
    if course['course_id'] in course_ids:
        duplicates.append(course['course_id'])
    else:
        course_ids.add(course['course_id'])

if len(duplicates) > 0:
    print('Duplicate course IDs found: ' + str(duplicates))
else:
    print('No duplicate course IDs found')

print('Checking for duplicate section numbers within each course')

duplicates = []

for course_id in sections:
    section_numbers = set()
    for section in sections[course_id]:
        if section['section'] in section_numbers:
            duplicates.append(course_id + '-' + section['section'])
        else:
            section_numbers.add(course_id + '-' + section['section'])
    
if len(duplicates) > 0:
    print('Duplicate section numbers found: ' + str(duplicates))
else:
    print('No duplicate section numbers found')

print('Checking for duplicate discussion numbers within each course')

duplicates = []

for course_id in discussions:
    discussion_numbers = set()
    for discussion in discussions[course_id]:
        if discussion['section'] in discussion_numbers:
            duplicates.append(course_id + '-' + discussion['section'])
        else:
            discussion_numbers.add(course_id + '-' + discussion['section'])

if len(duplicates) > 0:
    print('Duplicate discussion numbers found: ' + str(duplicates))
else:
    print('No duplicate discussion numbers found')

print('Checking for duplicate section numbers (including discussion numbers) within each course')

duplicates = []

for course_id in sections:
    section_numbers = set()
    for section in sections[course_id]:
        if section['section'] in section_numbers:
            duplicates.append(course_id + '-' + section['section'])
        else:
            section_numbers.add(course_id + '-' + section['section'])
    for discussion in discussions[course_id]:
        if discussion['section'] in section_numbers:
            duplicates.append(course_id + '-' + discussion['section'])
        else:
            section_numbers.add(course_id + '-' + discussion['section'])

if len(duplicates) > 0:
    print('Duplicate section numbers (including discussion numbers) found: ' + str(duplicates))
else:
    print('No duplicate section numbers (including discussion numbers) found')
