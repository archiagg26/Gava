import { describe, it, expect } from 'vitest';
import { documentService } from '../services/documentService';

describe('GharSetu Document Readiness Service', () => {
  it('returns 0% readiness when no documents are uploaded', () => {
    const score = documentService.calculateReadiness({});
    expect(score).toBe(0);
  });

  it('calculates 100% readiness when all 7 documents are marked ready', () => {
    const allReady = {
      aadhaar: { status: 'ready' },
      land_record: { status: 'ready' },
      bank_passbook: { status: 'ready' },
      mgnrega_jobcard: { status: 'ready' },
      ration_card: { status: 'ready' },
      kutcha_photo: { status: 'ready' },
      gram_noc: { status: 'ready' }
    };
    const score = documentService.calculateReadiness(allReady);
    expect(score).toBe(100);
  });

  it('correctly calculates partial readiness when a document needs review', () => {
    const partial = {
      aadhaar: { status: 'ready' },
      land_record: { status: 'review' } // weighted less
    };
    const score = documentService.calculateReadiness(partial);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(50);
  });

  it('correctly lists missing documents', () => {
    const uploaded = {
      aadhaar: { status: 'ready' }
    };
    const missing = documentService.getMissingDocs(uploaded);
    expect(missing.length).toBe(6);
    expect(missing.find(d => d.id === 'aadhaar')).toBeUndefined();
    expect(missing.find(d => d.id === 'land_record')).toBeDefined();
  });

  it('validates file size limit strictly', () => {
    const oversizedFile = { size: 10 * 1024 * 1024, type: 'application/pdf' }; // 10MB
    const validation = documentService.validateFile(oversizedFile, 'aadhaar');
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('limit');
  });

  it('rejects unsupported file extensions', () => {
    const exeFile = { size: 500 * 1024, type: 'application/x-msdownload' };
    const validation = documentService.validateFile(exeFile, 'aadhaar');
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain('Unsupported');
  });
});
