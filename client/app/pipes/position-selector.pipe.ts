import { Pipe, PipeTransform } from '@angular/core';
import { Faculty, ROLES } from '../models/FacultyModel';

@Pipe({name: 'selector'})
export class PositionSelectorPipe implements PipeTransform {
	transform(kadro: Array<Faculty>, selector: string): Array<Faculty> {
		if (selector === '0') {
			return kadro.filter(i => i.position === 'Araştırma Görevlisi');
		} else if (selector === '1') {
			return kadro.filter(i => i.position === 'Dr.');
		} else {
			return kadro;
		}
	}
}
