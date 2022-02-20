import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Film } from '../model/model';
import { FenetreFilmsComponent } from '../fenetreFilms/fenetreFilms.component';

@Component({ selector: 'app-titrefilms', templateUrl: './titrefilms.component.html', styleUrls: ['./titrefilms.component.scss'] })
export class titrefilmsComponent {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(public dialog: MatDialog) {}

  @Input()
  public filmAafficher: Film|undefined;

  //méthode appelée qd on clique sur le titre d'un film
  openDialog(leFilmClique: Film): void {
    //ouvre une fenetre (dailog) contenant le composant FenetreFilmsComponent
    this.dialog.open(FenetreFilmsComponent, {
      // en fournissant le film
      width: '250 px',
      data: leFilmClique,
    });
  }
}
