import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { LeftBoardComponent } from './left-board/left-board.component';
import { RightBoardComponent } from './right-board/right-board.component';
import { BottomBoardComponent } from './bottom-board/bottom-board.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [
    HomePage,
    LeftBoardComponent,
    RightBoardComponent,
    BottomBoardComponent,
  ],
})
export class HomePageModule {}
