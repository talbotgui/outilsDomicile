import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from 'projects/videotheque/src/environments/environment';

import { Videotheque, Film, Serie } from 'projects/videotheque/src/app/model/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Injectable()
export class SauvegardeService {
  /** Entête utilisés pour appeler le serveur au chargement du fichier */
  private static readonly HEADERS_CHARGEMENT_FICHIER = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8'
  );

  /** Données chargees */
  public videotheque: Videotheque|undefined;

  /** Données calculées à partir des données chargées */
  public listeTagsPrimaires: string[] = [];
  public listeTagsSecondaires: string[] = [];

  /** Constructeur pour obtenir les composants nécessaires */
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private datePipe: DatePipe) {}

  /**
   * Méthode de gestion des erreurs.
   * @param nomMethode Nom de la méthode générant l'erreur.
   * @param parametres Paramètres d'appel à la méthode.
   * @param erreur Objet erreur à traiter.
   */
  private tracerErreur(nomMethode: string, parametres: string[], erreur: HttpErrorResponse) {
    // Extraction de l'objet depuis l'URL présente dans le message
    let objet = '(' + erreur.message + ')';
    const debut = erreur.message.lastIndexOf('/');
    const fin = erreur.message.indexOf(':', debut);
    if (debut !== -1 && fin !== -1) {
      objet = erreur.message.substring(debut, fin);
    }

    let message = '';
    if (erreur.status === 0 && !erreur.ok) {
      message = 'Erreur de sécurité ou mauvais proxy ?';
    } else if (erreur.status === 401) {
      message = 'Erreur de sécurité : login/mdp/token invalide ?';
    } else if (erreur.status === 403) {
      message = "Erreur de droits pour accéder à l'objet : " + objet;
    } else if (erreur.status === 404) {
      message = "Erreur de donnée : L'objet n'existe pas : " + objet;
    } else {
      message = 'Erreur inconnue (' + erreur.message + ')';
    }
    console.info('Erreur dans la méthode ' + nomMethode + '(' + parametres + ') : ' + message);
  }

  /** Méthode sauvegardant la videotheque */
  public sauvegarderDonnees(): Observable<string> {
    //trier les films et séries dans l'ordre alphabétique
    const fonctionDeTri = (a:Film|Serie, b:Film|Serie) => {
      if (!a || !b ||!a.nom || !b.nom){
        return -1;
      }
      const aMaj = a.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      const bMaj = b.nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
      return aMaj > bMaj ? 1 : aMaj < bMaj ? -1 : 0;
    };
    if (this.videotheque){
      this.videotheque.series = this.videotheque.series.sort(fonctionDeTri);
      this.videotheque.films = this.videotheque.films.sort(fonctionDeTri);
    }

    // Donnees à envoyer
    const params = new HttpParams()
      .append('methode', 'sauvegarde')
      .append('nomFichier', environment.nomFichier)
      //to do : retirer le null,2 dés que possible
      .append('contenuFichier', JSON.stringify(this.videotheque, null, 2));

    // Options d'appels
    const options = { headers: SauvegardeService.HEADERS_CHARGEMENT_FICHIER };

    // Appel au serveur
    return this.http.post<string>(environment.urlServeur, params, options).pipe(
      tap(() => {
        this.snackBar.open('Données sauvegardées');
      }),
      // gestion d'erreur
      catchError((erreur) => {
        this.tracerErreur('appelerApi', [environment.urlServeur], erreur);
        return of('Une erreur est survenue');
      })
    );
  }

  public chargerDonnees(): Observable<boolean> {
    // Donnees à envoyer
    const donnees = 'methode=charge&nomFichier=' + environment.nomFichier;

    // Options d'appels
    const options = { headers: SauvegardeService.HEADERS_CHARGEMENT_FICHIER };

    // Appel au serveur
    return this.http.post<Videotheque>(environment.urlServeur, donnees, options).pipe(
      tap((videotheque) => {
        // Extraction de la liste des tags primaires
        let liste:string[] = [];
        liste.push(...videotheque.films.map((f) => f.tagPrimaire).filter((t) => t && t.length > 0) as string[]);
        liste.push(...videotheque.series.map((s) => s.tagPrimaire).filter((t) => t && t.length > 0) as string[]);
        this.listeTagsPrimaires = [...new Set(liste)].sort((a, b) =>
          a.toUpperCase() > b.toUpperCase() ? 1 : a.toUpperCase() < b.toUpperCase() ? -1 : 0
        );

        // Extraction de la liste des tags primaires
        liste = [];
        videotheque.films.forEach((f) => {
          if (f.tagsSecondaires) {
            liste.push(...f.tagsSecondaires.filter((t) => t && t.length > 0));
          }
        });
        videotheque.series.forEach((s) => {
          if (s.tagsSecondaires) {
            liste.push(...s.tagsSecondaires.filter((t) => t && t.length > 0));
          }
        });
        this.listeTagsSecondaires = [...new Set(liste)].sort((a, b) =>
          a.toUpperCase() > b.toUpperCase() ? 1 : a.toUpperCase() < b.toUpperCase() ? -1 : 0
        );

        // calcul de la date technique de chaque film pour être utilisée dans les onglets
        videotheque.films.forEach(
          (f) =>
            (f.dateTechnique = !f.dateDernierVisionnage
              ? ''
              : f.dateDernierVisionnage.substring(6, 10) +'/'+ f.dateDernierVisionnage.substring(3, 5) +'/'+ f.dateDernierVisionnage.substring(0, 2))
        );

        // Sauvegarde des données récupérées
        this.videotheque = videotheque;
      }),

      // Renvoi de TRUE ou FALSE en sortie de la méthode chargerDonnees
      map((videotheque) => !!videotheque),

      // gestion d'erreur
      catchError((erreur) => {
        this.tracerErreur('appelerApi', [environment.urlServeur], erreur);
        return of(false);
      })
    );
  }

  public filterLesFilmsParPremiereLettre(lettre: string): Film[] {
    if (this.videotheque) {
      return this.videotheque.films.filter((film) => 
        film && film.nom && film.nom.toUpperCase().startsWith(lettre.toUpperCase())
      );
    } else {
      return [];
    }
  }
}
