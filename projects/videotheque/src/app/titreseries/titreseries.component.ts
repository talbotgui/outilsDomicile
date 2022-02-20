import { Component, Input } from '@angular/core';
import { Serie } from '../model/model';
import { FenetreSeriesComponent } from '../fenetreseries/fenetreseries.component';
import { MatDialog } from '@angular/material/dialog';

@Component({ selector: 'app-titreseries', templateUrl: './titreseries.component.html', styleUrls: ['./titreseries.component.scss'] })
export class titreseriesComponent {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(public dialog: MatDialog) {}

  @Input()
  public serieAafficher: Serie|undefined;

  //méthode appelée qd on clique sur le titre d'une série
  openDialog(laSerieClique: Serie): void {
    const dialogRef = this.dialog.open(FenetreSeriesComponent, {
      width: '300 px',
      data: laSerieClique,
    });
  }
}
