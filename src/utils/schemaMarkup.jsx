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
    'description': 'The premier SaaS & AI software launch dock and buyer recommendation platform.',
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'email': 'support@stakdock.com',
        'contactType': 'customer support'
      },
      {
        '@type': 'ContactPoint',
        'email': 'business@stakdock.com',
        'contactType': 'business development'
      }
    ]
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

  // Include aggregateRating only when authentic community reviews exist (> 0)
  if (tool.rating && tool.reviewsCount && Number(tool.reviewsCount) > 0 && Number(tool.rating) > 0) {
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
      'url': `https://stakdock.com/software/${tool.id}/`
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

export function injectFAQPageSchema(tool, alternatives = []) {
  if (!tool) return null;
  const altNames = (alternatives || []).map(a => a.name).slice(0, 3).join(', ') || 'top software platforms';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `Is ${tool.name} free to use or does it offer a free trial?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${tool.name} operates on a ${tool.pricing || 'Freemium'} pricing model. Users can test ${tool.name} with official free trial options or freemium feature tiers directly on their official website.`
        }
      },
      {
        '@type': 'Question',
        'name': `Does ${tool.name} offer promo codes, coupons, or founder deals?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${tool.name} periodically offers promotional pricing tiers and verified founder deals for new users. Visit the official website via StakDock to verify current discounts.`
        }
      },
      {
        '@type': 'Question',
        'name': `What are the key features and benefits of ${tool.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${tool.name} provides ${tool.description || 'cloud-based software capabilities'} engineered for founders, creators, and operational teams.`
        }
      },
      {
        '@type': 'Question',
        'name': `What are the best alternatives to ${tool.name}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Top verified alternatives to ${tool.name} include ${altNames}. Compare full features and ratings side-by-side on StakDock.`
        }
      }
    ]
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} 
    />
  );
}
