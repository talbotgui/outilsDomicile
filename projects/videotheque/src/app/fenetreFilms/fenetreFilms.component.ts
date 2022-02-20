import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Film } from '../model/model';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({ selector: 'app-fenetrefilms', templateUrl: './fenetrefilms.component.html', styleUrls: ['./fenetrefilms.component.scss'] })
export class FenetreFilmsComponent {
  /** Constructeur pour récupérer les composants dont on a besoin */
  constructor(
    // L'objet pointant sur la popup elle-même
    public dialogRef: MatDialogRef<FenetreFilmsComponent>,
    // le film à afficher
    @Inject(MAT_DIALOG_DATA) public film: Film,
    // Le formatteur de date
    private formateurDeDate: DatePipe,
    // Le service de sauvegarde
    public serviceDeSauvegarde: SauvegardeService
  ) {
    // Au cas où
    if (!this.film.tagsSecondaires) {
      this.film.tagsSecondaires = [];
    }
    // Au chargement du composant, on met en place le filtrage de la liste des tags disponibles
    // au cours de la frappe dans l'autocomplete
    this.listeTagsSecondairesFiltree = this.tagsSecondairesCtrl.valueChanges.pipe(
      startWith(null),
      map((valeurSaisie: string | null) => {
        if (valeurSaisie) {
          const valeurSaisieMaj = valeurSaisie.toUpperCase();
          return this.serviceDeSauvegarde.listeTagsSecondaires.filter((t) => t.toUpperCase().indexOf(valeurSaisieMaj) != -1);
        } else {
          return this.serviceDeSauvegarde.listeTagsSecondaires.slice();
        }
      })
    );
  }

  // Petit flag pour savoir si le film a ete vu aujourd'hui
  public get dateDuJour():string|null {
    return this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
  }
  //supprime le film, enrgistre et ferme la fenetre
  public supprimer() {
    if (this.serviceDeSauvegarde.videotheque){
      const index = this.serviceDeSauvegarde.videotheque.films.indexOf(this.film);
      if (index !== -1) {
        this.serviceDeSauvegarde.videotheque.films.splice(index, 1);
        this.enregistrer();
      }
    }
  }

  // Appel à la sauvegarde
  enregistrer(): void {
    this.serviceDeSauvegarde.sauvegarderDonnees().subscribe();
    //pour fermer la fenetre après la sauvegarde
    this.dialogRef.close();
  }

  // On regarde le film maintenant
  renseignerFilmVu(): void {
    // renseigner la date du jour au bon format
    this.film.dateDernierVisionnage = this.dateDuJour;
    if (this.film.dateDernierVisionnage ){
      this.film.dateTechnique =
        this.film.dateDernierVisionnage.substring(6, 10) +
        this.film.dateDernierVisionnage.substring(3, 5) +
        this.film.dateDernierVisionnage.substring(0, 2);
    }
    // Supppression du flag à voir
    this.film.aVoir=false;
  }

  /************************* Gestion des tags secondaires ***********************/
  // Liste des caractères qui déclenche la création d'un tag
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  // Variable contenant le champ de saisie (pour lui ajouter des comportements spécifiques - cf. constructor)
  public tagsSecondairesCtrl = new FormControl();
  // Liste des tags secondaires filtrés en fonction de la frappe de l'utilisateur dans l'autocomplete
  public listeTagsSecondairesFiltree: Observable<string[]>;
  // Champ de saisie (nécessaire pour le vider régulièrement)
  @ViewChild('tagsSecondairesInput') tagsSecondairesInput: ElementRef<HTMLInputElement>|undefined;
  // Création d'un nouveau tag
  creerUnTagSecondaire(event: MatChipInputEvent) {
    // ajout du tag dans les tags du film mais aussi les tags disponibles
    if ((event.value || '').trim()) {
      if (this.film.tagsSecondaires.indexOf(event.value) === -1) {
        this.film.tagsSecondaires.push(event.value.trim());
      }
      if (this.serviceDeSauvegarde.listeTagsSecondaires.indexOf(event.value) === -1) {
        this.serviceDeSauvegarde.listeTagsSecondaires.push(event.value.trim());
      }
    }
    // Reset du formulaire
    if (event.input) {
      event.input.value = '';
    }
    this.tagsSecondairesCtrl.setValue(null);
  }
  // Ajout d'un nouveau tag
  ajouterUnTagSecondaire(event: MatAutocompleteSelectedEvent) {
    // Ajout du tag
    if (this.film.tagsSecondaires.indexOf(event.option.viewValue) === -1) {
      this.film.tagsSecondaires.push(event.option.viewValue);
    }
    // reset du formulaire
    if (this.tagsSecondairesInput){
      this.tagsSecondairesInput.nativeElement.value = '';
      this.tagsSecondairesCtrl.setValue(null);
    }
  }
  // Retrait d'un nouveau tag
  retirerUnTagSecondaire(tag: string) {
    // recherche du tag dans la liste
    const index = this.film.tagsSecondaires.indexOf(tag);
    // si le tag est dans la liste, on le supprime
    if (index >= 0) {
      this.film.tagsSecondaires.splice(index, 1);
    }
  }

  /*********************************** Gestion des modes d'affichage *********************/
  public affichageLecture: boolean = true;
  modifier(): void {
    this.affichageLecture = false;
  }
  annuler(): void {
    this.affichageLecture = true;
  }
}
