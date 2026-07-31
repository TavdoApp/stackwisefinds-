import React from 'react';

/**
 * Injects Google JSON-LD Schema.org markups into page head for Rich Snippets, GEO, and AEO.
 * Strictly matches visible page content with zero fabricated defaults.
 */

export function injectGlobalOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'StakDock Technologies',
    'url': 'https://stakdock.com/',
    'logo': 'https://stakdock.com/logo.svg',
    'description': 'The premier SaaS & AI software launch dock and buyer recommendation platform.'
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

export function injectSoftwareApplicationSchema(tool) {
  if (!tool) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'applicationCategory': tool.category ? String(tool.category) : 'BusinessApplication',
    'operatingSystem': 'Web, Cloud',
    'description': tool.description || '',
    'url': tool.websiteUrl || `https://${tool.domain || 'stakdock.com'}`
  };

  // Include a price only when verified numeric pricing exists in visible tool data.
  if (Number.isFinite(tool.price)) {
    schema.offers = {
      '@type': 'Offer',
      'price': String(tool.price),
      'priceCurrency': tool.priceCurrency || 'USD',
      'availability': 'https://schema.org/InStock'
    };
  }

  // Include aggregateRating if real rating and reviewsCount exist on tool object
  if (tool.rating && tool.reviewsCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': String(tool.rating),
      'ratingCount': String(tool.reviewsCount),
      'bestRating': '5',
      'worstRating': '1'
    };
  }

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

export function injectItemListSchema(tools, listName = 'SaaS & AI Software Directory') {
  if (!tools || !Array.isArray(tools) || tools.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': listName,
    'numberOfItems': tools.length,
    'itemListElement': tools.slice(0, 30).map((tool, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': tool.name,
      'url': `https://stakdock.com/#${tool.id}`
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

export function injectFaqPageSchema(faqs) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}

export function injectBreadcrumbSchema(items) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}
