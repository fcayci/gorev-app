import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/User';

@Pipe({
	name: 'selector',
	pure: true
})
export class PositionSelectorPipe implements PipeTransform {
	transform(kadro: Array<User>, selector: string): Array<User> {
		console.log('selector worked');
		if (selector === '0') {
			return [];
		}
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
