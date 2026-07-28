import React from 'react';

/**
 * Injects Google JSON-LD Schema.org markups into page head for Rich Snippets
 * Strictly matches visible page content with zero fabricated defaults.
 */

export function injectGlobalOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'StakDock',
    'url': 'https://stakdock.com',
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
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web, Cloud',
    'description': tool.description || ''
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

  // Only include aggregateRating if real rating and reviewsCount exist on tool object
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
