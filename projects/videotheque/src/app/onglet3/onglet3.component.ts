import { Component } from '@angular/core';
import { SauvegardeService } from '../services/sauvegarde.service';
import { Film, Serie } from '../model/model';

@Component({ selector: 'app-onglet3', templateUrl: './onglet3.component.html', styleUrls: ['./onglet3.component.scss'] })
export class Onglet3Component {
  /** Constructeur pour récupérer les composants */
  constructor(private serviceSauvegarde: SauvegardeService) {}

  /* renvoi des 10 premiers films triés par date de dernier visionnage (dateTechnique) */
  public get listeDerniersFilmsVus(): Film[] {
    if (this.serviceSauvegarde.videotheque){
      return this.serviceSauvegarde.videotheque.films
        .filter((f) => f.dateDernierVisionnage && f.dateDernierVisionnage.length > 0)
        .sort((a, b) => (a.dateTechnique > b.dateTechnique ? -1 : a.dateTechnique < b.dateTechnique ? 1 : 0))
        .slice(0, 10);
    } else {
      return [];
    }
  }

  /* renvoi des films marqué "à voir" */
  public get listeFilmsAvoir(): Film[] {
    if (this.serviceSauvegarde.videotheque){
      return this.serviceSauvegarde.videotheque.films.filter((f) => {
        return f.aVoir;
      });
    } else {
      return [];
    }
  }
  /* renvoi des séries marqué "à voir" */
  public get listeSeriesAvoir(): Serie[] {
    if (this.serviceSauvegarde.videotheque){
      return this.serviceSauvegarde.videotheque.series.filter((f) => {
        return f.aVoir;
      });
    } else {
      return [];
    }
  }

  /* renvoi les séries en cours*/
  public get listeSeriesEnCours(): Serie[] {
    if (this.serviceSauvegarde.videotheque){
      return this.serviceSauvegarde.videotheque.series.filter(
        (s) =>
          s.dernierEpisodeVu &&
          s.dernierEpisodeVu.length > 0 &&
          s.nombreEpisodes &&
          s.nombreEpisodes.length > 0 &&
          s.dernierEpisodeVu !== s.nombreEpisodes.length + '-' + s.nombreEpisodes[s.nombreEpisodes.length - 1]
      );
    } else {
      return [];
    }
  }
}
