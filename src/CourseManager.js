import courses from './data/courses.json';

let CourseManager = {

    data: courses,

    getDistroFulfillment: data => {

        let df = [[[], [], [], [], [], []]];

        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                for (let c = 0; c < data[y][q].length; c++) {

                    let course = data[y][q][c];
                    if (!course.distros) continue;
                    let distroStr = course.distros;

                    let dfl = df.length;
                    for (let i = 0; i < dfl; i++) {
                        for (let d = 0; d < distroStr.length; d++) {

                            // deep copy lol
                            let thisDf = JSON.parse(JSON.stringify(df[i]));
                            let di = parseInt(distroStr[d]) - 1;
                            thisDf[di].push(course.id);
                            df.push(thisDf);

                        }
                        
                    }

                }
            }
        }
        for (let i = 0; i < df.length; i++) {
            console.log(df[i]);
        }
    },

    getDistroPositions: data => {
        
        let distroPos = [[], [], [], [], [], []];

        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                for (let c = 0; c < data[y][q].length; c++) {

                    let more = data[y][q][c].more;
                    if (!more) continue;

                    for (let i = 0; i < 6; i++) {
                        if (more.includes(`w${i}`)) {
                            distroPos[i].push(c);
                            break;
                        }
                    }

                }
            }
        }

        return distroPos;

    },

    getTotalCredits: data => {

        let total = 0;

        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                for (let c = 0; c < data[y][q].length; c++) {
                    total += parseFloat(data[y][q][c].units);
                }
            }
        }

        return Math.round(total * 100) / 100;

    },

    getQuarterCredits: quarter => {

        let total = 0;

        for (let c = 0; c < quarter.length; c++) {
            total += parseFloat(quarter[c].units);
        }


        return Math.round(total * 100) / 100;

    },

    duplicateCourse: (course, data) => {

        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                for (let c = 0; c < data[y][q].length; c++) {
                    if (data[y][q][c].id === course.id) {
                        return {
                            year: y,
                            quarter: q
                        }
                    }
                }
            }
        }

        return null;

    },

    getCourse: name => {
        for (let course of courses.courses) {
            if (course.id === name) {
                return course;
            }
        }
        return null;
    },

    getCourseColor: id => {
        let subj = id.split(' ')[0];
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

                let sp = name.split('_');

                let id = sp[0];
                let num = sp[1];

                let subj = courses.major_ids[id];

                let course = subj + ' ' + num;

                let c = CourseManager.getCourse(course);
                if (c == null) {
                    failed = true;
                    return;
                }

                if (sp.length > 2) {
                    let more = [];
                    for (let i = 2; i < sp.length; i++) {
                        more.push(sp[i]);
                    }
                    c.more = more;
                }

                classData.push(c);

            });

            classData.sort((a, b) => {
                return a.id.localeCompare(b.id);
            });

            if (failed) return null;

            while (data.length < year + 1) {
                data.push([[], [], []]);
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

    saveData: (data, saveToStorage) => {

        let params = new URLSearchParams();

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                let classes = data[i][j].map(course => {

                    let sp = course.id.split(' ');

                    let subj = sp[0];
                    let num = sp[1];

                    let id = courses.majors[subj].id;

                    let name = id + '_' + num;

                    if (course.more) {
                        for (let m = 0; m < course.more.length; m++) {
                            name += '_' + course.more[m];
                        }
                    }


                    return name;

                }).join(',');

                if (classes.length > 0) params.set(`y${i}q${j}`, classes);
            }
        }

        let dataStr = params.toString();

        window.history.replaceState({}, '', `${window.location.pathname}?${dataStr}`);

        if (saveToStorage) {
            localStorage.setItem('data', dataStr);
        }

    }

}

export default CourseManager;

/*
old encoding system but the URLs are too long
will probably delete this from this file later

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
*/