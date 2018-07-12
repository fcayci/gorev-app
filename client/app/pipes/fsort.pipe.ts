import { Pipe, PipeTransform } from '@angular/core';
import { Faculty } from '../faculty';

@Pipe({name: 'fsort'})
export class FSortPipe implements PipeTransform {
  transform(list: Array<Faculty>, sel: string): Array<Faculty> {
    if (sel === 'name') {
      return list.sort(compareName);
    } else if (sel === 'load') {
      return list.sort(compareLoad);
    } else {
      return list;
    }
  }
}

function compareLoad (a, b) {
  if (a.load < b.load) { return -1; }
  if (a.load > b.load) { return 1; }
  return 0;
}

function compareName (a, b) {
  if (a.fullname < b.fullname) { return -1; }
  if (a.fullname > b.fullname) { return 1; }
  return 0;
}
