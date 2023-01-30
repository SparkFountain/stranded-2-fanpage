import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interpolate',
})
export class InterpolatePipe implements PipeTransform {
  transform(value: number, min: number, max: number, scale?: number): unknown {
    if (scale === undefined) {
      scale = 1;
    }

    const result = ((value - min) / (max - min)) * scale;
    console.log('>>> interpolation result', result);

    return result;
  }
}
