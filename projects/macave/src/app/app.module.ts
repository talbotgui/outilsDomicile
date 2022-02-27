import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { Onglet1Component } from './onglet1/onglet1';
import { Onglet2Component } from './onglet2/onglet2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SauvegardeService } from './services/sauvegarde.service';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,Onglet1Component,Onglet2Component
  ],
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // Material
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
  ],
  providers: [
    // Le service utilisable partout
    SauvegardeService,
    // Le composant de formattage des dates
    DatePipe,
    // Le Snackbar
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
