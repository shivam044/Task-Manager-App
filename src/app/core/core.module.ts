import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  providers: [
    // Core services can be provided here if not using providedIn: 'root'
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule.');
    }
  }
}
