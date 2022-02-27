import { Component } from '@angular/core';
import { ContenuCongelateur } from './model/model';
import { SauvegardeService } from './services/sauvegarde.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public afficherApplication = false;

  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService) {}

  // Au chargement de l'application
  ngOnInit(): void {
    // Chargement des données de la vidéothèque depuis le serveur de la maison
    this.sauvegardeService.chargerDonnees().subscribe((statut) => {
      if (statut === false) {
        console.log('erreur au chargement des données');
      } else {
        this.afficherApplication = true;
      }
    });
  }
}
