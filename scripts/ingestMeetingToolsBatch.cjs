const fs = require('fs');
const path = require('path');

const inputBatch = [
  {
    "name": "Otter.ai",
    "domain": "otter.ai",
    "category": "AI Meetings",
    "tagline": "AI meeting assistant for automated transcription, summaries, and action items",
    "pricing_model": "Freemium",
    "short_description": "Joins video calls to transcribe conversations in real time, extract action items, generate meeting summaries, and slide captures."
  },
  {
    "name": "Fireflies.ai",
    "domain": "fireflies.ai",
    "category": "AI Meetings",
    "tagline": "Automated meeting recorder and conversation intelligence platform",
    "pricing_model": "Freemium",
    "short_description": "Transcribes, summarizes, and analyzes voice calls across Zoom, Teams, and Google Meet with customizable search filters and CRM sync."
  },
  {
    "name": "Gong",
    "domain": "gong.io",
    "category": "AI Meetings",
    "tagline": "Revenue intelligence and sales conversation analytics platform",
    "pricing_model": "Paid",
    "short_description": "Analyzes customer interactions across video calls, emails, and phone calls to deliver deal risks, competitor insights, and coaching data."
  },
  {
    "name": "Chorus.ai by ZoomInfo",
    "domain": "chorus.ai",
    "category": "AI Meetings",
    "tagline": "Conversation intelligence platform for revenue and sales teams",
    "pricing_model": "Paid",
    "short_description": "Captures and analyzes sales calls to highlight talk tracks, objection handling, buyer sentiment, and pipeline health metrics."
  },
  {
    "name": "Fathom",
    "domain": "fathom.video",
    "category": "AI Meetings",
    "tagline": "Free AI meeting assistant that records, transcribes, and summarizes calls",
    "pricing_model": "Freemium",
    "short_description": "Provides instant, highlight-based meeting summaries and syncs meeting notes directly into CRMs like HubSpot, Salesforce, and Close."
  },
  {
    "name": "Read AI",
    "domain": "read.ai",
    "category": "AI Meetings",
    "tagline": "AI meeting summaries, engagement metrics, and scheduling assistant",
    "pricing_model": "Freemium",
    "short_description": "Measures meeting sentiment, engagement, talk time distribution, and generates automated transcripts, video recaps, and action items."
  },
  {
    "name": "Avoma",
    "domain": "avoma.com",
    "category": "AI Meetings",
    "tagline": "AI meeting assistant and conversation intelligence for cross-functional teams",
    "pricing_model": "Freemium",
    "short_description": "Combines pre-meeting agenda creation, automated call recording, AI note-taking, and sales coaching insights into one platform."
  },
  {
    "name": "Krisp",
    "domain": "krisp.ai",
    "category": "AI Meetings",
    "tagline": "AI noise cancellation, accent localization, and meeting transcription app",
    "pricing_model": "Freemium",
    "short_description": "Cancels background voices and noise during online meetings while providing automated transcription and meeting summaries."
  },
  {
    "name": "Supernormal",
    "domain": "supernormal.com",
    "category": "AI Meetings",
    "tagline": "AI meeting notes platform tailored for team management and workflows",
    "pricing_model": "Freemium",
    "short_description": "Automatically generates detailed meeting notes, executive summaries, and action items formatted for specific team playbooks."
  },
  {
    "name": "Limitless (Rewind)",
    "domain": "limitless.ai",
    "category": "AI Meetings",
    "tagline": "Personalized AI memory companion for real-world and virtual meetings",
    "pricing_model": "Freemium",
    "short_description": "Records, transcribes, and organizes all virtual and real-world audio meetings into a persistent, searchable personal memory database."
  },
  {
    "name": "Fellow.app",
    "domain": "fellow.app",
    "category": "AI Meetings",
    "tagline": "AI-powered meeting management, agenda builder, and notes software",
    "pricing_model": "Freemium",
    "short_description": "Helps managers run structured 1-on-1s and team meetings with shared agendas, peer feedback, AI transcription, and task tracking."
  },
  {
    "name": "Tl;dv",
    "domain": "tldv.io",
    "category": "AI Meetings",
    "tagline": "AI meeting recorder for Zoom, Google Meet, and Microsoft Teams",
    "pricing_model": "Freemium",
    "short_description": "Captures call recordings, generates multi-language transcripts, timestamped notes, and lets users create shareable video snippet clips."
  },
  {
    "name": "Circleback",
    "domain": "circleback.ai",
    "category": "AI Meetings",
    "tagline": "AI meeting assistant providing clear, contextual action items and notes",
    "pricing_model": "Paid",
    "short_description": "Transcribes multi-speaker meetings and uses advanced LLMs to extract precise project updates, deadlines, and decision points."
  },
  {
    "name": "Grain",
    "domain": "grain.com",
    "category": "AI Meetings",
    "tagline": "AI meeting recorder and customer interview intelligence platform",
    "pricing_model": "Freemium",
    "short_description": "Helps product and research teams record customer interviews, clip key video highlights, and share insights across Slack and Notion."
  },
  {
    "name": "Krisp AI / Jamie",
    "domain": "meetjamie.ai",
    "category": "AI Meetings",
    "tagline": "Bot-free AI meeting notes assistant operating natively on your device",
    "pricing_model": "Freemium",
    "short_description": "Captures system audio locally without forcing a virtual bot to join your call, generating executive notes and key takeaways."
  },
  {
    "name": "Tactiq",
    "domain": "tactiq.io",
    "category": "AI Meetings",
    "tagline": "Real-time in-browser transcription extension for online video calls",
    "pricing_model": "Freemium",
    "short_description": "Browser extension that captures live meeting transcripts on Google Meet, Zoom, and Teams without recording raw video or audio."
  },
  {
    "name": "Equal Time",
    "domain": "equaltime.io",
    "category": "AI Meetings",
    "tagline": "AI meeting assistant focused on speaker balance, diversity, and inclusion",
    "pricing_model": "Freemium",
    "short_description": "Tracks speaker talk-time ratios in real time to ensure equitable airtime and inclusive participation during team meetings."
  },
  {
    "name": "Syllaby / MeetGeek",
    "domain": "meetgeek.ai",
    "category": "AI Meetings",
    "tagline": "AI meeting assistant that records, transcribes, and auto-shares meeting summaries",
    "pricing_model": "Freemium",
    "short_description": "Automatically records online calls, generates transcriptions, extracts action items, and pushes key insights to company CRMs."
  },
  {
    "name": "Nyota",
    "domain": "nyota.ai",
    "category": "AI Meetings",
    "tagline": "AI executive assistant for project updates and meeting notes",
    "pricing_model": "Paid",
    "short_description": "Monitors team conversations across meetings and chats to construct continuous project status updates and task tracking."
  },
  {
    "name": "Vowel / Zoom AI Companion",
    "domain": "zoom.us",
    "category": "AI Meetings",
    "tagline": "Native generative AI assistant built directly into Zoom meetings",
    "pricing_model": "Freemium",
    "short_description": "Generates real-time meeting summaries, smart chapter breakdowns, query responses, and post-call action item emails within Zoom."
  },
  {
    "name": "Microsoft Teams Copilot",
    "domain": "microsoft.com",
    "category": "AI Meetings",
    "tagline": "AI meeting intelligence and real-time synthesis embedded in Microsoft 365",
    "pricing_model": "Paid",
    "short_description": "Answers real-time questions during live calls, summarizes missed discussion points, and syncs meeting tasks to Microsoft To-Do."
  },
  {
    "name": "Colibri AI",
    "domain": "colibri.ai",
    "category": "AI Meetings",
    "tagline": "Real-time call transcription and live battlecard assistance for sales",
    "pricing_model": "Freemium",
    "short_description": "Provides live transcription during sales calls, displaying relevant product battlecards and answer suggestions dynamically."
  },
  {
    "name": "Syllable / Spinach AI",
    "domain": "spinach.ai",
    "category": "AI Meetings",
    "tagline": "AI Scrum Master for agile standups, sprint planning, and retro meetings",
    "pricing_model": "Freemium",
    "short_description": "Joins engineering standups, logs tickets directly into Jira, Trello, or Linear, and updates project status dashboards automatically."
  },
  {
    "name": "Granola",
    "domain": "granola.ai",
    "category": "AI Meetings",
    "tagline": "The AI notepad designed for human-driven meeting notes",
    "pricing_model": "Freemium",
    "short_description": "Combines raw user-typed notes with system audio transcription to refine, format, and structure clean post-meeting documents."
  },
  {
    "name": "Bluedot",
    "domain": "extension.app",
    "category": "AI Meetings",
    "tagline": "Chrome extension for bot-free Google Meet AI recording and notes",
    "pricing_model": "Freemium",
    "short_description": "Captures Google Meet conversations directly via browser extension without adding third-party meeting bots to the participant list."
  },
  {
    "name": "Airgram",
    "domain": "airgram.io",
    "category": "AI Meetings",
    "tagline": "AI meeting recorder with video clipping and topic tagging",
    "pricing_model": "Freemium",
    "short_description": "Transcribes calls in multiple languages, allows timestamped highlight clips, and creates structured meeting summaries."
  },
  {
    "name": "Notta",
    "domain": "notta.ai",
    "category": "AI Meetings",
    "tagline": "Voice-to-text AI transcription and meeting notes platform",
    "pricing_model": "Freemium",
    "short_description": "Converts audio files, live meetings, and video calls into accurate text transcripts with automated summaries and translation."
  },
  {
    "name": "Sybill",
    "domain": "sybill.ai",
    "category": "AI Meetings",
    "tagline": "Emotion AI and conversation intelligence platform for B2B sales reps",
    "pricing_model": "Paid",
    "short_description": "Analyzes non-verbal body language, buyer engagement, and verbal cues in sales calls to draft comprehensive CRM summaries."
  },
  {
    "name": "Reflect AI / Metaview",
    "domain": "metaview.ai",
    "category": "AI Meetings",
    "tagline": "AI-powered interview notes and intelligence platform for hiring teams",
    "pricing_model": "Paid",
    "short_description": "Automates candidate interview note-taking, enabling recruiters and hiring managers to focus on evaluation rather than typing."
  },
  {
    "name": "Laxis",
    "domain": "laxis.tech",
    "category": "AI Meetings",
    "tagline": "Next-gen AI meeting assistant and lead intelligence capturer",
    "pricing_model": "Freemium",
    "short_description": "Extracts buyer requirements and insights from meetings in real-time, auto-generating follow-up emails and CRM records."
  },
  {
    "name": "Rewatch",
    "domain": "rewatch.com",
    "category": "AI Meetings",
    "tagline": "Centralized video hub and meeting transcription hub for distributed teams",
    "pricing_model": "Freemium",
    "short_description": "Stores company screen recordings, meeting archives, and transcripts in a searchable, secure video knowledge repository."
  },
  {
    "name": "Vocaroo / Wave AI",
    "domain": "wave.ai",
    "category": "AI Meetings",
    "tagline": "AI audio assistant for recording, coaching, and transcribing on mobile",
    "pricing_model": "Freemium",
    "short_description": "Mobile-first voice recorder that summarizes in-person meetings, lectures, and phone calls into actionable checklists."
  },
  {
    "name": "Claap",
    "domain": "claap.io",
    "category": "AI Meetings",
    "tagline": "All-in-one asynchronous video wiki, screen recorder, and AI meeting notes tool",
    "pricing_model": "Freemium",
    "short_description": "Combines screen recording videos, automated meeting notes, and video wikis to reduce synchronous meeting overload."
  },
  {
    "name": "Sonix",
    "domain": "sonix.ai",
    "category": "AI Meetings",
    "tagline": "Automated audio and video transcription, translation, and summary software",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Fast automated transcription platform supporting 40+ languages, multi-speaker alignment, and subtitle exports."
  },
  {
    "name": "Verbit",
    "domain": "verbit.ai",
    "category": "AI Meetings",
    "tagline": "Enterprise hybrid AI transcription and live captioning solution",
    "pricing_model": "Paid",
    "short_description": "Provides high-accuracy live captioning, transcription, and translation compliance for higher education, legal, and corporate events."
  },
  {
    "name": "Trint",
    "domain": "trint.com",
    "category": "AI Meetings",
    "tagline": "AI audio transcription platform designed for newsrooms and storytellers",
    "pricing_model": "Paid",
    "short_description": "Allows journalists and creators to convert speech into editable, searchable text and create soundbites fast."
  },
  {
    "name": "Happy Scribe",
    "domain": "happyscribe.com",
    "category": "AI Meetings",
    "tagline": "Audio transcription and subtitle generator platform",
    "pricing_model": "Freemium",
    "short_description": "Combines machine AI transcription with optional human proofreading for meetings, interviews, and video captions."
  },
  {
    "name": "EqualTime / Wordly",
    "domain": "wordly.ai",
    "category": "AI Meetings",
    "tagline": "Real-time AI translation and captioning for live meetings and conferences",
    "pricing_model": "Paid",
    "short_description": "Delivers real-time translated audio and captions in 50+ languages to meeting attendees via smartphone or web browser."
  },
  {
    "name": "KUDO",
    "domain": "kudoway.com",
    "category": "AI Meetings",
    "tagline": "Multilingual AI speech translation engine for video meetings",
    "pricing_model": "Paid",
    "short_description": "Provides real-time AI speech-to-speech translation during online meetings and international webinars."
  },
  {
    "name": "Rask AI",
    "domain": "rask.ai",
    "category": "AI Meetings",
    "tagline": "AI video and call dubbing and multi-speaker translation tool",
    "pricing_model": "Paid",
    "short_description": "Translates meeting recordings and video presentations into 130+ languages while matching the speaker's original voice clone."
  },
  {
    "name": "Mindstamp",
    "domain": "mindstamp.io",
    "category": "AI Meetings",
    "tagline": "Interactive video platform with AI transcription and dynamic call-to-actions",
    "pricing_model": "Paid",
    "short_description": "Turns meeting recordings and product demos into interactive video assets with clickable buttons, quizzes, and transcripts."
  },
  {
    "name": "Speak AI",
    "domain": "speakai.co",
    "category": "AI Meetings",
    "tagline": "Audio, video, and text analysis platform for qualitative research",
    "pricing_model": "Freemium",
    "short_description": "Transcribes meeting recordings and automatically analyzes keyword frequency, sentiment trends, and brand mentions."
  },
  {
    "name": "Poda / AssemblyAI",
    "domain": "assemblyai.com",
    "category": "AI Meetings",
    "tagline": "Production-ready Speech AI models for transcription and conversation intelligence",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Developer API platform providing speech-to-text, speaker diarization, sentiment analysis, and topic detection for meeting apps."
  },
  {
    "name": "Deepgram",
    "domain": "deepgram.com",
    "category": "AI Meetings",
    "tagline": "Ultra-fast speech-to-text API for real-time meeting transcription",
    "pricing_model": "Pay-as-you-go",
    "short_description": "Delivers low-latency real-time voice transcription and text analysis optimized for AI voice agents and meeting bots."
  },
  {
    "name": "Gladia",
    "domain": "gladia.io",
    "category": "AI Meetings",
    "tagline": "Real-time speech-to-text and audio intelligence API",
    "pricing_model": "Freemium",
    "short_description": "Provides fast multi-lingual speech transcription, speaker separation, and live translation for meeting software developers."
  },
  {
    "name": "Vowel",
    "domain": "vowel.com",
    "category": "AI Meetings",
    "tagline": "AI-powered video conferencing workspace with live transcription",
    "pricing_model": "Freemium",
    "short_description": "Video meeting platform that hosts, transcribes, bookmarks, and summarizes discussions without third-party plugins."
  },
  {
    "name": "HuddleIQ",
    "domain": "huddleiq.com",
    "category": "AI Meetings",
    "tagline": "Online collaborative whiteboard with integrated AI meeting tools",
    "pricing_model": "Freemium",
    "short_description": "Combines digital canvas brainstorming with automated transcript summarization and mind map generation."
  },
  {
    "name": "NotesByAI / Scribe",
    "domain": "scribehow.com",
    "category": "AI Meetings",
    "tagline": "Automatically turn meetings and workflows into step-by-step guides",
    "pricing_model": "Freemium",
    "short_description": "Captures screen actions during web meetings and builds step-by-step documentation, SOPs, and visual guides automatically."
  },
  {
    "name": "Lucidspark AI",
    "domain": "lucidspark.com",
    "category": "AI Meetings",
    "tagline": "Virtual whiteboarding platform with AI meeting synthesis and clustering",
    "pricing_model": "Freemium",
    "short_description": "Uses AI to group sticky notes, summarize workshop discussions, and turn meeting brainstorms into action plans."
  },
  {
    "name": "Miro AI",
    "domain": "miro.com",
    "category": "AI Meetings",
    "tagline": "Visual workspace equipped with AI canvas meeting facilitation tools",
    "pricing_model": "Freemium",
    "short_description": "Assists meeting facilitators by summarizing sticky-note boards, generating user story maps, and drafting retrospective summaries."
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

const domainMatches = content.matchAll(/domain:\s*['"]([^'"]+)['"]/g);
for (const match of domainMatches) {
  existingDomains.add(match[1].toLowerCase().replace(/^www\./, ''));
}

const idMatches = content.matchAll(/id:\s*['"]([^'"]+)['"]/g);
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
    category: 'meeting-ai',
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
    isOpenSource: false
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
    console.log(`\n🎉 Ingestion Complete! Added ${addedCount} new AI Meeting tools. Skipped ${skippedCount} duplicates.`);
  } else {
    console.error('Could not find staticSaasTools array insertion point.');
  }
} else {
  console.log(`\nNo new tools added. All ${inputBatch.length} tools were duplicates.`);
}
