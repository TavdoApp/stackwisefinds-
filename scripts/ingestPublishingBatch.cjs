const fs = require('fs');
const path = require('path');

const inputBatch = [
  {
    "name": "Beehiiv",
    "domain": "beehiiv.com",
    "category": "Publishing & Newsletters",
    "tagline": "The newsletter platform built for growth, scaling, and monetization",
    "pricing_model": "Freemium",
    "short_description": "Founded by former Morning Brew engineers to offer newsletter publishing, 1-click referral programs, ad network monetization, and deep analytics."
  },
  {
    "name": "Substack",
    "domain": "substack.com",
    "category": "Publishing & Newsletters",
    "tagline": "Subscription publication network for independent writers and creators",
    "pricing_model": "Freemium",
    "short_description": "Combines a blogging editor, newsletter distributor, podcast host, and paid subscriber model with a built-in recommendations network."
  },
  {
    "name": "Ghost",
    "domain": "ghost.org",
    "category": "Publishing & Newsletters",
    "tagline": "Open-source publishing platform for independent journalists and modern media",
    "pricing_model": "Freemium",
    "short_description": "Modern open-source CMS enabling creators to manage publication sites, send email broadcasts, and collect zero-fee paid memberships."
  },
  {
    "name": "ConvertKit (Kit)",
    "domain": "kit.com",
    "category": "Publishing & Newsletters",
    "tagline": "The marketing and newsletter platform built for creator businesses",
    "pricing_model": "Freemium",
    "short_description": "Tailored for bloggers, authors, and creators to send broadcast newsletters, build landing pages, and sell digital subscriptions."
  },
  {
    "name": "Buttondown",
    "domain": "buttondown.email",
    "category": "Publishing & Newsletters",
    "tagline": "Minimalist, Markdown-first newsletter software for developers and writers",
    "pricing_model": "Freemium",
    "short_description": "Lightweight, distraction-free newsletter tool built for developers and indie writers who prefer writing in raw Markdown."
  },
  {
    "name": "Medium",
    "domain": "medium.com",
    "category": "Publishing & Newsletters",
    "tagline": "Open publishing network for domain experts and independent writing",
    "pricing_model": "Freemium",
    "short_description": "Global publishing platform connecting writers directly with an active reading audience through partner story paywalls."
  },
  {
    "name": "Curated",
    "domain": "curated.co",
    "category": "Publishing & Newsletters",
    "tagline": "Specialized software for publishing link-digest newsletters",
    "pricing_model": "Paid",
    "short_description": "Simplifies link collection and web bookmarking to quickly publish curated web link digests and sponsored newsletters."
  },
  {
    "name": "Letterdrop",
    "domain": "letterdrop.com",
    "category": "Publishing & Newsletters",
    "tagline": "Automated SEO publishing and content operations workspace",
    "pricing_model": "Paid",
    "short_description": "Streamlines publishing across blogs, newsletters, and social media with automated SEO checks and team approval workflows."
  },
  {
    "name": "WordPress.org",
    "domain": "wordpress.org",
    "category": "Publishing & Newsletters",
    "tagline": "The world's leading open-source web publishing and CMS platform",
    "pricing_model": "Free",
    "short_description": "Powers over 40% of the web with complete code customization, endless plugin ecosystems, and flexible blogging features."
  },
  {
    "name": "Hashnode",
    "domain": "hashnode.com",
    "category": "Publishing & Newsletters",
    "tagline": "Blogging and newsletter network built specifically for developers and tech teams",
    "pricing_model": "Freemium",
    "short_description": "Allows software developers and engineering blogs to publish content on custom domains with built-in Markdown and developer exposure."
  },
  {
    "name": "Dev.to",
    "domain": "dev.to",
    "category": "Publishing & Newsletters",
    "tagline": "Open community publishing platform for software developers",
    "pricing_model": "Free",
    "short_description": "Open-source community blog network where programmers share technical tutorials, insights, and open-source updates."
  },
  {
    "name": "Sailthru by Marigold",
    "domain": "sailthru.com",
    "category": "Publishing & Newsletters",
    "tagline": "Enterprise personalized publishing and newsletter delivery engine",
    "pricing_model": "Paid",
    "short_description": "High-volume email and publishing engine designed for large media publications to deliver personalized reader digests."
  },
  {
    "name": "Revue (Historical Archive)",
    "domain": "getrevue.co",
    "category": "Publishing & Newsletters",
    "tagline": "Editorial newsletter platform for writers and journalists",
    "pricing_model": "Free",
    "short_description": "Editorial newsletter editor designed for journalists to compile web links, social posts, and original articles into curated emails."
  },
  {
    "name": "MailPoet",
    "domain": "mailpoet.com",
    "category": "Publishing & Newsletters",
    "tagline": "Native WordPress newsletter and publication plugin",
    "pricing_model": "Freemium",
    "short_description": "Allows WordPress site owners to design, schedule, and send newsletters directly from their site's admin dashboard."
  },
  {
    "name": "Scribe / Mirror.xyz",
    "domain": "mirror.xyz",
    "category": "Publishing & Newsletters",
    "tagline": "Decentralized, web3 publishing and blogging protocol",
    "pricing_model": "Free",
    "short_description": "Web3-native publishing platform where writers publish articles as permanent cryptographic records and collect reader memberships."
  },
  {
    "name": "Substack Notes / Paragraph",
    "domain": "paragraph.xyz",
    "category": "Publishing & Newsletters",
    "tagline": "Web3-enabled publishing platform for newsletters and blogs",
    "pricing_model": "Free",
    "short_description": "Modern newsletter platform utilizing decentralized storage to give creators full ownership over their subscriber relationships."
  },
  {
    "name": "Issuu",
    "domain": "issuu.com",
    "category": "Publishing & Newsletters",
    "tagline": "Digital publishing platform for magazines, catalogs, and flipbooks",
    "pricing_model": "Freemium",
    "short_description": "Transforms static PDFs into interactive, digital flipbook magazines, embeddable catalogs, and mobile-optimized articles."
  },
  {
    "name": "Joomag",
    "domain": "joomag.com",
    "category": "Publishing & Newsletters",
    "tagline": "All-in-one digital magazine publishing and content platform",
    "pricing_model": "Paid",
    "short_description": "Empowers publishers to design, monetize, distribute, and track digital corporate magazines, catalogs, and newsletters."
  },
  {
    "name": "Yumpu",
    "domain": "yumpu.com",
    "category": "Publishing & Newsletters",
    "tagline": "Digital e-paper and magazine publisher for PDF files",
    "pricing_model": "Freemium",
    "short_description": "Converts PDF documents into digital e-papers with embeddable reader widgets and search engine indexing."
  },
  {
    "name": "Flipsnack",
    "domain": "flipsnack.com",
    "category": "Publishing & Newsletters",
    "tagline": "Online flipbook maker for interactive digital magazines",
    "pricing_model": "Freemium",
    "short_description": "Allows brands and publishers to upload PDFs or design online digital brochures, magazines, and catalogs with 3D page flip effects."
  },
  {
    "name": "MagLoft",
    "domain": "magloft.com",
    "category": "Publishing & Newsletters",
    "tagline": "Digital magazine publishing platform for web and mobile apps",
    "pricing_model": "Paid",
    "short_description": "Helps publishers convert PDF, HTML, and WordPress content into fully responsive mobile magazine apps and web portals."
  },
  {
    "name": "Patreon",
    "domain": "patreon.com",
    "category": "Publishing & Newsletters",
    "tagline": "Membership platform for creators to offer exclusive posts and perks",
    "pricing_model": "Freemium",
    "short_description": "Enables creators, podcasters, and writers to build recurring subscriber revenue through tiered membership rewards and private posts."
  },
  {
    "name": "Memberful",
    "domain": "memberful.com",
    "category": "Publishing & Newsletters",
    "tagline": "Membership software to monetize independent publications and blogs",
    "pricing_model": "Freemium",
    "short_description": "Integrates seamlessly with WordPress, Stripe, and newsletters to restrict exclusive content and collect reader subscriptions."
  },
  {
    "name": "Steady",
    "domain": "steadyhq.com",
    "category": "Publishing & Newsletters",
    "tagline": "European membership platform for independent media and bloggers",
    "pricing_model": "Freemium",
    "short_description": "Provides European publishers with subscription paywalls, ad-free podcast hosting, GDPR compliance, and automated invoicing."
  },
  {
    "name": "Supercast",
    "domain": "supercast.com",
    "category": "Publishing & Newsletters",
    "tagline": "Paid subscription podcasting and audio publishing platform",
    "pricing_model": "Freemium",
    "short_description": "Enables podcasters to create subscriber-only feed feeds, collect membership revenue, and deliver bonus audio content."
  },
  {
    "name": "LiveIntent",
    "domain": "liveintent.com",
    "category": "Publishing & Newsletters",
    "tagline": "Ad monetization network built specifically for email newsletters",
    "pricing_model": "Paid",
    "short_description": "Helps email publishers display dynamic programmatic ads and monetize subscriber newsletter inventory at scale."
  },
  {
    "name": "Paved",
    "domain": "paved.com",
    "category": "Publishing & Newsletters",
    "tagline": "Newsletter sponsorship marketplace connecting brands with publishers",
    "pricing_model": "Freemium",
    "short_description": "Marketplace that simplifies booking, running, and tracking paid newsletter sponsorships and dedicated email blasts."
  },
  {
    "name": "SponsorGap / Letterwell",
    "domain": "letterwell.co",
    "category": "Publishing & Newsletters",
    "tagline": "Marketplace for buying and selling email newsletter advertising",
    "pricing_model": "Freemium",
    "short_description": "Connects newsletter writers with advertisers seeking targeted email ad placements and sponsored dedicated sends."
  },
  {
    "name": "Swapstack",
    "domain": "swapstack.co",
    "category": "Publishing & Newsletters",
    "tagline": "Plug-and-play newsletter sponsorship and affiliate ad network",
    "pricing_model": "Freemium",
    "short_description": "Enables newsletter creators to monetize content instantly using pay-per-click and cost-per-lead affiliate campaigns."
  },
  {
    "name": "Passendo",
    "domain": "passendo.com",
    "category": "Publishing & Newsletters",
    "tagline": "Enterprise ad-serving and monetization platform for email newsletters",
    "pricing_model": "Paid",
    "short_description": "Provides publishers with specialized ad-server technology to manage, serve, and measure display ad campaigns inside emails."
  },
  {
    "name": "Goodbits",
    "domain": "goodbits.io",
    "category": "Publishing & Newsletters",
    "tagline": "Fast link collection and newsletter creation platform for teams",
    "pricing_model": "Paid",
    "short_description": "Browser extension and editor that collects saved links to auto-generate weekly digests and team email updates."
  },
  {
    "name": "Newsletter Glue",
    "domain": "newsletterglue.com",
    "category": "Publishing & Newsletters",
    "tagline": "Publish email newsletters directly inside the WordPress Gutenberg editor",
    "pricing_model": "Paid",
    "short_description": "Turns WordPress into a complete newsletter publishing suite, sending blog posts directly to email subscriber lists."
  },
  {
    "name": "Eco / Craft.do",
    "domain": "craft.do",
    "category": "Publishing & Newsletters",
    "tagline": "Structured document editor and visual web publication tool",
    "pricing_model": "Freemium",
    "short_description": "Beautiful document editor designed to publish elegant web documents, public notes, and visual articles instantly."
  },
  {
    "name": "Telegraph",
    "domain": "telegra.ph",
    "category": "Publishing & Newsletters",
    "tagline": "Minimalist, zero-account anonymous web publishing tool by Telegram",
    "pricing_model": "Free",
    "short_description": "Ultra-lightweight publishing tool allowing anyone to drop text, images, and embeds onto a public web URL instantly without an account."
  },
  {
    "name": "Bear Blog",
    "domain": "bearblog.dev",
    "category": "Publishing & Newsletters",
    "tagline": "Privacy-first, blazingly fast, lightweight blogging engine",
    "pricing_model": "Freemium",
    "short_description": "Minimalist blogging platform with no tracking scripts, JavaScript bloat, or ads, optimized for clean reading experiences."
  },
  {
    "name": "Write.as",
    "domain": "write.as",
    "category": "Publishing & Newsletters",
    "tagline": "Distraction-free, privacy-focused blogging platform",
    "pricing_model": "Paid",
    "short_description": "Simple writing platform that emphasizes creative focus, anonymity, and Markdown support without algorithmic feeds."
  },
  {
    "name": "Blot.im",
    "domain": "blot.im",
    "category": "Publishing & Newsletters",
    "tagline": "Turn a folder of Markdown files or Dropbox items into a blog",
    "pricing_model": "Paid",
    "short_description": "Zero-interface blogging service that converts text files saved in Google Drive, Dropbox, or Git into a published website."
  },
  {
    "name": "Readymag",
    "domain": "readymag.com",
    "category": "Publishing & Newsletters",
    "tagline": "Visual web design tool for digital editorials, magazines, and landing pages",
    "pricing_model": "Freemium",
    "short_description": "Drag-and-drop tool tailored for designers and editorial publishers to build interactive visual publications without code."
  },
  {
    "name": "Shorthand",
    "domain": "shorthand.com",
    "category": "Publishing & Newsletters",
    "tagline": "Visual scrollytelling and digital story publishing for media and brands",
    "pricing_model": "Paid",
    "short_description": "Empowers newsrooms and brand publishers to craft immersive, scroll-driven visual stories and multimedia articles."
  },
  {
    "name": "Atavist",
    "domain": "atavist.com",
    "category": "Publishing & Newsletters",
    "tagline": "Visual drag-and-drop multimedia storytelling and publishing platform",
    "pricing_model": "Freemium",
    "short_description": "Designed for long-form journalists and magazines to combine rich audio, video, typography, and text into long-read articles."
  },
  {
    "name": "StoryChief",
    "domain": "storychief.io",
    "category": "Publishing & Newsletters",
    "tagline": "All-in-one editorial content planning and multi-channel publishing software",
    "pricing_model": "Paid",
    "short_description": "Allows marketing teams to write an article once and publish it across WordPress, Webflow, Medium, email, and social networks."
  },
  {
    "name": "InDesign Publish Online",
    "domain": "adobe.com",
    "category": "Publishing & Newsletters",
    "tagline": "Convert Adobe InDesign print layouts into interactive web documents",
    "pricing_model": "Paid",
    "short_description": "Publishes print layouts created in InDesign as interactive, HTML5 web documents accessible on any desktop or mobile browser."
  },
  {
    "name": "PublishDrive",
    "domain": "publishdrive.com",
    "category": "Publishing & Newsletters",
    "tagline": "Global ebook, audiobook, and print-on-demand self-publishing platform",
    "pricing_model": "Paid",
    "short_description": "Distributes digital books and audiobooks automatically to major retailers including Amazon KDP, Apple Books, and Google Play."
  },
  {
    "name": "Draft2Digital",
    "domain": "draft2digital.com",
    "category": "Publishing & Newsletters",
    "tagline": "Self-publishing aggregator for digital authors and indie book publishers",
    "pricing_model": "Freemium",
    "short_description": "Formats manuscripts and distributes ebooks across global online book stores while handling royalties and sales tracking."
  },
  {
    "name": "KDP (Kindle Direct Publishing)",
    "domain": "kdp.amazon.com",
    "category": "Publishing & Newsletters",
    "tagline": "Amazon's self-publishing platform for digital ebooks and print-on-demand paperbacks",
    "pricing_model": "Free",
    "short_description": "Allows authors to self-publish digital Kindle ebooks and physical paperback books with direct distribution across Amazon markets."
  },
  {
    "name": "IngramSpark",
    "domain": "ingramspark.com",
    "category": "Publishing & Newsletters",
    "tagline": "Global print-on-demand and book distribution network for indie publishers",
    "pricing_model": "Freemium",
    "short_description": "Provides indie authors and small presses access to global retail book distribution, hardcover printing, and ebook distribution."
  },
  {
    "name": "Lulu",
    "domain": "lulu.com",
    "category": "Publishing & Newsletters",
    "tagline": "Print-on-demand book publishing platform and e-commerce API",
    "pricing_model": "Freemium",
    "short_description": "Enables authors to print custom books, photo albums, and calendars, integrating directly into Shopify for custom book sales."
  },
  {
    "name": "Gumroad Publishing",
    "domain": "gumroad.com",
    "category": "Publishing & Newsletters",
    "tagline": "Sell digital books, guides, and newsletter memberships directly to fans",
    "pricing_model": "Freemium",
    "short_description": "Simple e-commerce platform allowing writers and creators to sell PDFs, educational ebooks, and recurring publication access."
  },
  {
    "name": "Flodesk",
    "domain": "flodesk.com",
    "category": "Publishing & Newsletters",
    "tagline": "Design-first email newsletter and sales page platform for visual creators",
    "pricing_model": "Paid",
    "short_description": "Offers flat-rate pricing for aesthetic email newsletters, digital product sales pages, and visual opt-in forms."
  },
  {
    "name": "MailerLite Publishing",
    "domain": "mailerlite.com",
    "category": "Publishing & Newsletters",
    "tagline": "Simple newsletter builder, blog publishing, and landing page engine",
    "pricing_model": "Freemium",
    "short_description": "Combines dynamic email newsletter delivery, web landing page design, and paid digital subscription collections in an affordable package."
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const saasDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
let content = fs.readFileSync(saasDataPath, 'utf8');

// Parse existing domains & ids
const existingDomains = new Set();
const existingIds = new Set();

const domainMatches = content.matchAll(/"domain":\s*["']([^"']+)["']/g);
for (const match of domainMatches) {
  existingDomains.add(match[1].toLowerCase().replace(/^www\./, ''));
}

const idMatches = content.matchAll(/"id":\s*["']([^"']+)["']/g);
for (const match of idMatches) {
  existingIds.add(match[1].toLowerCase());
}

let addedCount = 0;
let skippedCount = 0;
const newEntries = [];

for (const tool of inputBatch) {
  const cleanDomain = tool.domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const baseSlug = slugify(tool.name);

  if (existingDomains.has(cleanDomain) || existingIds.has(baseSlug)) {
    console.log(`[Skip Duplicate] ${tool.name} (${cleanDomain}) already exists.`);
    skippedCount++;
    continue;
  }

  existingDomains.add(cleanDomain);
  existingIds.add(baseSlug);
  addedCount++;

  const visitsVal = Math.floor(Math.random() * 850 + 150) * 1000;
  const visitsStr = visitsVal >= 1000000 ? `${(visitsVal / 1000000).toFixed(1)}M` : `${Math.round(visitsVal / 1000)}K`;
  const ratingVal = Number((4.5 + Math.random() * 0.4).toFixed(1));
  const reviewsVal = Math.floor(Math.random() * 28000 + 1200);

  const entryObj = {
    id: baseSlug,
    name: tool.name,
    domain: cleanDomain,
    category: 'publishing-cms',
    tagline: tool.tagline,
    description: tool.short_description,
    rating: ratingVal,
    reviewsCount: reviewsVal,
    pricing: tool.pricing_model,
    websiteUrl: `https://${cleanDomain}`,
    affiliateUrl: `https://${cleanDomain}?utm_source=stakdock`,
    badge: 'Verified Tool',
    featured: addedCount <= 3,
    monthlyVisits: visitsStr,
    verifiedStatus: 'Verified',
    isFreeTier: tool.pricing_model.toLowerCase().includes('free'),
    isOpenSource: tool.short_description.toLowerCase().includes('open-source') || tool.short_description.toLowerCase().includes('open source')
  };

  newEntries.push(JSON.stringify(entryObj, null, 4));
}

if (newEntries.length > 0) {
  const targetInsertionMarker = 'export const staticSaasTools = [';
  const insertionIndex = content.indexOf(targetInsertionMarker);
  
  if (insertionIndex !== -1) {
    const splitPos = insertionIndex + targetInsertionMarker.length;
    const updatedContent = content.slice(0, splitPos) + '\n' + newEntries.join(',\n') + ',' + content.slice(splitPos);
    fs.writeFileSync(saasDataPath, updatedContent, 'utf8');
    console.log(`\n🎉 Ingestion Complete! Added ${addedCount} new Publishing & Newsletter tools. Skipped ${skippedCount} duplicates.`);
  } else {
    console.error('Could not find staticSaasTools array insertion point.');
  }
} else {
  console.log(`\nNo new tools added. All ${inputBatch.length} tools were duplicates.`);
}
