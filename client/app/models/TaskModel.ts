export interface Task {
	_id?: string;
	name: string;
	group: string;
	peoplecount: number;
	weight: number;
	load: number;
	owners: Array<string>;
	startdate: string;
	enddate: string;
	duration: number;
	recur?: number; // 0, 1, 7 are the values.
	state: number;
}

export const TASK_STATES = ['Açık', 'Kapalı'];

export const TASK_GROUPS = ['Gözetmenlik', 'Sekreterlik', 'Kalite/Müdek/Tanıtım', 'Ders Asistanlığı', 'Lab Asistanlığı', 'Kurul', 'Diğer'];

