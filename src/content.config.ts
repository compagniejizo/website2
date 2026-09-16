import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Une représentation : une date, un lieu, un lien de billetterie.
 * C'est le seul objet que l'auteur remplit pour alimenter l'agenda.
 */
const representation = z.object({
  date: z.coerce.date(), // 2026-11-14  (ou 2026-11-14T20:30)
  heure: z.string().optional(), // "20h30"
  lieu: z.string(), // "Théâtre de la Cité"
  ville: z.string(), // "Nantes"
  billetterie: z.string().url().optional(), // lien de réservation
  complet: z.boolean().default(false),
  note: z.string().optional(), // "Séance scolaire", "Sur réservation"…
});

const spectacles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/spectacles' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      accroche: z.string().optional(),
      resume: z.string(),
      affiche: image().optional(),
      annee: z.number().optional(),
      duree: z.string().optional(),
      distribution: z.array(z.string()).default([]),
      enTournee: z.boolean().default(true),
      ordre: z.number().default(99), // tri sur la page Spectacles
      dates: z.array(representation).default([]),
    }),
});

const artistes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artistes' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      role: z.string(), // "Comédienne, masque"
      portrait: image().optional(), // ./images/prenom-nom.jpg
      extrait: z.string().optional(), // une ou deux phrases pour l'aperçu
      ordre: z.number().default(99),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      description: z.string(), // résumé affiché dans la liste et dans les partages
      date: z.coerce.date(),
      maj: z.coerce.date().optional(),
      auteur: z.string().default('Compagnie Jizo'),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
      brouillon: z.boolean().default(false),
    }),
});

export const collections = { spectacles, artistes, blog };
