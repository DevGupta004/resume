/**
 * Service to fetch Medium stories from RSS feed
 * Medium RSS feed format: https://medium.com/feed/@username
 */

const MEDIUM_RSS_URL = 'https://medium.com/feed/@devgupta007';

/**
 * Parse XML/RSS feed and extract article data
 */
const parseRSSFeed = (xmlText) => {
  try {
    // Extract items from RSS feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const items = [];
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      // Extract title
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Untitled';

      // Extract link
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const link = linkMatch ? linkMatch[1] : '';

      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      const pubDate = pubDateMatch ? pubDateMatch[1] : '';

      // Extract description/content
      const descriptionMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
      const description = descriptionMatch ? (descriptionMatch[1] || descriptionMatch[2]) : '';

      // Extract image from content:encoded or description
      const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/);
      const content = contentMatch ? contentMatch[1] : description;
      
      // Try to extract image URL from content
      const imageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
      const imageUrl = imageMatch ? imageMatch[1] : null;

      // Extract categories/tags
      const categoryMatches = itemContent.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g);
      const categories = categoryMatches 
        ? categoryMatches.map(cat => {
            const catMatch = cat.match(/<!\[CDATA\[(.*?)\]\]>/);
            return catMatch ? catMatch[1] : '';
          }).filter(Boolean)
        : [];

      // Clean HTML tags from description for preview
      const cleanDescription = description
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim()
        .substring(0, 200) + (description.length > 200 ? '...' : '');

      items.push({
        title: title.trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
        description: cleanDescription,
        imageUrl,
        categories,
      });
    }

    return items;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    return [];
  }
};

/**
 * Fetch Medium stories from RSS feed
 */
export const fetchMediumStories = async () => {
  try {
    // Use CORS proxy for web, direct fetch for mobile
    const isWeb = typeof window !== 'undefined';
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const url = isWeb ? `${proxyUrl}${encodeURIComponent(MEDIUM_RSS_URL)}` : MEDIUM_RSS_URL;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Medium feed: ${response.status}`);
    }

    let xmlText;
    if (isWeb) {
      const data = await response.json();
      xmlText = data.contents;
    } else {
      xmlText = await response.text();
    }

    const stories = parseRSSFeed(xmlText);
    return stories;
  } catch (error) {
    console.error('Error fetching Medium stories:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  } catch (error) {
    return dateString;
  }
};
