/*这个是共享模块，可以把常用的指令、管道和组件放进来
 */

import { NgModule } from '@angular/core';
import { NetService } from 'src/services/net.service';
import { OverlayerService } from 'src/services/overlay/overlayer.service';
import { AppBaseView } from './page';

@NgModule({
  declarations: [AppBaseView],
  imports: [],
  exports: [],
  // providers: [OverlayerService, NetService],
})
export class SharedModule {}
