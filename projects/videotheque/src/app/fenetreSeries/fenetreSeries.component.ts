import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SauvegardeService } from '../services/sauvegarde.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Serie } from '../model/model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({ selector: 'app-fenetreseries', templateUrl: './fenetreseries.component.html', styleUrls: ['./fenetreseries.component.scss'] })
export class FenetreSeriesComponent {
  // Méthode permettant de calculer un indicateur à un endroit préci (ici) mais de l'utiliser plusieurs fois dans la page HTML ou même dans le TS
  get indicateurSerieCommencee() {
    return !this.indicateurSerieTerminee && this.serie.dernierEpisodeVu && this.serie.dernierEpisodeVu.length >= 3;
  }

  // Méthode permettant de calculer un indicateur à un endroit préci (ici) mais de l'utiliser plusieurs fois dans la page HTML ou même dans le TS
  get indicateurSerieTerminee() {
    return (
      this.serie.dernierEpisodeVu ==
      this.serie.nombreEpisodes.length + '-' + this.serie.nombreEpisodes[this.serie.nombreEpisodes.length - 1]
    );
  }

  get stringNombreEpisodes(): string {
    return this.serie.nombreEpisodes + '';
  }
  set stringNombreEpisodes(valeur: string) {
    this.serie.nombreEpisodes = valeur.split(',').map((s) => parseInt(s));
  }

  /** Constructeur pour récupérer les composants dont on a besoin */
  constructor(
    // L'objet pointant sur la popup elle-même
    public dialogRef: MatDialogRef<FenetreSeriesComponent>,
    // le film à afficher
    @Inject(MAT_DIALOG_DATA) public serie: Serie,
    // Le formatteur de date
    private formateurDeDate: DatePipe,
    // Le service de sauvegarde
    public serviceDeSauvegarde: SauvegardeService
  ) {
    // Au cas où
    if (!this.serie.tagsSecondaires) {
      this.serie.tagsSecondaires = [];
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
  // Appel à la sauvegarde
  enregistrer(): void {
    this.serviceDeSauvegarde.sauvegarderDonnees().subscribe();
    //pour fermer la fenetre après la sauvegarde
    this.dialogRef.close();
  }
  //supprime la série, enrgistre et ferme la fenetre
  public supprimer() {
    if (this.serviceDeSauvegarde.videotheque){
      const index = this.serviceDeSauvegarde.videotheque.series.indexOf(this.serie);
      if (index !== -1) {
        this.serviceDeSauvegarde.videotheque.series.splice(index, 1);
        this.enregistrer();
      }
    }
  }
  renseignerEpisode1(): void {
    this.serie.dernierEpisodeVu = '1-1';
    // renseigner la date du jour au bon format
    this.serie.dateDernierVisionnage = this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
  }

  renseignerEpisodeSuivant(): void {
    if (this.serie.dernierEpisodeVu){
      // pour aller chercher le numéro de saison du dernier épisode vu
      var numeroSaison = parseInt(this.serie.dernierEpisodeVu.split('-')[0]);
      // pour aller chercher le numéro de l'épisode du dernier épisode vu
      var numeroEpisode = parseInt(this.serie.dernierEpisodeVu.split('-')[1]);
      // pour aller chercher le nombres d'épisodes de la saison du dernier épisode vu
      var numeroEpisodeMax = this.serie.nombreEpisodes[numeroSaison - 1];
    

      //si on regarde le dernier épisode d'une saison et que l'on passe à la saison suivante
      if (numeroEpisode == numeroEpisodeMax) {
        numeroSaison = numeroSaison + 1;
        numeroEpisode = 1;
      }
      //si on regarde l'épisode suivant dans la même saison
      else {
        numeroEpisode = numeroEpisode + 1;
      }

      //recalcul du dernier épisode vu
      this.serie.dernierEpisodeVu = numeroSaison + '-' + numeroEpisode;

      // renseigner la date du jour au bon format
      this.serie.dateDernierVisionnage = this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
    }
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
      if (this.serie.tagsSecondaires.indexOf(event.value) === -1) {
        this.serie.tagsSecondaires.push(event.value.trim());
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
    if (this.serie.tagsSecondaires.indexOf(event.option.viewValue) === -1) {
      this.serie.tagsSecondaires.push(event.option.viewValue);
    }
    // reset du formulaire
    if (this.tagsSecondairesInput) {
      this.tagsSecondairesInput.nativeElement.value = '';
      this.tagsSecondairesCtrl.setValue(null);
    }
  }
  // Retrait d'un nouveau tag
  retirerUnTagSecondaire(tag: string) {
    // recherche du tag dans la liste
    const index = this.serie.tagsSecondaires.indexOf(tag);
    // si le tag est dans la liste, on le supprime
    if (index >= 0) {
      this.serie.tagsSecondaires.splice(index, 1);
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
