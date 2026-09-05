async function main() {
  const mod = await import('../src/data/stackIntelligenceSeedData.js');
  console.log(`Total seed tools: ${mod.seedSoftwareTools.length}`);
  mod.seedSoftwareTools.forEach((t, i) => {
    console.log(`${i + 1}. [${t.toolId}] ${t.name} (cat: ${t.category}, model: ${t.commercialModel?.pricingModel}, lic: ${t.licensing?.licenseType}, claimProv: ${t.claimProvenance?.length || 0})`);
  });
}
main().catch(console.error);
