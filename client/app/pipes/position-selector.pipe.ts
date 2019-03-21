import { Pipe, PipeTransform } from '@angular/core';
import { Faculty, ROLES } from '../models/FacultyModel';

@Pipe({name: 'selector'})
export class PositionSelectorPipe implements PipeTransform {
	transform(kadro: Array<Faculty>, selector: string): Array<Faculty> {
		if (selector === '1') {
			return kadro.filter(i => i.isAvailable === 1 && i.position === 'Araştırma Görevlisi');
		} else if (selector === '2') {
			return kadro.filter(i => i.isAvailable === 1 && i.position === 'Dr.');
		} else if (selector === '3') {
			return kadro.filter(i => i.isAvailable === 1);
		} else {
			return kadro;
		}
	}
}
