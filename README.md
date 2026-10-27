# GharSetu – AI Rural Housing Navigator
### अपनी ज़मीन से अपने घर तक (From Your Land to Your Own Home)

**GharSetu** is a production-minded React web application built for rural Indian families who own a plot of land or homestead patta but struggle to navigate government housing schemes (e.g., PMAY-G, state rural housing initiatives, RHISS), document requirements, and approval processes.

> **Civic Hackathon Disclaimer:** GharSetu is an independent assistance and preparation platform, not an official government portal. It helps families evaluate potential eligibility, resolve document mismatches (like Khatauni spelling discrepancies), and prepare for Gram Sabha review. It never fabricates official sanctions or claims legal verification without competent departmental confirmation.

---

## 🎨 Color Palette

GharSetu utilizes a purpose-crafted, accessible rural identity palette:
* `#8EA66B` (Muted Sage/Olive Green): Primary actions, brand badge, progress indicators, active navigation.
* `#FFF9D6` (Warm Butter Cream): Card backgrounds, hero gradients, financial assistance callouts.
* `#D8A2A2` (Dusty Rose): Subtle card borders, secondary tags, and interactive hover rings.
* `#FFDCDC` (Soft Pastel Blush): Notice banners, priority alert containers, and demo profile tags.

---

## 🌟 Key Features

1. **Bilingual User Experience (हिन्दी & English):**
   - Seamless one-click toggling between Hindi and English across all forms, checklists, scheme details, and assistant responses.
2. **Housing Eligibility Rule Engine:**
   - Evaluates applicant profiles against official PMAY-G and state criteria.
   - Evaluates the 13 statutory economic exclusions (motorized 3/4-wheeler, government employment, KCC credit limits > ₹50k, etc.).
   - Prioritizes female-headed households (mandatory women co-ownership under PMAY-G), differently-abled family members, and kutcha dwelling deprivation.
3. **Production-Grade Authentication (Dual Engine):**
   - **Salted SHA-256 Web Crypto Engine:** Native in-browser cryptography with 16-byte random salts; plain-text passwords are never stored.
   - **Mobile OTP Login:** Rural-citizen friendly login via 10-digit mobile number and cryptographically generated 6-digit OTP codes.
   - **Rate Limiting & Lockout Protection:** Automatically locks out accounts for 60 seconds after 5 failed login attempts to prevent brute force attacks.
   - **Password Strength Estimator:** Real-time visual feedback on password complexity.
   - **Forgot Password & Reset Flow:** OTP-verified password recovery with simulated SMS gateway alerts.
   - **Supabase Auth Bridge:** Automatically links to remote Supabase Auth when credentials are provided in `.env`.
4. **Smart Document Center & Land Record Checker:**
   - Drag-and-drop file uploader with size and format validation (PDF, JPG, PNG).
   - In-browser simulated document inspection highlighting common rural roadblocks:
     - Spelling/spacing variances between Khatauni (Land Deed) and Aadhaar Card.
     - Aadhaar NPCI DBT mapper activation for bank passbooks.
     - MGNREGA Job Card linkage for 90-95 days unskilled labor wage entitlement.
   - Dynamic document readiness percentage gauge (0% - 100%).
   - Client-side privacy guarantee: no sensitive identity documents stored on public servers.
4. **Official Scheme Directory & Side-by-Side Comparison:**
   - Grounded database covering **PMAY-G**, **Mukhya Mantri Awas Yojana**, **Rural Housing Interest Subsidy Scheme (RHISS)**, **Biju Pucca Ghar Yojana**, and **Women Ownership Priority**.
   - Side-by-side comparison matrix comparing up to 3 schemes at a time.
   - Direct links to official portals (`pmayg.nic.in`, `rural.gov.in`).
5. **Interactive 6-Stage Application Tracker:**
   - Tracks the actual rural housing lifecycle: Household Assessment → Document Mismatch Resolution → Gram Sabha Resolution → AwaasApp Geotagging → BDO Sanction Order → PFMS DBT Installments.
   - Real advice on tracking FTO (Fund Transfer Orders) on `pmayg.nic.in` and anti-middlemen fraud warnings.
6. **Bilingual AI Housing Sahayak:**
   - Grounded conversational assistant that explains rural land revenue terms (Khatauni, Varasandi, Patta, Abadi), installment timelines, and appeals.
   - Dual-mode architecture: connects to live Gemini API when `VITE_GEMINI_API_KEY` is present, with an extensive grounded offline knowledge engine fallback when offline or without credentials.
7. **One-Click Realistic Demo Profile:**
   - Instant "Load Demo Profile" button pre-populating Ramkishan Yadav's household (Sitapur, UP) with pre-uploaded document statuses to allow hackathon judges to immediately test all features without manual entry.

