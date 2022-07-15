export interface Time {
    h: number;
    m: number;
}

export type RawScheduleCourseData = ScheduleCourse[];

export type RawScheduleSectionData = {
    [courseId: string]: ScheduleSection[];
};

export interface ScheduleCourse {
    course_id: string;
    unique_id: string;
    school: string;
    title: string;
    subject: string;
    number: string;
}

export interface ScheduleSection {
    section_id: string;
    course_id: string;
    unique_id: string;
    instructors: string[];
    mode: string | null;
    title: string;
    subject: string;
    number: string;
    section: string;
    meeting_days: string;
    start_time: Time;
    end_time: Time;
    room: {
        building_name: string;
    };
    start_date: string;
    end_date: string;
    component: string;
    course_descriptions: {
        name: string;
        desc: string;
    }[];
}

export interface ScheduleInteractions {
    hoverSection: {
        get?: string;
        set: (id: string) => void;
        clear: () => void;
    };
}
