export interface Busy {
	_id?: string;
	name: string;
	startdate: string;
	enddate: string;
	recur: number;
	owner: string;
}

export class TaskDate {
	valid: boolean;
	startdate: string;
	enddate: string;
	duration: number;
}

export const REPEATS = ['Tek Seferlik', 'Günlük', 'Her Hafta'];
