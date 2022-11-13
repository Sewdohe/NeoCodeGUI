import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { CockpitComponent } from './cockpit/cockpit.component';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  declarations: [AppComponent, ToolbarComponent, CockpitComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatStepperModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule
  ],
  bootstrap: [AppComponent],
  exports: [MatStepperModule, MatListModule, MatCardModule, MatDividerModule, MatProgressBarModule]
})
export class AppModule { }
