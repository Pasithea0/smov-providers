// not a joke, this is a real source
import { load } from 'cheerio';

import { flags } from '@/entrypoint/utils/targets';
import { SourcererEmbed, SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';

async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  const embedPage = await ctx.proxiedFetcher(
    `https://bombthe.irish/embed/${ctx.media.type === 'movie' ? `movie/${ctx.media.tmdbId}` : `tv/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`}`,
  );
  const $ = load(embedPage);

  const embeds: SourcererEmbed[] = [];

  $('#dropdownMenu a').each((_, element) => {
    const url = new URL($(element).data('url') as string).searchParams.get('url');
    if (!url) return;
    embeds.push({ embedId: $(element).text().toLowerCase(), url: atob(url) });
  });

  return { embeds };
}

export const bombtheirishScraper = makeSourcerer({
  id: 'bombtheirish',
  name: 'BombTI',
  rank: 50,
  flags: [flags.CORS_ALLOWED],
  scrapeMovie: comboScraper,
  scrapeShow: comboScraper,
});
