import { Injectable } from '@angular/core';
import { alert, confirm } from '@nativescript/core';
import { openSettings, canOpenSettings } from '@nativescript-community/perms';
import { LanguageService } from './language-service';

// Migrated off the abandoned `nativescript-sweet-alert` plugin (it imports the
// removed `tns-core-modules/*` paths and no longer builds). Uses the built-in
// @nativescript/core dialogs instead.
@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private languageService: LanguageService) {
    }

    showError(txt: string) {
        alert({
            title: '',
            message: txt,
            okButtonText: this.languageService.getText("labels.OK")
        });
    }

    showInfo(txt: string) {
        alert({
            title: '',
            message: txt,
            okButtonText: this.languageService.getText("labels.OK")
        });
    }

    showSuccess(txt: string) {
        alert({
            title: '',
            message: txt,
            okButtonText: this.languageService.getText("labels.OK")
        });
    }

    // Used when a permission (e.g. location) is missing. The OS only shows the
    // system permission popup while the permission is still askable; once the user
    // has denied it (Android marks it "don't ask again"), the popup no longer
    // appears, so offer to open the app settings where it can be granted manually.
    async promptOpenSettings(txt: string) {
        if (await canOpenSettings()) {
            const goToSettings = await confirm({
                title: '',
                message: txt,
                okButtonText: this.languageService.getText("labels.setting"),
                cancelButtonText: this.languageService.getText("labels.cancel")
            });
            if (goToSettings) {
                openSettings();
            }
        } else {
            this.showError(txt);
        }
    }
}
