import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppBaseView } from 'src/shared/page';
import { View3dService } from './view3d.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [View3dService],
})
export class HomePage extends AppBaseView implements AfterViewInit {
  @ViewChild('stage') el: ElementRef<HTMLCanvasElement>;
  constructor(private app: View3dService) {
    super();
  }
  ngAfterViewInit(): void {
    this.track(() => {
      return this.app.initScene(this.el.nativeElement).subscribe(console.log);
    });
  }
}
