export async function search({
  query,
  apiKey,
}: {
  query: string;
  apiKey: string;
}) {
  const res = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    }
  );
  if (!res.ok) {
    throw new Error(
      `fetch failed status ${res.status} res ${await res.text()}`
    );
  }

  return (await res.json()) as SearchResponse;
}

interface SearchResponse {
  _type: string;
  queryContext: QueryContext;
  webPages: WebAnswer;
  images: ImageAnswer;
  news: NewsAnswer;
  relatedSearches: RelatedSearchAnswer;
  videos: VideoAnswer;
  rankingResponse: RankingResponse;
}

interface RankingResponse {
  mainline: RankingGroup;
}

interface RankingGroup {
  items: RankingItem[];
}

interface RankingItem {
  answerType: string;
  resultIndex?: number;
  value: Identifiable;
}

interface Identifiable {
  id: string;
}

interface VideoAnswer {
  id: string;
  readLink: string;
  webSearchUrl: string;
  isFamilyFriendly: boolean;
  value: Video[];
  scenario: string;
}

interface Video {
  webSearchUrl: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  datePublished: string;
  publisher: Publisher[];
  creator: Publisher;
  isAccessibleForFree: boolean;
  contentUrl: string;
  hostPageUrl: string;
  encodingFormat: string;
  hostPageDisplayUrl: string;
  width: number;
  height: number;
  duration: string;
  motionThumbnailUrl?: string;
  embedHtml: string;
  allowHttpsEmbed: boolean;
  viewCount: number;
  thumbnail: MediaSize;
  allowMobileEmbed: boolean;
  isSuperfresh: boolean;
}

interface Publisher {
  name: string;
}

interface RelatedSearchAnswer {
  id: string;
  value: Query[];
}

interface Query {
  text: string;
  displayText: string;
  webSearchUrl: string;
}

interface NewsAnswer {
  id: string;
  readLink: string;
  value: NewsArticle[];
}

interface NewsArticle {
  contractualRules: ContractualRule[];
  name: string;
  url: string;
  image: Image;
  description: string;
  provider: Organization[];
  datePublished: string;
  about?: About[];
}

interface About {
  readLink: string;
  name: string;
}

interface Organization {
  _type: string;
  name: string;
}

interface ContractualRule {
  _type: string;
  text: string;
}

interface ImageAnswer {
  id: string;
  readLink: string;
  webSearchUrl: string;
  isFamilyFriendly: boolean;
  value: Image[];
}

interface Image {
  webSearchUrl: string;
  name: string;
  thumbnailUrl: string;
  datePublished: string;
  contentUrl: string;
  hostPageUrl: string;
  contentSize: string;
  encodingFormat: string;
  hostPageDisplayUrl: string;
  width: number;
  height: number;
  thumbnail: MediaSize;
}

interface MediaSize {
  width: number;
  height: number;
}

interface WebAnswer {
  webSearchUrl: string;
  totalEstimatedMatches: number;
  value: WebPage[];
}

interface WebPage {
  id: string;
  name: string;
  url: string;
  datePublished: string;
  datePublishedDisplayText?: string;
  isFamilyFriendly: boolean;
  displayUrl: string;
  snippet: string;
  dateLastCrawled: string;
  cachedPageUrl: string;
  language: string;
  isNavigational: boolean;
  datePublishedFreshnessText?: string;
}

interface QueryContext {
  originalQuery: string;
}
