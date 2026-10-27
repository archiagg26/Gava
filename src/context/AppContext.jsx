import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { storageService } from '../services/storageService';
import { schemeService } from '../services/schemeService';
import { documentService } from '../services/documentService';
import {
  defaultMilestones,
  demoHouseholdProfile,
  demoEligibilityAssessment,
  demoUploadedDocs
} from '../data/demoData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => storageService.getUserProfile());
  const [eligibilityAssessment, setEligibilityAssessment] = useState(() => storageService.getEligibilityAssessment());
  const [documents, setDocuments] = useState(() => storageService.getDocumentsMetadata());
  const [milestones, setMilestones] = useState(() => storageService.getMilestones() || defaultMilestones);
  const [recentActivity, setRecentActivity] = useState(() => storageService.getRecentActivity());

  // Reload activity whenever things change
  const refreshActivity = () => {
    setRecentActivity(storageService.getRecentActivity());
  };

  // 1. Load Demo Data
  const loadDemoData = () => {
    storageService.saveUserProfile(demoHouseholdProfile);
    storageService.saveEligibilityAssessment(demoEligibilityAssessment);
    storageService.saveDocumentsMetadata(demoUploadedDocs);
    storageService.saveMilestones(defaultMilestones);

    setUserProfile(demoHouseholdProfile);
    setEligibilityAssessment(demoEligibilityAssessment);
    setDocuments(demoUploadedDocs);
    setMilestones(defaultMilestones);

    storageService.addActivity({
      title: 'Loaded Demo Family Profile (Ramkishan Yadav)',
      titleHi: 'डेमो परिवार प्रोफ़ाइल लोड की गई (रामकिशन यादव)',
      type: 'system'
    });
    refreshActivity();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }
  };

  // 2. Reset to clean empty state
  const resetData = () => {
    storageService.clearAll();
    setUserProfile(null);
    setEligibilityAssessment(null);
    setDocuments({});
    setMilestones(defaultMilestones.map(m => ({ ...m, status: 'pending', completedAt: null })));
    setRecentActivity([]);
  };

  // 3. Update User Profile
  const updateProfile = (profileData) => {
    const updated = { ...(userProfile || {}), ...profileData, isDemo: false };
    storageService.saveUserProfile(updated);
    setUserProfile(updated);
    refreshActivity();
  };

  // 4. Submit Eligibility Form and calculate results
  const submitEligibility = (formData) => {
    const profile = { ...(userProfile || {}), ...formData, isDemo: false };
    storageService.saveUserProfile(profile);
    setUserProfile(profile);

    const assessmentResult = schemeService.evaluateEligibility(profile);
    storageService.saveEligibilityAssessment(assessmentResult);
    setEligibilityAssessment(assessmentResult);

    // Update milestone 1
    const updatedMilestones = milestones.map(m => {
      if (m.id === 1) {
        return { ...m, status: 'completed', completedAt: new Date().toISOString() };
      }
      return m;
    });
    storageService.saveMilestones(updatedMilestones);
    setMilestones(updatedMilestones);

    refreshActivity();

    // Trigger celebratory confetti if eligible
    if (assessmentResult.status === 'eligible') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }

    return assessmentResult;
  };

  // 5. Upload & Analyze Document
  const uploadDocument = async (docId, file) => {
    const analysis = await documentService.analyzeDocument(file, docId, userProfile || {});
    const updatedDocs = {
      ...documents,
      [docId]: analysis
    };
    storageService.saveDocumentsMetadata(updatedDocs);
    setDocuments(updatedDocs);

    storageService.addActivity({
      title: `Document Uploaded: ${analysis.fileName}`,
      titleHi: `दस्तावेज़ अपलोड किया गया: ${analysis.fileName}`,
      type: 'document'
    });
    refreshActivity();

    // If readiness reaches >= 75%, mark milestone 2 completed
    const newReadiness = documentService.calculateReadiness(updatedDocs);
    if (newReadiness >= 75) {
      const updatedMilestones = milestones.map(m => {
        if (m.id === 2 && m.status !== 'completed') {
          return { ...m, status: 'completed', completedAt: new Date().toISOString() };
        }
        return m;
      });
      storageService.saveMilestones(updatedMilestones);
      setMilestones(updatedMilestones);
    }

    return analysis;
  };

  // 6. Remove Document
  const removeDocument = (docId) => {
    const updatedDocs = { ...documents };
    delete updatedDocs[docId];
    storageService.saveDocumentsMetadata(updatedDocs);
    setDocuments(updatedDocs);

    storageService.addActivity({
      title: `Document Removed: ${docId}`,
      titleHi: `दस्तावेज़ हटाया गया: ${docId}`,
      type: 'document'
    });
    refreshActivity();
  };

  // 7. Toggle Milestone
  const toggleMilestone = (milestoneId) => {
    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        const isCurrentlyCompleted = m.status === 'completed';
        return {
          ...m,
          status: isCurrentlyCompleted ? 'pending' : 'completed',
          completedAt: isCurrentlyCompleted ? null : new Date().toISOString()
        };
      }
      return m;
    });
    storageService.saveMilestones(updated);
    setMilestones(updated);

    const changedItem = updated.find(m => m.id === milestoneId);
    storageService.addActivity({
      title: `Milestone updated: Step ${milestoneId} is now ${changedItem.status}`,
      titleHi: `चरण ${milestoneId} स्थिति अपडेट: ${changedItem.status === 'completed' ? 'पूर्ण' : 'लंबित'}`,
      type: 'tracker'
    });
    refreshActivity();
  };

  // Computed values
  const documentReadiness = documentService.calculateReadiness(documents);
  const missingDocs = documentService.getMissingDocs(documents);
  const isDemoActive = Boolean(userProfile?.isDemo);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        eligibilityAssessment,
        documents,
        milestones,
        recentActivity,
        documentReadiness,
        missingDocs,
        isDemoActive,
        loadDemoData,
        resetData,
        updateProfile,
        submitEligibility,
        uploadDocument,
        removeDocument,
        toggleMilestone
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
