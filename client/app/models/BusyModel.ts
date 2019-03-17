export interface Busy {
	_id?: string;
	name: string;
	startdate: string;
	enddate: string;
	recur: number; 
	owner: string;
}


export class Time {
	sday: string;
	eday: string;
	stime: string;
	etime: string;
	duration: number;
	recur?: number; // 0, 1, 7 are the values.
}

export const REPEATS = ['Tek Seferlik', 'Günlük', 'Her Hafta'];
