import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { LanguageService } from '../common/services/language-service';


@Component({
  selector: 'ns-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingModalComponent implements OnInit {
    languages = [];
    languagesNames = [];
    firstIndex = 0;
    selectedIndex;

  constructor(private params: ModalDialogParams, private languageService: LanguageService) {
  }

  ngOnInit(): void {
      this.languages = this.languageService.getLanguages();
      this.languagesNames = this.languages.map(l => l.lan);
      this.firstIndex = this.languages.findIndex(l => l.id == this.languageService.getCurrentLanguage());      
  }

  onSelectedIndexChanged(event){
      this.selectedIndex = event.selectedIndex;
  }

  async OK(){
    if(this.firstIndex != this.selectedIndex){
        await this.languageService.switchLanguage(this.languages[this.selectedIndex].id);
    }
    this.exit();
  }

  exit() {
    this.params.closeCallback();
  }
}
