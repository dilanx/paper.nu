export default class PlanError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PlanError';
    }
}
