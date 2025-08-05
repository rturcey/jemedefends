export type OuiNon = 'oui' | 'non';
export type Nature = 'bien' | 'numerique';
export type EtatBien = 'neuf' | 'occasion';
export type Delai = 'dans' | 'hors';
export type Defaut = 'panne' | 'nonconformite' | 'retard';

export interface Answers {
  vendeur?: 'professionnel' | 'particulier';
  usagePersonnel?: OuiNon;
  nature?: Nature;
  etatBien?: EtatBien;
  defautNumerique?: OuiNon;
  vendeurUE?: OuiNon;
  delai?: Delai;
  defaut?: Defaut;
}

export interface EligibilityResult {
  verdict: 'eligible' | 'non_eligible' | 'incertain';
  reasons: string[];
  hardIneligible?: boolean;
}
