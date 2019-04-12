export interface TaskDB {
	_id?: string;
	description: string;
	taskgroup: string;
	peoplecount: number;
	load: number;
	owners: Array<Owners>;
	startdate: string;
	enddate: string;
	duration: number;
	recur?: number; // 0, 1, 7 are the values.
	state: number;
}

export interface Task extends TaskDB {
	ownernames?: Array<string>;
}

export interface Owners {
	id: string;
	state: number;
	newload: number;
}

export interface TaskDate {
	startdate: string;
	enddate: string;
	duration: number;
}

export const TASK_STATES = ['Aktif', 'Geçmiş', 'Kapalı'];

export const TASK_GROUPS = [
	'Gözetmenlik',
	'Ders Asistanlığı',
	'Lab Asistanlığı',
	'Sekreterlik',
	'Kalite',
	'Abet',
	'Tanıtım',
	'Kurul',
	'Diğer'
];

