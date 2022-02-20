import { Component, OnInit } from '@angular/core';
import { SauvegardeService } from './services/sauvegarde.service';

@Component({ selector: 'app-root', templateUrl: './app.component.html', styleUrls: ['./app.component.scss'] })
export class AppComponent implements OnInit {
  public afficherApplication = false;

  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService) {}

  // Au chargement de l'application
  ngOnInit(): void {
    // Chargement des données de la vidéothèque depuis le serveur de la maison
    this.sauvegardeService.chargerDonnees().subscribe((statut) => {
      // Si le statut est FAUX
      if (statut === false) {
        console.log('erreur au chargement des données');
        // } else {
        //     this.sauvegardeService.videotheque.dateMiseAjour = 'toto';
        //     this.sauvegardeService.sauvegarderDonnees().subscribe(() => console.log('c fait'));
      } else {
        this.afficherApplication = true;
      }
    });
  }
}
