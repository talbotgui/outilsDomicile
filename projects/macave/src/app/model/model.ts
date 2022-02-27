export class Inventaire {
  public dateMiseAjour: string|undefined;
  public contenuArmoire: Contenu[] = [];
  public contenuCongelateur: ContenuCongelateur[] = [];
  public contenuVins: Contenu[] = [];
}

export class Contenu {
  public nom: string|undefined;
  public dateCreation: string|null|undefined;
  public tags: string[]=[];
  public dateTechnique: string = '';
  public quantite: number = 0;
}

export class ContenuCongelateur extends Contenu{
  public enBas: boolean = true;
}