import { describe, it, expect } from 'vitest';
import { convertHeaderImage } from './parseHeaderImage';

describe('FeedItem headerImage conversion', () => {
  it('should convert headerImage to X', () => {
    const headerImage: string = "https://assets.calpa.me/glenn-carstens-peters-npxXWgQ33ZQ-unsplash.avif";


    const convertedHeaderImage = convertHeaderImage(headerImage);
    expect(convertedHeaderImage).toBe('https://assets.calpa.me/telegram/glenn-carstens-peters-npxXWgQ33ZQ-unsplash.png');
  });
});

