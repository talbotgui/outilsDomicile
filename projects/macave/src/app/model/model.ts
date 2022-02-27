export class Inventaire {
  public dateMiseAjour: string | undefined;
  public contenu: Contenu[] = [];
}

export class Contenu {
  public nom: string | undefined;
  public dateCreation: string | null | undefined;
  public tags: string[] = [];
  public dateTechnique: string = '';
  public quantite: number = 0;
}