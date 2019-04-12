export interface UserDB {
	_id?: string;
	fullname: string;
	email: string;
	department: string;
	position: string;
	rank: number;
	office?: string;
	phone?: string;
	mobile?: string;
	load: number;
	pendingload?: number;
	busy?: Array<Busy>;
	task?: Array<string>;
	vacation: boolean;
}

export interface User extends UserDB {
	isAvailable?: number;
	isSelected?: number;
	excuse?: string;
	tempload?: number;
}

export interface Busy {
	_id?: string;
	owner: string;
	description: string;
	startdate: string;
	enddate: string;
	recur: number;
}

/*
 * People list and their relative ranks
 * Other positions can be added
 * FIXME: figure out the type of this
 */
export const ROLES = [
	{position: "Dr.", rank: 10},
	{position: "Öğretim Görevlisi", rank: 20},
	{position: "Araştırma Görevlisi", rank: 30},
	{position: "Uzman", rank: 40},
	{position: "Memur", rank: 50},
	{position: "Diğer", rank: 100}
];

export const REPEATS = ['Tek Seferlik', 'Günlük', 'Her Hafta'];
