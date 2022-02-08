import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { filter, fromEvent, Observable } from 'rxjs';
import { AppBaseView } from 'src/shared/page';
import { View3dService } from '../view3d.service';

@Component({
  selector: 'home-left-board',
  templateUrl: './left-board.component.html',
  styleUrls: ['./left-board.component.scss'],
})
export class LeftBoardComponent
  extends AppBaseView
  implements OnInit, AfterViewInit
{
  current: any;
  constructor(private sm: View3dService, private el: ElementRef<HTMLElement>) {
    super();
  }
  ngOnInit() {
    this.addClear(
      this.sm.event$.subscribe((v) => {
        if (v.type === 'hover-human') this.current = v.human;
      })
    );
    this.addClear(
      fromEvent(this.el.nativeElement, 'click').subscribe((v) => {
        this.el.nativeElement.classList.toggle('open');
      })
    );
  }
  ngAfterViewInit(): void {
    if (document.body.clientWidth > 1080)
      this.el.nativeElement.classList.add('open');
  }
}
