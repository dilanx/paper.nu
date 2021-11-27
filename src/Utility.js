import courses from './data/courses.json';

function encodeCourse(courseName) {

    let encoded = '';

    for (let i = 0; i < courseName.length; i++) {

        let char = courseName[i];

        let encodedChar = char.charCodeAt(0).toString(16);

        if (encodedChar.length === 1) {
            encodedChar = '0' + encodedChar;
        }

        encoded += encodedChar;

    }

    return encoded;

}

function decodeCourse(encodedCourse) {

    let decoded = '';

    for (let i = 0; i < encodedCourse.length; i += 2) {

        if (i + 2 > encodedCourse.length) {
            break;
        }

        let encodedChar = encodedCourse[i] + encodedCourse[i + 1];

        let char = String.fromCharCode(parseInt(encodedChar, 16));

        decoded += char;

    }

    return decoded;

}
let Utility = {

    checkPrereq: (courseData, year, quarter, data) => {

        if (!courseData.prereqs || courseData.prereqs.length === 0) {
            return true;
        }

        for (let i = 0; i < courseData.prereqs.length; i++) {

            let prereqs = courseData.prereqs[i];
            let foundPrereqs = [];

            for (let y = 0; y <= year; y++) {
                for (let q = 0; q < data[y].length; q++) {

                    if (y === year && q > quarter) break;

                    for (let j = 0; j < prereqs.length; j++) {

                        for (let c = 0; c < data[y][q].length; c++) {

                            if (data[y][q][c].id === prereqs[j]) {
                                foundPrereqs.push(data[y][q][c].id);
                            }

                        }

                    }

                }
            }

            if (foundPrereqs.length === prereqs.length) {
                return true;
            }

        }

        return false;

    },

    getCourse: name => {
        for (let course of courses.courses) {
            if (course.id === name) {
                return course;
            }
        }
        return null;
    },

    getCourseColor: name => {
        let subj = name.split(' ')[0];
        return courses.majors[subj].color;
    },

    loadData: (key, val, data) => {

        try {

            let year = parseInt(key.substring(1).split('q')[0]);
            let quarter = parseInt(key.split('q')[1]);
            let classes = val.split(',');
            let classData = [];

            let failed = false;
            classes.forEach(name => {
                
                let course = decodeCourse(name);
                let c = Utility.getCourse(course);
                if (c == null) {
                    failed = true;
                    return;
                }

                classData.push(c);

            });

            classData.sort((a, b) => {
                return a.id.localeCompare(b.id);
            });

            if (failed) return null;

            while (data.length < year + 1) {
                data.push([]);
            }

            while (data[year].length < quarter + 1) {
                data[year].push([]);
            }

            data[year][quarter] = classData;

            return data;

        } catch (e) {
            console.error(e);
            return null;

        }

    },

    saveData: data => {

        let params = new URLSearchParams();

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                let classes = data[i][j].map(course => encodeCourse(course.id)).join(',');
                if (classes.length > 0) params.set(`y${i}q${j}`, classes);
            }
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    },

    convertYear: num => {
        switch(num) {
            case 0:
                return 'FIRST';
            case 1:
                return 'SECOND';
            case 2:
                return 'THIRD';
            case 3:
                return 'FOURTH';
            case 4:
                return 'FIFTH';
            case 5:
                return 'SIXTH';
            default:
                return 'UNKNOWN';
        }
    },

    convertQuarter: num => {
        switch (num) {
            case 0:
                return {title: 'FALL', color: 'orange'};
            case 1:
                return {title: 'WINTER', color: 'red'};
            case 2:
                return {title: 'SPRING', color: 'emerald'};
            case 3:
                return 'SUMMER';
            default:
                return 'UNKNOWN';
        }
    },

    prereqColor: num => {
        switch (num) {
            case 0:
                return 'red';
            case 1:
                return 'blue';
            case 2:
                return 'green';
            case 3:
                return 'yellow';
            case 4:
                return 'purple';
            default:
                return 'gray';
        }
    }

}

export default Utility;