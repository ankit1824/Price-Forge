// Constants for platforms and their details
const PLATFORMS = {
  BLINKIT: 'blinkit',
  ZEPTO: 'zepto',
  INSTAMART: 'instamart'
};

const PLATFORM_URLS = {
  blinkit: 'https://www.blinkit.com',
  zepto: 'https://www.zeptomart.com',
  instamart: 'https://www.instamart.in'
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

module.exports = {
  PLATFORMS,
  PLATFORM_URLS,
  CACHE_DURATION
};
