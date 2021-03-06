import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature'
})
export class TemperaturePipe implements PipeTransform {

  transform(value: any, unit: string): any {
      if(value && !isNaN(value)) {
        if (unit === 'C') {
            var temperature = (value - 273.15) ;
            return Math.round(parseInt(temperature.toFixed(2)));
        } 
      }
    return;
  }

}

