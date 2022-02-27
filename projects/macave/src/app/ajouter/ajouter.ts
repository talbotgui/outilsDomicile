import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { Contenu } from '../model/model';
import { SauvegardeService } from '../services/sauvegarde.service';

@Component({ selector: 'app-ajouter', templateUrl: './ajouter.html', styleUrls: [] })
export class AjouterComponent {

  /** Tag systématique */
  @Input()
  public tag: string = '';

  /** Attribut du contenu à créer */
  public nomNouveauContenu = '';
  public tagsNouveauContenu: string[] = [];

  /**  Variable contenant le champ de saisie (pour lui ajouter des comportements spécifiques - cf. constructor) */
  public tagsCtrl = new FormControl();
  /**  Liste des tags secondaires filtrés en fonction de la frappe de l'utilisateur dans l'autocomplete */
  public listeTagsFiltree: Observable<string[]>;
  /** Champ de saisie (nécessaire pour le vider régulièrement) */
  @ViewChild('tagsInput') tagsInput: ElementRef<HTMLInputElement> | undefined;
  /**  Liste des caractères qui déclenche la création d'un tag*/
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  /** Constructeur pour injecter des composants dans mon composant */
  constructor(public sauvegardeService: SauvegardeService, private formateurDeDate: DatePipe) {

    // Au chargement du composant, on met en place le filtrage de la liste des tags disponibles
    // au cours de la frappe dans l'autocomplete
    this.listeTagsFiltree = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((valeurSaisie: string | null) => {
        if (valeurSaisie) {
          const valeurSaisieMaj = valeurSaisie.toUpperCase();
          return this.sauvegardeService.tousLesTags.filter((t) => t.toUpperCase().indexOf(valeurSaisieMaj) != -1);
        } else {
          return this.sauvegardeService.tousLesTags.slice();
        }
      })
    );
  }

  /** Création d'un tag */
  public creerUnTag(event: MatChipInputEvent): void {
    // ajout du tag dans les tags du contenu mais aussi dans les tags disponibles
    if ((event.value || '').trim()) {
      if (this.tagsNouveauContenu.indexOf(event.value) === -1) {
        this.tagsNouveauContenu.push(event.value.trim());
      }
      if (this.sauvegardeService.tousLesTags.indexOf(event.value) === -1) {
        this.sauvegardeService.tousLesTags.push(event.value.trim());
      }
    }
    // Reset du formulaire
    if (event.input) {
      event.input.value = '';
    }
    this.tagsCtrl.setValue(null);
  }

  /** Ajout d'un nouveau tag */
  public ajouterUnTag(event: MatAutocompleteSelectedEvent): void {
    // Ajout du tag
    if (this.tagsNouveauContenu.indexOf(event.option.viewValue) === -1) {
      this.tagsNouveauContenu.push(event.option.viewValue);
    }
    // reset du formulaire
    if (this.tagsInput) {
      this.tagsInput.nativeElement.value = '';
      this.tagsCtrl.setValue(null);
    }
  }
  /** Retrait d'un nouveau tag */
  public retirerUnTag(tag: string): void {
    // recherche du tag dans la liste
    const index = this.tagsNouveauContenu.indexOf(tag);
    // si le tag est dans la liste, on le supprime
    if (index >= 0) {
      this.tagsNouveauContenu.splice(index, 1);
    }
  }

  /** Création du contenu et envoi à l'évènement de sortie */
  public ajouterContenu(): void {
    // Création du DTO
    const c = new Contenu();
    c.quantite = 0;
    c.nom = this.nomNouveauContenu;
    c.tags = this.tagsNouveauContenu || [];
    c.tags.push(this.tag);
    c.dateCreation = this.calculerDateDuJour();

    // Ajout du nouveau objet
    this.sauvegardeService.inventaire?.contenu.push(c);

    // Puis purge
    this.viderFormulaire();
  }

  /** Purge du formulaire. */
  public viderFormulaire(): void {
    this.nomNouveauContenu = '';
    this.tagsNouveauContenu = [];
  }

  /** Calcul de la date du jour en formattage humain */
  private calculerDateDuJour(): string | null {
    return this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
  }
}
