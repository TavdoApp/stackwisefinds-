/**
 * Utility helpers to cleanly format and calculate Lifetime Deal (LTD) pricing and discount telemetry.
 */

export function formatDealPrice(val) {
  if (!val) return '';
  const trimmed = String(val).trim();
  if (!trimmed) return '';
  
  // If it's pure numbers like "79" or "79.99"
  if (/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return `$${trimmed}`;
  }
  
  // If it starts with numbers like "79/mo" or "79 lifetime"
  if (/^\d+/.test(trimmed)) {
    return `$${trimmed}`;
  }
  
  return trimmed;
}

export function parseNumericPrice(str) {
  if (!str) return 0;
  const match = String(str).replace(/,/g, '').match(/\d+(\.\d{1,2})?/);
  return match ? parseFloat(match[0]) : 0;
}

export function getDealBreakdown(dealPriceRaw, dealDiscountRaw) {
  const dealPrice = formatDealPrice(dealPriceRaw);
  const dealNum = parseNumericPrice(dealPriceRaw);

  if (!dealDiscountRaw && !dealPriceRaw) {
    return {
      dealPrice: '$19',
      originalPrice: null,
      savingsAmount: null,
      discountPercent: null,
      discountBadge: null,
      regPriceLabel: null
    };
  }

  const rawDiscount = String(dealDiscountRaw || '').trim();
  let originalPrice = null;
  let savingsAmount = null;
  let discountPercent = null;

  // 1. If discount input is just a number like "144" or "$144"
  if (/^\$?\d+(\.\d{1,2})?$/.test(rawDiscount)) {
    const origNum = parseNumericPrice(rawDiscount);
    if (origNum > 0) {
      originalPrice = `$${origNum}`;
      if (dealNum > 0 && origNum > dealNum) {
        const saved = origNum - dealNum;
        savingsAmount = `$${Number.isInteger(saved) ? saved : saved.toFixed(2)}`;
        const pct = Math.round(((origNum - dealNum) / origNum) * 100);
        discountPercent = `${pct}% OFF`;
      }
    }
  } else if (rawDiscount.includes('%')) {
    // If user entered "89% OFF" or "$179 (89% OFF)" or "$144 (45% OFF)"
    const pctMatch = rawDiscount.match(/\d+%/);
    discountPercent = pctMatch ? `${pctMatch[0]} OFF` : (rawDiscount.includes('OFF') ? rawDiscount : `${rawDiscount} OFF`);
    
    const origMatch = rawDiscount.match(/\$?(\d+(\.\d{1,2})?)/);
    if (origMatch) {
      const origNum = parseNumericPrice(origMatch[0]);
      if (origNum > dealNum) {
        originalPrice = `$${origNum}`;
        const saved = origNum - dealNum;
        savingsAmount = `$${Number.isInteger(saved) ? saved : saved.toFixed(2)}`;
      }
    }
  } else if (rawDiscount) {
    discountPercent = rawDiscount;
  }

  let discountBadge = discountPercent;
  let regPriceLabel = originalPrice ? `Reg. ${originalPrice}${discountPercent ? ` • ${discountPercent}` : ''}` : discountPercent;

  return {
    dealPrice: dealPrice || '$19',
    originalPrice,
    savingsAmount,
    discountPercent,
    discountBadge,
    regPriceLabel
  };
}
