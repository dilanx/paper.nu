# Northwestern Course Data Scraper
# Dilan Nair 2021

# If they change their html this whole thing could break lmaoo

from bs4 import BeautifulSoup
import urllib.request
import json

course_data = []
majors = {}

soup = BeautifulSoup(urllib.request.urlopen('https://catalogs.northwestern.edu/undergraduate/courses-az/'), 'html.parser')

sections = soup.find('div', class_='az_sitemap')

link_all_majors = sections.find_all('li')

for link_major in link_all_majors:
    
    old_amount = len(course_data)

    a_tag = link_major.find('a')
    if a_tag is None: continue
    a_tag_href = a_tag['href']
    if not a_tag_href.startswith('/undergraduate/courses-az'): continue

    text = link_major.get_text()
    code = text.split('(')[1].split(')')[0]
    display = text.split('(')[0].strip()

    majors[code] = {
        'display': display
    }

    major_soup = BeautifulSoup(urllib.request.urlopen('https://catalogs.northwestern.edu' + a_tag_href), 'html.parser')

    major_classes = major_soup.find_all('div', class_='courseblock')

    for major_class in major_classes:

        course_name_id_unit = major_class.find(class_='courseblocktitle')

        if course_name_id_unit is None:
            # because northwestern spelled it wrong sometimes
            course_name_id_unit = major_class.find(class_='couresblocktitle')

        course_name_id_unit = course_name_id_unit.get_text().strip().replace('&nbsp;', ' ').replace('\xa0', ' ')

        cniu = course_name_id_unit.split(' (')
        course_name_id = cniu[0]
        cni_sp = course_name_id.split(' ')
        course_id = ' '.join(cni_sp[0:2])
        course_name = ' '.join(cni_sp[2:])

        course_unit = cniu[1].split(' Unit)')[0]

        course_desc = major_class.find(class_='courseblockdesc').get_text().strip().replace('&nbsp;', ' ').replace('\xa0', ' ')

        course = {
            'id': course_id,
            'name': course_name,
            'units': course_unit,
            'description': course_desc
        }

        course_data.append(course)

    new_amount = len(course_data)
    print('Scraped data for ' + str(new_amount - old_amount) + ' ' + code + ' courses.')

print('Finished scraping.')



    

with open('courses.json', 'w') as out:
    json.dump({
        'courses': course_data,
        'majors': majors
    }, out, indent=4)

print('Wrote to file.')