export interface FacultyDB {
	_id?: string;
	fullname: string;
	email: string;
	username?: string;
	password?: string;
	position: string;
	rank: number;
	office?: string;
	phone?: string;
	mobile?: string;
	load: number;
	tempLoad?: number;
	busy?: Array<string>;
	//tasks?: Array<string>;
	vacation: boolean;
}

export interface Faculty extends FacultyDB {
	isAvailable?: string;
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

