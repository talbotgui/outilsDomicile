export class Videotheque {
  public dateMiseAjour: string|undefined;
  public films: Film[]=[];
  public series: Serie[]=[];
  public blocNote: string|undefined;
}

export class Film {
  public nom: string|undefined;
  public nomFichier: string|undefined;
  public dateEnregistementVideotheque: string|null|undefined;
  public dateDernierVisionnage: string|null|undefined;
  public tagPrimaire: string|undefined;
  public tagsSecondaires: string[]=[];
  public dateTechnique: string='';
  public duree: string|undefined;
  public aVoir: boolean=false;
  public lienInternet: string|undefined;
}

export class Serie {
  public nom: string|undefined;
  public emplacement: string|undefined;
  public dateEnregistementVideotheque: string|undefined|null;
  public dateDernierVisionnage: string|null|undefined;
  public nombreEpisodes: number[]=[];
  public dernierEpisodeVu: string|undefined;
  public tagPrimaire: string|undefined;
  public tagsSecondaires: string[]=[];
  public duree: string|undefined;
  public aVoir: boolean=false;
  public lienInternet: string|undefined;
}
