import { Injectable } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language-service';

@Injectable({
  providedIn: 'root'
})
@Pipe({ standalone: false, name: 'odedI18N' })
export class OdedI18NPipe implements PipeTransform {
  constructor(public languageService: LanguageService) {
  }
  transform(word: string, dummy: any = undefined) {
    const path = word.split('.');
    let result = this.languageService.dict;
    for (let index = 0; index < path.length; index++) {
      result = result[path[index]];
    }

    if (dummy && dummy.value !== undefined) {
      for (let index = 0; index < dummy.value.length; index++) {
        result = result.replace("%s", dummy.value[index]);
      }
    }
    
    return result;
  }
}