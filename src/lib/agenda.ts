import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Seance = CollectionEntry<'spectacles'>['data']['dates'][number] & {
  spectacle: string;
  slug: string;
};

/**
 * Rassemble les dates saisies dans chaque spectacle et les trie
 * chronologiquement. `aVenir` sert à la page Agenda, `passees` à l'archive.
 */
export async function getAgenda() {
  const spectacles = await getCollection('spectacles');

  const seances: Seance[] = spectacles.flatMap((s) =>
    s.data.dates.map((d) => ({ ...d, spectacle: s.data.titre, slug: s.id })),
  );

  // Une date reste « à venir » jusqu'à la fin de sa journée.
  const limite = new Date();
  limite.setHours(0, 0, 0, 0);

  const aVenir = seances
    .filter((s) => s.date >= limite)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const passees = seances
    .filter((s) => s.date < limite)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return { aVenir, passees };
}

const jour = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });
const numero = new Intl.DateTimeFormat('fr-FR', { day: 'numeric' });
const mois = new Intl.DateTimeFormat('fr-FR', { month: 'short' });
const complet = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatDate = {
  jour: (d: Date) => jour.format(d),
  numero: (d: Date) => numero.format(d),
  mois: (d: Date) => mois.format(d).replace('.', ''),
  annee: (d: Date) => d.getFullYear(),
  complet: (d: Date) => complet.format(d),
  iso: (d: Date) => d.toISOString().slice(0, 10),
};
