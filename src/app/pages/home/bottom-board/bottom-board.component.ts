import { Component, OnInit } from '@angular/core';
import { View3dService } from '../view3d.service';

@Component({
  selector: 'home-bottom-board',
  templateUrl: './bottom-board.component.html',
  styleUrls: ['./bottom-board.component.scss'],
})
export class BottomBoardComponent implements OnInit {
  constructor(private sm:View3dService) {}

  ngOnInit() {}
  resetView(){
    this.sm.engine.currentScene?.reset()
  }
}
