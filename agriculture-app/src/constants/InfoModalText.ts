export type InfoModalTextType = 'fuel_usage_info' | 'other';
export const InfoModalText = {
  fuel_usage_info: `
    Tehnikas vienības degvielas patēriņš ir atkarīgs no velkošās tehnikas noslodzes,
    šī noslodze ir aprēķināta no tehnikas vienības nepieciešamās pret velkošās tehnikas vienības jaudu, piemēram:
    80 kw (Nepieciešamā jauda) / 100 kw (Velkošās tehnikas jauda) = 0.8 jeb 80% noslodze.
    Degvielas patēriņš ir aprēķināts izmantojot:

    velkošās tehnikas jauda (kw) * slodze (%) * Īpatnējais degvielas patēriņš (kg/kWh).

    Ir divu veidu noslodzes, darba noslodze un griešanās/apgriešanās noslodze (Noklusēti 30%).
  `
} as Record<InfoModalTextType, string>;
