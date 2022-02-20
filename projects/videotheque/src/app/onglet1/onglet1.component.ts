import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SauvegardeService } from '../services/sauvegarde.service';
import { FenetreFilmsComponent } from '../fenetreFilms/fenetreFilms.component';
import { Film } from '../model/model';

@Component({ selector: 'app-onglet1', templateUrl: './onglet1.component.html', styleUrls: ['./onglet1.component.scss'] })
export class Onglet1Component {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService, public dialog: MatDialog, private formateurDeDate: DatePipe) {}

  //variable contenant le tableau des lettres de l'alphabet
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
  // lien entre la variable lettre de la méthode "filtrer" (dessus) et la liste des films (dessous)
  public lettreClique: string|undefined;

  // la liste des films affichés dans onglet 1
  public get listeFilms():Film[] {
    if (this.sauvegardeService.videotheque){
    //elle vient de la liste des films dispo sur le serveur
    return (
      this.sauvegardeService.videotheque.films
        //liste filtrée par les noms qui commencent par la lettre cliquée
        .filter((e) => this.lettreClique && e && e.nom && e.nom.toUpperCase().startsWith(this.lettreClique))
    );
    } else {
      return [];
    }
  }

  // créer un film
  public creerFilm() {
    const nouveauFilm = new Film();
    nouveauFilm.nom = '';
    nouveauFilm.dateEnregistementVideotheque = this.formateurDeDate.transform(new Date(), 'dd/MM/yyyy');
    nouveauFilm.tagsSecondaires = [];

    if (this.sauvegardeService.videotheque) {
      this.sauvegardeService.videotheque.films.push(nouveauFilm);
      this.dialog.open(FenetreFilmsComponent, {
        width: '250 px',
        data: nouveauFilm,
      });
    }
  }
}
