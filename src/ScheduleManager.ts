import PlanManager from './PlanManager';

export function search() {}

const ScheduleManager = {
    getCourseColor: (subject: string) => {
        return PlanManager.data.majors[subject].color;
    },
};

export default ScheduleManager;
