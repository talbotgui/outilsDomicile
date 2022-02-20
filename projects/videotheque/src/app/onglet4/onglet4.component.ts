import { Component } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';
import { Serie, Film } from '../model/model';

@Component({ selector: 'app-onglet4', templateUrl: './onglet4.component.html', styleUrls: ['./onglet4.component.scss'] })
export class Onglet4Component {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService) {}

  public listeTagsPrimaires = this.sauvegardeService.listeTagsPrimaires;
  public listeTagsSecondaires = this.sauvegardeService.listeTagsSecondaires;
  public champRecherche: string='';
  private listeTagsPrimairesCoches = new Set();
  private listeTagsSecondairesCoches = new Set();

  // la liste des films affichés dans onglet 4
  public get listeFilms() {
    //elle vient de la liste des films dispo sur le serveur
    return this.sauvegardeService.videotheque?.films
      .filter(this.filtrageParTag.bind(this))
      .filter(this.filtrageParRecherche.bind(this))
      .filter(this.filtrageParDuree.bind(this));
  }
  // la liste des series affichées dans onglet 4
  public get listeSeries() {
    //elle vient de la liste des films dispo sur le serveur
    return this.sauvegardeService.videotheque?.series
      .filter(this.filtrageParTag.bind(this))
      .filter(this.filtrageParRecherche.bind(this))
      .filter(this.filtrageParDuree.bind(this));
  }
  // Les données du formulaire présent dans "recherche par durée"
  public dureeMin: number|undefined;
  public dureeMax: number|undefined;

  //méthode pour stocker le tag primaire coché ou non
  public modifierTagPrimaire(tag: string, caseCochee: boolean) {
    if (caseCochee == true) {
      this.listeTagsPrimairesCoches.add(tag);
    } else {
      this.listeTagsPrimairesCoches.delete(tag);
    }
  }

  //méthode pour stocker le tag secondaire coché ou non
  public modifierTagSecondaire(tag: string, caseCochee: boolean) {
    if (caseCochee == true) {
      this.listeTagsSecondairesCoches.add(tag);
    } else {
      this.listeTagsSecondairesCoches.delete(tag);
    }
  }

  /**Super méthode de filtrage des films et des séries */
  private filtrageParDuree(fOuS: Film | Serie) {
    // si pas de valeur dans le fitre, on laisse passer tous les films
    if (!this.dureeMin && !this.dureeMax) {
      return true;
    }
    // Si pas de durée et filtre actif
    else if (!fOuS.duree) {
      return false;
    }
    // Sinon on vérifie la durée
    const dureeFilm = parseInt(fOuS.duree);
    if (this.dureeMin && dureeFilm < this.dureeMin) {
      return false;
    } else if (this.dureeMax && dureeFilm > this.dureeMax) {
      return false;
    } else {
      return true;
    }
  }

  /**Super méthode de filtrage des films et des séries */
  private filtrageParTag(fOuS: Film | Serie) {
    // si aucun tag n'est coché, on affiche toute la liste des films
    if (this.listeTagsPrimairesCoches.size == 0 && this.listeTagsSecondairesCoches.size == 0) {
      return true;
    }
    // Si seuls des tags primaires sont cochés
    else if (this.listeTagsPrimairesCoches.size != 0 && this.listeTagsSecondairesCoches.size == 0) {
      return this.listeTagsPrimairesCoches.has(fOuS.tagPrimaire);
    }
    // Si seuls des tags secondaires sont cochés
    else if (this.listeTagsPrimairesCoches.size == 0 && this.listeTagsSecondairesCoches.size != 0) {
      return fOuS.tagsSecondaires && [...this.listeTagsSecondairesCoches].every((e) => fOuS.tagsSecondaires.indexOf(e as string) != -1);
    }
    // Si des tags primaires et secondaires sont cochés
    else if (this.listeTagsPrimairesCoches.size != 0 && this.listeTagsSecondairesCoches.size != 0) {
      return (
        this.listeTagsPrimairesCoches.has(fOuS.tagPrimaire) &&
        fOuS.tagsSecondaires &&
        [...this.listeTagsSecondairesCoches].every((e) => fOuS.tagsSecondaires.indexOf(e as string) != -1)
      );
    }
    // par défaut, on n'affiche pas ce film
    else {
      return false;
    }
  }

  /**Super méthode de filtrage des films et des séries */
  private filtrageParRecherche(fOuS: Film | Serie) {
    return !this.champRecherche || !fOuS.nom || fOuS.nom.toUpperCase().indexOf(this.champRecherche.toUpperCase()) > -1;
  }
}
