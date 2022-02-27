import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AjouterComponent } from './ajouter/ajouter';
import { AppComponent } from './app.component';
import { ListerComponent } from './lister/lister';
import { Onglet1Component } from './onglet1/onglet1';
import { Onglet2Component } from './onglet2/onglet2';
import { SauvegardeComponent } from './sauvegarde/sauvegarde';
import { SauvegardeService } from './services/sauvegarde.service';

@NgModule({
  declarations: [
    AppComponent, Onglet1Component, Onglet2Component, SauvegardeComponent, AjouterComponent, ListerComponent
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
