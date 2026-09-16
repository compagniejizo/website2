import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = (await getCollection('blog', ({ data }) => !data.brouillon)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: 'Compagnie Jizo — Journal',
    description: 'Carnets de création, retours de stage et nouvelles de la compagnie.',
    site: context.site,
    customData: '<language>fr-fr</language>',
    items: articles.map((a) => ({
      title: a.data.titre,
      description: a.data.description,
      pubDate: a.data.date,
      author: a.data.auteur,
      link: `/blog/${a.id}/`,
    })),
  });
}
