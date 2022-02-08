import csv
import json

def clean_string(s):
    return s.replace('\n', '').replace('\t', '').replace('\r', '').replace('\xa0', ' ').strip()

def repeatable(s):
    s = s.lower()
    if 'y' in s:
        return True
    return False

def organize_description(s):

    description = None
    prereq = None

    if 'Prereq: ' in s:
        description = s[:s.index('Prereq: ')].strip()
        prereq = s[s.index('Prereq: ') + 8:].strip()
    elif 'Prerequisite: ' in s:
        description = s[:s.index('Prerequisite: ')]
        prereq = s[s.index('Prerequisite: ') + 14:].strip()
    elif 'Prerequisites: ' in s:
        description = s[:s.index('Prerequisites: ')].strip()
        prereq = s[s.index('Prerequisites: ') + 15:].strip()
    else:
        description = s.strip()

    if prereq is not None and prereq.endswith('.'): prereq = prereq[:-1]

    return description, prereq

def get_terms_offered(s):
    if len(s) == 0:
        return None
    
    terms_offered = ''

    s = s.lower()
    if 'fall' in s:
        terms_offered += '0'
    if 'winter' in s:
        terms_offered += '1'
    if 'spring' in s:
        terms_offered += '2'
    if 'summer' in s:
        terms_offered += '3'
    
    if len(terms_offered) == 0:
        return None

    return terms_offered

def get_distro(s):

    s = s.lower()

    if 'natural' in s:
        return '1'
    elif 'formal' in s:
        return '2'
    elif 'social' in s:
        return '3'
    elif 'historical' in s:
        return '4'
    elif 'ethics' in s:
        return '5'
    elif 'literature' in s:
        return '6'
    elif 'interdisciplinary' in s:
        return '7'
    else:
        return None



with open('result.json') as f:
    courses = json.load(f)

majors = courses['majors']

new_majors = {}

courses_per_major = {}

for major in majors:
    courses_per_major[major] = []
    new_majors[major] = {}
    new_majors[major]['id'] = majors[major]['id']

next_id = 119

with open('RO_COURSE_INFO_PLAN_NU.csv', newline='', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for row in reader:

        major = clean_string(row['Subject'])

        if major not in new_majors:
            courses_per_major[major] = []
            new_majors[major] = {}
            new_majors[major]['id'] = str(next_id)
            next_id += 1
            
        if 'display' not in new_majors[major]:
            new_majors[major]['display'] = row['Subject Descr']

        number = clean_string(row['Catalog'])
        
        course = {}
        course['id'] = major + ' ' + number

        already_exists = False
        for c in courses_per_major[major]:
            if c['id'] == course['id']:
                already_exists = True

                check_distro = clean_string(row['Course Attribute Descr']).lower()
                if 'distribution' in check_distro:
                    di = get_distro(clean_string(row['Course Attribute Value Descr']))
                    if di is not None:
                        if 'distros' in c:
                            c['distros'] = c['distros'] + di
                        else:
                            c['distros'] = di
                break

        if already_exists:
            continue

        course['name'] = clean_string(row['Long Course Title'])
        course['units'] = clean_string(row['Min Units'])
        course['repeatable'] = repeatable(clean_string(row['Repeatable for Credit']))
        desc = clean_string(row['Course Description'])
        d, p = organize_description(desc)
        course['description'] = d
        if p is not None:
            course['prereqs'] = p
        
        offered = get_terms_offered(clean_string(row['Course Typically Offered']))
        if offered is not None:
            course['offered'] = offered

        check_distro = clean_string(row['Course Attribute Descr']).lower()
        if 'distribution' in check_distro:
            di = get_distro(clean_string(row['Course Attribute Value Descr']))
            if di is not None: course['distros'] = di
        
        course['career'] = clean_string(row['Career Descr'])
        course['nu_id'] = clean_string(row['Course ID'])

        courses_per_major[major].append(course)


course_data = []

for major in courses_per_major:

    l = courses_per_major[major]

    l.sort(key=lambda x: x['id'])

    for c in l:
        course_data.append(c)

major_ids = {}

for major in new_majors:
    major_ids[new_majors[major]['id']] = major


with open('result2.json', 'w') as out:
    json.dump({
        'courses': course_data,
        'majors': new_majors,
        'major_ids': major_ids
    }, out, indent=4)