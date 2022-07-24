export interface Time {
    h: number;
    m: number;
}

export interface ScheduleData {
    schedule: ScheduleDataMap;
    bookmarks: ScheduleBookmarks;
}

export interface ScheduleDataMap {
    [section_id: string]: ScheduleSection;
}

export interface ValidScheduleDataMap {
    [section_id: string]: ValidScheduleSection;
}

export type ScheduleBookmarks = ScheduleCourse[];

export interface ScheduleCourse {
    course_id: string;
    school: string;
    title: string;
    subject: string;
    number: string;
    sections: ScheduleSection[];
}

export interface ScheduleSection {
    section_id: string;
    instructors?: string[];
    mode: string | null;
    title: string;
    subject: string;
    number: string;
    section: string;
    meeting_days?: string;
    start_time?: Time;
    end_time?: Time;
    room?: {
        building_name?: string;
    };
    start_date?: string;
    end_date?: string;
    component: string;
    course_descriptions?: {
        name: string;
        desc: string;
    }[];
    preview?: boolean;
}

export interface ValidScheduleSection extends ScheduleSection {
    start_date: string;
    end_date: string;
    start_time: Time;
    end_time: Time;
    meeting_days: string;
}

export interface ScheduleLocations {
    [building_name: string]: ScheduleLocation | null;
}

export interface ScheduleLocation {
    lat: number;
    lon: number;
}

export interface ScheduleDate {
    y: number;
    m: number;
    d: number;
}

export interface ScheduleInteraction<T> {
    get?: T;
    set: (value: T) => void;
    clear: () => void;
}
export interface ScheduleInteractions {
    hoverSection: ScheduleInteraction<string>;
    hoverDelete: ScheduleInteraction<boolean>;
    previewSection: ScheduleInteraction<ScheduleSection>;
    multiClear: (interactions: (keyof ScheduleInteractions)[]) => void;
}

export interface ScheduleModificationFunctions {
    addSection: (section: ScheduleSection) => void;
    removeSection: (section: ScheduleSection) => void;
    addScheduleBookmark: (course: ScheduleCourse) => void;
    removeScheduleBookmark: (course: ScheduleCourse) => void;
}
