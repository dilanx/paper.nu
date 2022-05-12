import courses from './data/courses.json';

function loadData(params) {
    let data = [
        [[], [], []],
        [[], [], []],
        [[], [], []],
        [[], [], []],
    ];
    let favoritesNoCredit = new Set();
    let favoritesForCredit = new Set();

    let loadedSomething = false;

    try {
        for (let pair of params.entries()) {
            let key = pair[0];
            let value = pair[1];

            if (key.startsWith('y')) {
                loadedSomething = true;

                let year = parseInt(key.substring(1).split('q')[0]);
                let quarter = parseInt(key.split('q')[1]);
                let classes = value.split(',');
                let classData = [];

                for (let id of classes) {
                    let sp = id.split('_');
                    let subjId = sp[0];
                    let num = sp[1];
                    let subj = courses.major_ids[subjId];
                    let courseId = subj + ' ' + num;

                    let course = CourseManager.getCourse(courseId);
                    if (course == null) return { malformed: true };
                    classData.push(course);
                }

                classData.sort((a, b) => {
                    return a.id.localeCompare(b.id);
                });

                while (data.length < year + 1) {
                    data.push([[], [], []]);
                }

                while (data[year].length < quarter + 1) {
                    data[year].push([]);
                }

                data[year][quarter] = classData;
            }

            if (key.startsWith('f')) {
                loadedSomething = true;

                let classesLists = value.split(';');
                for (let i = 0; i < classesLists.length; i++) {
                    let classes = classesLists[i].split(',');
                    for (let id of classes) {
                        if (id === '') continue;
                        let sp = id.split('_');
                        let subjId = sp[0];
                        let num = sp[1];
                        let subj = courses.major_ids[subjId];
                        let courseId = subj + ' ' + num;
                        if (i === 0)
                            favoritesNoCredit.add(
                                CourseManager.getCourse(courseId)
                            );
                        else
                            favoritesForCredit.add(
                                CourseManager.getCourse(courseId)
                            );
                    }
                }
            }
        }
    } catch (e) {
        return { malformed: true };
    }

    if (!loadedSomething) return { empty: true };

    return {
        data: data,
        favorites: {
            noCredit: favoritesNoCredit,
            forCredit: favoritesForCredit,
        },
    };
}

function saveData(data, favorites) {
    let params = new URLSearchParams();

    for (let y = 0; y < data.length; y++) {
        for (let q = 0; q < data[y].length; q++) {
            let classes = data[y][q]
                .map(course => {
                    let sp = course.id.split(' ');
                    let subj = sp[0];
                    let num = sp[1];
                    let subjId = courses.majors[subj].id;
                    return subjId + '_' + num;
                })
                .join(',');

            if (classes.length > 0) params.set(`y${y}q${q}`, classes);
        }
    }

    let favoritesNoCredit = Array.from(favorites.noCredit);
    let favoritesForCredit = Array.from(favorites.forCredit);

    if (favoritesNoCredit.length > 0 || favoritesForCredit.length > 0) {
        let conv = course => {
            let courseId = course.id;
            let sp = courseId.split(' ');
            let subj = sp[0];
            let num = sp[1];
            let subjId = courses.majors[subj].id;
            return subjId + '_' + num;
        };

        params.set(
            'f',
            favoritesNoCredit.map(conv).join(',') +
                ';' +
                favoritesForCredit.map(conv).join(',')
        );
    }

    return params;
}

function countCourseUnitsInHundreds(data) {
    let total = 0;
    data.forEach(course => {
        total += parseFloat(course.units) * 100;
        if (total % 100 === 2) total -= 2;
        if (total % 50 === 1) total -= 1;
        if (total % 50 === 49) total += 1;
    });
    return total;
}

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

    getTotalCredits: (data, favoritesForCredit) => {
        let total = 0;

        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                total += countCourseUnitsInHundreds(data[y][q]);
                if (total % 100 === 2) total -= 2;
                if (total % 50 === 1) total -= 1;
                if (total % 50 === 49) total += 1;
            }
        }

        total += countCourseUnitsInHundreds(favoritesForCredit);
        if (total % 100 === 2) total -= 2;
        if (total % 50 === 1) total -= 1;
        if (total % 50 === 49) total += 1;

        return total / 100;
    },

    getExtraCredits: favoritesForCredit => {
        return countCourseUnitsInHundreds(favoritesForCredit) / 100;
    },

    getQuarterCredits: quarter => {
        return countCourseUnitsInHundreds(quarter) / 100;
    },

    duplicateCourse: (course, data) => {
        for (let y = 0; y < data.length; y++) {
            for (let q = 0; q < data[y].length; q++) {
                for (let c = 0; c < data[y][q].length; c++) {
                    if (data[y][q][c].id === course.id) {
                        return {
                            year: y,
                            quarter: q,
                        };
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

    load: fallbackToStorage => {
        let data = CourseManager.loadFromURL();

        if (data.malformed) {
            return data;
        }

        if (data.empty && fallbackToStorage) {
            let storageData = CourseManager.loadFromStorage();
            if (storageData.data && storageData.favorites) {
                CourseManager.save(
                    storageData.data,
                    storageData.favorites,
                    false
                );
            }
            return storageData;
        }

        return data;
    },

    loadFromURL: () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        return loadData(params);
    },

    loadFromStorage: () => {
        let dataStr = localStorage.getItem('data');
        if (dataStr == null) return { empty: true };
        let params = new URLSearchParams(dataStr);
        return loadData(params);
    },

    save: (data, favorites, saveToStorage) => {
        let params = saveData(data, favorites);
        let paramsStr = params.toString();

        window.history.replaceState(
            {},
            '',
            `${window.location.pathname}?${paramsStr}`
        );

        if (saveToStorage) {
            localStorage.setItem('data', paramsStr);
        }
    },
};

export default CourseManager;
