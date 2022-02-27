import { Component, Input } from '@angular/core';
import { Contenu } from '../model/model';
import { SauvegardeService } from '../services/sauvegarde.service';

@Component({ selector: 'app-lister', templateUrl: './lister.html', styleUrls: [] })
export class ListerComponent {

  /** Tags de filtrage */
  @Input()
  public tag: string = '';

  /** Constructeur pour injecter des composants dans mon composant */
  constructor(private sauvegardeService: SauvegardeService) { }

  /** Accès à la liste  */
  get listeAafficher(): Contenu[] | undefined {
    return this.sauvegardeService.inventaire?.contenu.filter(c => !c.tags || c.tags.indexOf(this.tag) !== -1);
  }

  /** Modification de la quantité du contenu */
  public modifierQuantite(c: Contenu, delta: number): void {
    if (c.quantite + delta >= 0) {
      c.quantite += delta;
    }
  }

  /** Suppression d'un élément de l'inventaire */
  public supprimer(c: Contenu): void {
    const index = this.sauvegardeService.inventaire?.contenu.indexOf(c);
    if (typeof index != "undefined" && index !== -1) {
      this.sauvegardeService.inventaire?.contenu.splice(index, 1);
    }
  }

  /** Ajout du contenu dans l'inventaire */
  public ajouterContenu(dto: Contenu): void {

    // Création du
    const c = new Contenu();
    c.quantite = dto.quantite;
    c.nom = dto.nom;
    c.tags = dto.tags;
    c.dateCreation = dto.dateCreation;

    // Ajout du nouveau objet
    this.sauvegardeService.inventaire?.contenu.push(c);

  }
}
