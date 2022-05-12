let Utility = {
    BACKGROUND_LIGHT: '#FFFFFF',
    BACKGROUND_DARK: '#262626',

    loadSwitchesFromStorage: () => {
        let switches = {
            save_to_storage: true,
        };
        let keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith('switch_')) {
                let val = localStorage.getItem(keys[i]);
                let switchId = keys[i].substring(7);
                if (val === 'true') val = true;
                else if (val === 'false') val = false;
                switches[switchId] = val;
            }
        }
        return switches;
    },

    saveSwitchToStorage: (key, val) => {
        localStorage.setItem('switch_' + key, val);
    },

    getDistroAcronym: distroString => {
        let distro = distroString.split(' ');
        let acronym = '';
        distro.forEach(d => (acronym += d[0]));
        return acronym;
    },

    convertDistros: distros => {
        let strings = [];

        if (!distros) return strings;

        for (let i = 0; i < distros.length; i++) {
            let d = parseInt(distros[i]);

            switch (d) {
                case 1:
                    strings.push('Natural Sciences');
                    break;
                case 2:
                    strings.push('Formal Studies');
                    break;
                case 3:
                    strings.push('Social and Behavioral Sciences');
                    break;
                case 4:
                    strings.push('Historical Studies');
                    break;
                case 5:
                    strings.push('Ethics and Values');
                    break;
                case 6:
                    strings.push('Literature and Fine Arts');
                    break;
                case 7:
                    strings.push('Interdisciplinary Studies');
                    break;
                default:
                    strings.push('Unknown');
                    break;
            }
        }

        return strings;
    },

    convertYear: num => {
        switch (num) {
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
            case 6:
                return 'SEVENTH';
            case 7:
                return 'EIGHTH';
            case 8:
                return 'NINTH';
            case 9:
                return 'TENTH';
            default:
                return 'UNKNOWN';
        }
    },

    convertQuarter: num => {
        switch (num) {
            case 0:
                return { title: 'FALL', color: 'orange' };
            case 1:
                return { title: 'WINTER', color: 'sky' };
            case 2:
                return { title: 'SPRING', color: 'lime' };
            case 3:
                return { title: 'SUMMER', color: 'yellow' };
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
    },
};

export default Utility;
