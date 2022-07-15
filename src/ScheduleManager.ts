import PlanManager from './PlanManager';

export function test() {}

export function getCourseColor(subject: string) {
    return PlanManager.data.majors[subject].color;
}
