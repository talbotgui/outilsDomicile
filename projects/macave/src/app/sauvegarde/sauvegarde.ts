import { Component } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';

@Component({ selector: 'app-sauvegarde', templateUrl: './sauvegarde.html', styleUrls: ['./sauvegarde.scss'] })
export class SauvegardeComponent {

  public sauvegardeEnCours = false;

  public constructor(private sauvegardeService: SauvegardeService) { }

  public sauvegarder(): void {
    this.sauvegardeEnCours = true;
    this.sauvegardeService.sauvegarderDonnees().subscribe(() => this.sauvegardeEnCours = false);
  }
}
