import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Inventaire } from '../model/model';

@Injectable()
export class SauvegardeService {
  /** Entête utilisés pour appeler le serveur au chargement du fichier */
  private static readonly HEADERS_CHARGEMENT_FICHIER = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8'
  );

  /** Données chargees */
  public inventaire: Inventaire|undefined;
  public tousLesTags:string[] = [];

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

  /** Méthode sauvegardant la inventaire */
  public sauvegarderDonnees(): Observable<string> {

    // Donnees à envoyer
    const params = new HttpParams()
      .append('methode', 'sauvegarde')
      .append('nomFichier', environment.nomFichier)
      .append('contenuFichier', JSON.stringify(this.inventaire, null, 2));

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
    return this.http.post<Inventaire>(environment.urlServeur, donnees, options).pipe(
      tap((inventaire) => {

        // Extraction de la liste des tags
        this.tousLesTags= [];
        [inventaire.contenuArmoire, inventaire.contenuCongelateur, inventaire.contenuVins].forEach((liste) => {
          liste.forEach(c=>{
            if (c.tags) {
              this.tousLesTags.push(...c.tags.filter((t) => t && t.length > 0 && this.tousLesTags.indexOf(t) === -1));
            }
          });
        });

        // calcul de la date technique pour être utilisée dans les onglets
        [inventaire.contenuArmoire, inventaire.contenuCongelateur, inventaire.contenuVins].forEach((liste) => {
          liste.forEach((c) =>c.dateTechnique = !c.dateCreation? '': c.dateCreation.substring(6, 10) +'/'+ c.dateCreation.substring(3, 5) +'/'+ c.dateCreation.substring(0, 2));
        });

        // Sauvegarde des données récupérées
        this.inventaire = inventaire;
      }),

      // Renvoi de TRUE ou FALSE en sortie de la méthode chargerDonnees
      map((inventaire) => !!inventaire),

      // gestion d'erreur
      catchError((erreur) => {
        this.tracerErreur('appelerApi', [environment.urlServeur], erreur);
        return of(false);
      })
    );
  }
}
