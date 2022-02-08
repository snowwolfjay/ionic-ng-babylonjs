import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(nav: NavController) {
    nav.navigateRoot(['landing'], {
      queryParams: {
        target: location.hash.slice(1),
      },
    });
  }
}
// 禁用默认的右键菜单，避免刷新等误操作
document.body.addEventListener('contextmenu', (ev) => {
  ev.preventDefault();
});
