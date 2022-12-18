import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNgModule } from './modules/primeng.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { eventsFeature } from './store/events/events.feature';
import { EventsEffects } from './store/events/events.effects';
import { EventsService } from './services/events.service';
import { HttpService } from './services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerFilterComponent } from './containers/customer-filter/customer-filter.component';
import { ReadablePipe } from 'src/pipes/readable.pipe';
import { FormStepsComponent } from './containers/customer-filter/form-steps/form-steps.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerFilterComponent,
    ReadablePipe,
    FormStepsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    PrimeNgModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature(eventsFeature),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature([EventsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  exports: [PrimeNgModule],
  providers: [HttpService, EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
