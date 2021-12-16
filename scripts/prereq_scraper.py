from bs4 import BeautifulSoup
import urllib.request
import json

with open('result.json') as f:
    courses = json.load(f)

course_data = courses['courses']

soup = BeautifulSoup(urllib.request.urlopen('https://catalogs.northwestern.edu/undergraduate/courses-az/'), 'html.parser')

sections = soup.find('div', class_='az_sitemap')

link_all_majors = sections.find_all('li')

for link_major in link_all_majors:

    a_tag = link_major.find('a')
    if a_tag is None: continue
    a_tag_href = a_tag['href']
    if not a_tag_href.startswith('/undergraduate/courses-az'): continue

    text = link_major.get_text()
    code = text.split('(')[1].split(')')[0]
    display = text.split('(')[0].strip()

    major_soup = BeautifulSoup(urllib.request.urlopen('https://catalogs.northwestern.edu' + a_tag_href), 'html.parser')

    major_classes = major_soup.find_all('div', class_='courseblock')

    count = 0
    for major_class in major_classes:

        course_name_id_unit = major_class.find(class_='courseblocktitle')

        if course_name_id_unit is None:
            # because northwestern spelled it wrong sometimes
            course_name_id_unit = major_class.find(class_='couresblocktitle')

        course_name_id_unit = course_name_id_unit.get_text().strip().replace('&nbsp;', ' ').replace('\xa0', ' ')
        cni_sp = course_name_id_unit.split(' ')
        course_id = ' '.join(cni_sp[0:2])

        index = -1
        
        # look at the efficiency of this thing lmao let's goooo
        # ensures that the course is actually there in case of possible order inconsistencies
        for c in range(len(course_data)):
            course = course_data[c]
            if course['id'] == course_id:
                index = c
                break
        
        if index == -1: continue

        course_extras = major_class.findAll(class_='courseblockextra')

        for course_extra in course_extras:
            text = course_extra.get_text().strip().replace('&nbsp;', ' ').replace('\xa0', ' ')

            if text.endswith('.'): text = text[:-1]

            if text.startswith('Prerequisites: '):
                course_data[index]['prereqs'] = text[15:]
                count += 1
            elif text.startswith('Prerequisite: '):
                course_data[index]['prereqs'] = text[14:]
                count += 1


    print('Scraped prereq data for ' + str(count) + ' ' + code + ' courses.')

print('Finished scraping.')

with open('result.json', 'w') as out:
    json.dump(courses, out, indent=4)

print('Wrote to file.')