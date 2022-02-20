import { Component } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';

@Component({ selector: 'app-onglet5', templateUrl: './onglet5.component.html', styleUrls: ['./onglet5.component.scss'] })
export class Onglet5Component {
  /** Constructeur pour injecter des composants dans mon composant */
  constructor(public sauvegardeService: SauvegardeService) {}

  enregistrer(): void {
    this.sauvegardeService.sauvegarderDonnees().subscribe();
  }
}
