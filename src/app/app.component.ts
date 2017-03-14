import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    logout() {
        location.href = "https://www.google.com/accounts/Logout?continue=" + location.href;
    }
}