---

## 📁 Project Structure

```
gava/
├── public/
├── src/
│   ├── __tests__/
│   │   ├── eligibility.test.js       # Vitest tests for PMAY-G exclusion & eligibility rules
│   │   └── documentService.test.js   # Vitest tests for readiness score & file validations
│   ├── components/
│   │   ├── ChatAssistant.jsx         # Bilingual conversational AI assistant
│   │   ├── DocumentChecklist.jsx     # Visual readiness gauge & status filters
│   │   ├── DocumentUploader.jsx      # Drag-and-drop file uploader with preview & analysis
│   │   ├── EmptyState.jsx            # Accessible empty state component
│   │   ├── ErrorState.jsx            # Error card with retry action
│   │   ├── Footer.jsx                # Disclaimers, official portal links, hackathon notes
│   │   ├── LanguageToggle.jsx        # Accessible Hindi / English toggle button
│   │   ├── LoadingState.jsx          # Friendly spinner / skeleton state
│   │   ├── Navbar.jsx                # Responsive header with demo loader & mobile menu
│   │   ├── ProgressTracker.jsx       # 6-step lifecycle milestone tracker
│   │   ├── SchemeCard.jsx            # Reusable scheme card with compare selector
│   │   └── StatCard.jsx              # Dashboard KPI metric card
│   ├── context/
│   │   ├── AppContext.jsx            # State management for profile, assessment, docs, milestones
│   │   └── LanguageContext.jsx       # Bilingual dictionary & translation context
│   ├── data/
│   │   ├── demoData.js               # Realistic sample household, pre-loaded docs & milestones
│   │   ├── schemesData.js            # Grounded official central & state housing schemes
│   │   └── translations.js           # Comprehensive English & Hindi dictionaries
│   ├── pages/
│   │   ├── AIHelp.jsx                # Dedicated 24/7 AI Housing Consultant page
│   │   ├── ApplicationTracker.jsx    # Step-by-step progress & FTO tracking guide
│   │   ├── Dashboard.jsx             # Comprehensive overview & quick action hub
│   │   ├── DocumentCenter.jsx        # Smart document management & checklist scanner
│   │   ├── EligibilityChecker.jsx    # 5-step interactive questionnaire & result report
│   │   ├── LandingPage.jsx           # Hero, 4-step workflow, features & FAQs
│   │   ├── Profile.jsx               # Household profile & printable readiness report
│   │   └── SchemeExplorer.jsx        # Searchable catalog & comparison matrix
│   ├── services/
│   │   ├── aiService.js              # Gemini API integration + Grounded knowledge engine
│   │   ├── documentService.js        # File validation, simulated OCR checks & readiness scoring
│   │   ├── schemeService.js          # Eligibility assessment algorithm & scheme filtering
│   │   └── storageService.js         # Safe localStorage persistence without raw file leaks
│   ├── App.jsx                       # Routing & layout setup
│   ├── index.css                     # Tailwind v4 design system with earthy tones
│   └── main.jsx                      # React 19 entry point
├── supabase_schema.sql               # PostgreSQL schema with Row Level Security (RLS)
├── .env.example                      # Configuration template
├── package.json
└── vite.config.js
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```
Runs the Vitest test suite covering eligibility rule accuracy and document validation.

### 4. Build for Production
```bash
npm run build
```

---

## ⚙️ Environment Variables (`.env`)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Required? |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini 1.5 Flash API Key | Optional (Fallback to offline engine if absent) |
| `VITE_SUPABASE_URL` | Supabase Project URL | Optional (Uses local safe persistence if absent) |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anon Public Key | Optional |

---

## 🗄️ Supabase PostgreSQL Schema & Security

If deploying with Supabase, run the SQL script located in `supabase_schema.sql` in your Supabase SQL Editor. It configures:
- `profiles`: Household demographic and rural land information with user-bound RLS.
- `eligibility_assessments`: Record of calculated eligibility score and matched schemes.
- `documents_meta`: Metadata of uploaded proofs (never saving raw unencrypted files to public buckets).
- `application_progress`: User-updated preparation milestones.
- Row Level Security (RLS) policies ensuring users can only read and write their own records.

---

## 🧪 Tests Performed

- **PMAY-G Eligibility Rules**: Verified qualification of kutcha house families, disqualification of pucca house owners, and triggering of statutory 13 exclusion criteria (vehicles, government jobs).
- **Document Readiness Calculation**: Verified 0% score on empty state, 100% on complete verification, weighted calculation on "review needed" files, and strict 5MB size enforcement.
- **Bilingual Interface**: Verified English and Hindi rendering across all 8 views.
- **Production Build**: Verified zero-error compilation with Vite and Tailwind v4.
