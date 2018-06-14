import { Pipe, PipeTransform } from '@angular/core';
import { Faculty } from '../faculty';

@Pipe({name: 'selector'})
export class PositionSelectorPipe implements PipeTransform {
  transform(list: Array<Faculty>, selector: number): Array<Faculty> {
    if (selector == 0){
      return list.filter(i => i.position === 'Araştırma Görevlisi')
    } else if (selector == 1){
      return list.filter(i => i.position === 'Dr.');
    } else {
      return list
    }
  };
}