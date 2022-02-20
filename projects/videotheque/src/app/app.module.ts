import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { SauvegardeService } from './services/sauvegarde.service';
import { AppComponent } from './app.component';
import { Onglet1Component } from './onglet1/onglet1.component';
import { Onglet2Component } from './onglet2/onglet2.component';
import { Onglet3Component } from './onglet3/onglet3.component';
import { Onglet4Component } from './onglet4/onglet4.component';
import { Onglet5Component } from './onglet5/onglet5.component';
import { FenetreSeriesComponent } from './fenetreseries/fenetreseries.component';
import { FenetreFilmsComponent } from './fenetreFilms/fenetreFilms.component';
import { titrefilmsComponent } from './titrefilms/titrefilms.component';
import { titreseriesComponent } from './titreseries/titreseries.component';

@NgModule({
  declarations: [
    // Les composants de l'application
    AppComponent,
    Onglet1Component,
    Onglet2Component,
    Onglet3Component,
    Onglet4Component,
    Onglet5Component,
    titrefilmsComponent,
    titreseriesComponent,
    // Les dialog (1/2)
    FenetreSeriesComponent,
    FenetreFilmsComponent,
  ],
  entryComponents: [
    // Les dialog (2/2)
    FenetreSeriesComponent,
    FenetreFilmsComponent,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
