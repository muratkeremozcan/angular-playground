import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from './title-case.pipe';
import { CanvasComponent } from './canvas.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    CommonModule,
    // SharedModule importers won't have to import FormsModule too
    FormsModule,
    TitleCasePipe,
    CanvasComponent
  ],
  declarations: [TitleCasePipe, CanvasComponent]
})
export class SharedModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
