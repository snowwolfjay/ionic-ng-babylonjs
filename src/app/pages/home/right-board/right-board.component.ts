import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { AppBaseView } from 'src/shared/page';

@Component({
  selector: 'home-right-board',
  templateUrl: './right-board.component.html',
  styleUrls: ['./right-board.component.scss'],
})
export class RightBoardComponent
  extends AppBaseView
  implements OnInit, AfterViewInit
{
  constructor(private el: ElementRef<HTMLElement>) {
    super();
  }

  ngOnInit() {
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
