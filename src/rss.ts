import Parser from 'rss-parser';

// Define Feed item type
export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  headerImage?: string;
}

// Use fetch API to get data
async function fetchUrl(url: string): Promise<string> {
  console.log('Using fetch to get:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Request failed, status code: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('xml') && !contentType.includes('rss')) {
      console.warn(`Warning: Content type may not be XML: ${contentType}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching URL:', error);
    throw error;
  }
}

// Get the latest RSS items
export async function getLatestRssItems(feedUrl: string): Promise<FeedItem[]> {
  console.log('Getting RSS feed:', feedUrl);

  const parser = new Parser();
  
  try {
    // Use fetch API to get RSS content
    const xmlContent = await fetchUrl(feedUrl);
    
    // Use rss-parser to parse XML content
    const feed = await parser.parseString(xmlContent);
    
    // Get current time and 24 hours ago time point
    const now = new Date();
    const twentyFourHoursAgo = new Date(now);
    twentyFourHoursAgo.setHours(now.getHours() - 24);
    
    console.log(`Filtering items within 24 hours, current time: ${now.toISOString()}, 24 hours ago: ${twentyFourHoursAgo.toISOString()}`);
    
    // Sort by publication date, newest first, and only keep items within 24 hours
    const sortedItems = feed.items
      .map(item => ({
        title: item.title || 'No Title',
        link: item.link || '',
        pubDate: item.pubDate || new Date().toISOString(),
        content: item.content,
        contentSnippet: item.contentSnippet,
        headerImage: item.headerImage,
      }))
      .filter(item => {
        const pubDate = new Date(item.pubDate);
        return pubDate >= twentyFourHoursAgo;
      })
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    
    console.log(`Found ${feed.items.length} items, of which ${sortedItems.length} are within 24 hours`);
    
    return sortedItems;
  } catch (error) {
    console.error('Error getting RSS feed:', error);
    return [];
  }
}