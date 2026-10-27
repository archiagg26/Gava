import { describe, it, expect } from 'vitest';
import { schemeService } from '../services/schemeService';

describe('GharSetu Eligibility Rules Engine', () => {
  it('correctly qualifies an eligible rural kutcha house family for PMAY-G', () => {
    const profile = {
      isRural: true,
      currentHouseType: 'kutcha',
      landOwnership: 'ancestral',
      hasGovtEmployee: false,
      hasMotorVehicle: false,
      hasKccLimit: false,
      hasNonAgriEnterprise: false,
      isWomanHead: true,
      isDifferentlyAbled: false
    };

    const result = schemeService.evaluateEligibility(profile);
    expect(result.status).toBe('eligible');
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.matchedSchemes).toContain('pmay-g');
    expect(result.matchedSchemes).toContain('pmay-g-women-title');
  });

  it('correctly disqualifies a household owning an existing pucca house', () => {
    const profile = {
      isRural: true,
      currentHouseType: 'pucca', // Has pucca house
      landOwnership: 'self',
      hasGovtEmployee: false,
      hasMotorVehicle: false,
      hasKccLimit: false,
      hasNonAgriEnterprise: false
    };

    const result = schemeService.evaluateEligibility(profile);
    expect(result.status).not.toBe('eligible');
    expect(result.matchedSchemes).not.toContain('pmay-g');
    const puccaReason = result.reasons.find(r => r.factor.includes('Pucca House'));
    expect(puccaReason).toBeDefined();
    expect(puccaReason.status).toBe('negative');
  });

  it('triggers PMAY-G exclusion when household has a government employee', () => {
    const profile = {
      isRural: true,
      currentHouseType: 'kutcha',
      landOwnership: 'ancestral',
      hasGovtEmployee: true, // Exclusion
      hasMotorVehicle: false,
      hasKccLimit: false,
      hasNonAgriEnterprise: false
    };

    const result = schemeService.evaluateEligibility(profile);
    expect(result.status).not.toBe('eligible');
    const exclusionReason = result.reasons.find(r => r.factor.includes('Exclusion'));
    expect(exclusionReason).toBeDefined();
    expect(exclusionReason.status).toBe('negative');
  });

  it('handles urban location appropriately', () => {
    const profile = {
      isRural: false, // Not in rural Gram Panchayat
      currentHouseType: 'kutcha',
      landOwnership: 'self',
      hasGovtEmployee: false,
      hasMotorVehicle: false
    };

    const result = schemeService.evaluateEligibility(profile);
    expect(result.matchedSchemes).not.toContain('pmay-g');
  });
});
