import { Component } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';
import { MatDialog } from '@angular/material/dialog';
import { FenetreSeriesComponent } from '../fenetreseries/fenetreseries.component';
import { Serie } from '../model/model';
import { DatePipe } from '@angular/common';

@Component({ selector: 'app-onglet2', templateUrl: './onglet2.component.html', styleUrls: ['./onglet2.component.scss'] })
export class Onglet2Component {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService, public dialog: MatDialog, private formateurDeDate: DatePipe) {}

  public alphabet = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');

  // méthode appelée qd on clique sur une lettre parmi les filtres
  // on a la lettre cliquée en paramètre (ici : lettre)
  filtrer(lettre: string): void {
    // si la lettre est identique à celle cliquée juste avant
    if (lettre === this.lettreClique) {
      //alors on vide le contenu de LettreClique
      this.lettreClique = undefined;
    }
    // sinon on garde la valeur de la lettre dans une variable
    else {
      this.lettreClique = lettre;
    }
  }

  // variable contenant la dernière lettre cliquée
  // lien entre la variable lettre de la méthode "filtrer" (dessus) et la liste des séries (dessous)
  public lettreClique: string|undefined;

  // la liste des séries affichées dans onglet 2
  public get listeSeries() :Serie[]{
    if (this.sauvegardeService.videotheque){
      //elle vient de la liste des séries dispo sur le serveur
      return (
        this.sauvegardeService.videotheque.series
          //liste filtrée par les noms qui commencent par la lettre cliquée
          .filter((e) => this.lettreClique && e && e.nom && e.nom.toUpperCase().startsWith(this.lettreClique))
      );
    } else {
      return [];
    }
  }

  // créer une série
  public creerSerie() {
    const nouvelleSerie = new Serie();
    nouvelleSerie.nom = '';
    nouvelleSerie.dateEnregistementVideotheque = this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
    nouvelleSerie.tagsSecondaires = [];
    nouvelleSerie.nombreEpisodes = [];

    if (this.sauvegardeService.videotheque) {
      this.sauvegardeService.videotheque.series.push(nouvelleSerie);
    }
    this.dialog.open(FenetreSeriesComponent, {
      width: '250 px',
      data: nouvelleSerie,
    });
  }
}
