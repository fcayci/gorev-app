import { Pipe, PipeTransform } from '@angular/core';

import { OE } from '../../oe';

@Pipe({ name: 'available' })
export class AvailablePipe implements PipeTransform {
  transform(kadro: OE[], callback: (kisi: any) => boolean ): any {
    if (!kadro || !callback ) {
      return kadro;
    }
    return kadro.filter(kisi => callback(kisi));
  }
}