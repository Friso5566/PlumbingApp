# Plumbing LLM Assistant - Project TODO

## Features

- [x] Mobile-friendly responsive UI design
- [x] Text query input interface
- [x] Image upload functionality with preview
- [x] LLM integration for text-based questions
- [x] Vision LLM integration for image analysis
- [x] Bullet-point answer formatting
- [x] Professional plumber-level guidance
- [x] Chat history persistence
- [x] Query/response database storage
- [x] Error handling and user feedback
- [x] Loading states during LLM processing
- [x] Markdown rendering for responses

## Technical Implementation

- [x] Database schema for queries and responses
- [x] tRPC procedures for LLM endpoints
- [x] Frontend chat interface component
- [x] Image upload and storage integration
- [x] LLM prompt engineering for plumbing expertise
- [x] Response formatting to bullet points
- [x] Mobile responsive styling with Tailwind
- [x] Authentication and user tracking
- [ ] Testing and QA

## Deployment

- [ ] Final testing on mobile devices
- [ ] Performance optimization
- [ ] Create checkpoint for deployment
- [ ] Publish to production


## Lightweight Profile Feature (In Progress)

- [ ] Create simple profile page component
- [ ] Display recent queries (last 20)
- [ ] Show query and response pairs
- [ ] Add back button to main chat
- [ ] Integrate profile navigation button
- [ ] Test profile page functionality


## Metric Units Update

- [x] Update LLM system prompt to use meters and centimeters only
- [x] Remove all imperial units from responses
- [ ] Test with sample plumbing questions
- [ ] Verify metric conversions are accurate


## Regional Guidance Feature

- [x] Update database schema to add region preference to users table
- [x] Create region selection UI component
- [x] Add region dropdown to chat interface header
- [x] Update LLM prompts to include regional context
- [x] Test regional guidance with different regions
- [ ] Save checkpoint with regional feature


## Add South Africa Region

- [x] Add SA to region enum in schema
- [x] Update region prompts with South Africa context
- [x] Test region selector with South Africa
- [ ] Save checkpoint with South Africa region


## Add Nigeria and Kenya Regions

- [x] Add NG and KE to region enum in schema
- [x] Update region prompts with Nigeria and Kenya context
- [x] Test region selector with new regions
- [ ] Save checkpoint with expanded African coverage


## Job Report PDF Generation Feature

- [x] Install jsPDF and jsPDF-AutoTable libraries
- [x] Create report type selection modal component
- [x] Create data collection form for company and client details
- [x] Build Inspection Report PDF generation logic
- [x] Build Job Quote Report PDF generation logic
- [x] Add "Generate Job Report" button to chat interface
- [ ] Implement report preview feature
- [ ] Add copy-to-clipboard functionality for plain text
- [x] Test PDF generation and styling
- [ ] Deploy and verify on production


## Email Export Feature

- [x] Install Nodemailer and email dependencies
- [x] Create backend email sending service
- [x] Add tRPC procedure for sending emails with PDF attachment
- [x] Create email modal UI component
- [x] Integrate email button into report modal
- [ ] Configure email credentials/environment variables
- [ ] Test email delivery
- [ ] Add success/error notifications


## Parts & Cost Estimator Feature

- [x] Create South African cost database with 25+ plumbing issues
- [x] Build keyword matching logic to detect issues from AI responses
- [x] Create Cost Estimate Card component with South African Rands pricing
- [x] Add regional pricing toggle (Metro vs Rural)
- [x] Implement parts breakdown list display
- [x] Add complexity badge and DIY recommendation
- [x] Add supplier links (Builders Warehouse, Plumblink, Leroy Merlin, Alert Steel)
- [x] Integrate card display into chat after AI responses
- [ ] Make card collapsible with summary/expanded views
- [ ] Add "Add to Quote" button integration
- [ ] Add "Email this estimate" functionality
- [ ] Test cost estimator with various plumbing scenarios
- [ ] Verify mobile responsiveness
- [ ] Deploy and test on production


## UX Improvements & Advanced Filtering

- [x] Implement collapsible cost estimate cards
- [x] Add smooth animations and transitions
- [x] Create advanced filtering by complexity level
- [x] Add filter by DIY-friendly vs professional-only
- [x] Implement price range filtering
- [x] Add search functionality for specific parts
- [x] Create sort options (price, complexity, popularity)
- [x] Add favorites/bookmark system for estimates
- [x] Implement comparison view for multiple estimates
- [x] Add "Similar Issues" recommendations
- [ ] Create estimate history timeline
- [ ] Add dark mode toggle
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts for power users
- [ ] Create help tooltips and onboarding


## Cost Analytics Dashboard

- [x] Create analytics data aggregation functions
- [x] Build average cost by issue type chart
- [x] Create regional comparison chart
- [x] Implement DIY vs professional breakdown chart
- [x] Add complexity distribution visualization
- [x] Build trending repairs chart
- [x] Create analytics dashboard page
- [x] Add interactive region filter
- [x] Implement date range filtering
- [x] Add export analytics to CSV/PDF
- [x] Create performance metrics cards
- [x] Add year-over-year comparison
- [x] Test dashboard responsiveness
- [x] Deploy analytics features


## South African Regional Knowledge Base Enhancement

### Phase 1: SA Standards Knowledge Base
- [x] Create SANS standards knowledge module (SANS 10254, 10400-P, 10400-W, 10142)
- [x] Document geyser installation requirements and compliance rules
- [x] Document drainage system standards and requirements
- [x] Document water supply standards and backflow prevention
- [x] Create system prompt injector for regional context
- [x] Build standards citation system for AI responses

### Phase 2: Supplier & Product Database
- [x] Create supplier database for major SA retailers (Builders Warehouse, Plumblink, etc.)
- [x] Add product availability and pricing information
- [x] Build product recommendation engine for SA market
- [x] Create brand preference list for SA plumbers
- [x] Add alternative/local product options

### Phase 3: Load-Shedding & Seasonal Context
- [x] Implement load-shedding schedule awareness
- [x] Create water restrictions context layer
- [x] Add seasonal maintenance recommendations
- [x] Build emergency repair guidance for power outages
- [x] Create weather-related plumbing advice

### Phase 4: LLM Integration
- [x] Modify system prompt injection pipeline
- [x] Add regional context to all LLM queries
- [x] Implement SANS standard citation in responses
- [x] Create regional-aware response formatting
- [x] Test prompt injection with various queries

### Phase 5: SA-Specific Templates
- [x] Create CoC (Certificate of Compliance) guidance
- [x] Build insurance claim prevention advice
- [x] Create rural vs urban pricing context
- [x] Add municipal water system considerations
- [x] Build load-shedding impact guides

### Phase 6: Testing & Validation
- [x] Test SA-specific responses for accuracy
- [x] Verify SANS standard citations
- [x] Test regional context switching
- [x] Validate supplier information accuracy
- [x] Test load-shedding integration

### Phase 7: Deployment
- [ ] Create checkpoint for SA knowledge base
- [ ] Deploy to production
- [ ] Monitor SA-specific queries
- [ ] Gather user feedback


## Kenya Regional Knowledge Base Enhancement

### Phase 1: Kenya Standards Knowledge Base
- [x] Create Kenya Building Code standards knowledge module
- [x] Document water supply and drainage standards (KS 3404, KS 3405)
- [x] Document plumbing materials and fixture standards
- [x] Create water conservation and rainwater harvesting guidelines
- [x] Build system prompt injector for Kenya regional context
- [x] Build standards citation system for Kenya plumbing

### Phase 2: Kenya Supplier & Product Database
- [x] Create supplier database for major Kenya retailers (Nakumatt, Carrefour, etc.)
- [x] Add product availability and pricing information in KES
- [x] Build product recommendation engine for Kenya market
- [x] Create brand preference list for Kenya plumbers
- [x] Add alternative/local product options
- [x] Document regional variations (Nairobi vs rural areas)

### Phase 3: Water Scarcity & Seasonal Context
- [x] Implement water scarcity awareness and conservation tips
- [x] Create seasonal maintenance recommendations (dry/rainy seasons)
- [x] Build water rationing context layer
- [x] Create emergency water shortage repair guidance
- [x] Add weather-related plumbing advice for Kenya climate

### Phase 4: LLM Integration
- [x] Modify system prompt injection for Kenya region
- [x] Add Kenya-specific context to all LLM queries
- [x] Implement Kenya standards citation in responses
- [x] Create Kenya-aware response formatting
- [x] Test prompt injection with various Kenya queries

### Phase 5: Kenya-Specific Templates
- [x] Create water tank maintenance guidance
- [x] Build borehole and well system advice
- [x] Create water conservation recommendations
- [x] Add informal settlement plumbing considerations
- [x] Build water rationing impact guides

### Phase 6: Testing & Validation
- [x] Test Kenya-specific responses for accuracy
- [x] Verify Kenya standards citations
- [x] Test regional context switching
- [x] Validate supplier information accuracy
- [x] Test water scarcity integration

### Phase 7: Deployment
- [ ] Create checkpoint for Kenya knowledge base
- [ ] Deploy to production
- [ ] Monitor Kenya-specific queries
- [ ] Gather user feedback


## Client Information Page Implementation

### Phase 1: Component & UI
- [x] Create ClientInfoPage component with two-section layout
- [x] Build logo/photo upload area with dashed border and camera icon
- [x] Implement file picker for image upload (.jpg, .png, .webp, max 2MB)
- [x] Create business details form with all required fields
- [x] Add province dropdown with SA provinces
- [x] Build profile completion progress bar indicator
- [x] Implement responsive design (side-by-side desktop, stacked mobile)

### Phase 2: Data Persistence
- [x] Create localStorage utility for profile data management
- [x] Implement base64 image encoding and storage
- [x] Add profile data loading on app initialization
- [x] Create global profile context/state for app-wide access
- [x] Implement "Save Profile" functionality
- [x] Add "Clear All" with confirmation dialog
- [x] Ensure data persists across sessions

### Phase 3: User Feedback
- [x] Implement success toast notification on save
- [x] Add profile completion percentage calculation
- [x] Build progress bar with color coding (red/amber/green)
- [x] Add validation feedback for form fields
- [x] Implement "Remove" button for logo

### Phase 4: Integration
- [x] Connect profile data to PDF job report generation
- [x] Auto-populate company name, logo, VAT, address in reports
- [x] Update cost estimator to show company name
- [x] Integrate profile name into chat header
- [x] Replace generic "Profile" button with user/company name

### Phase 5: Navigation & Access
- [x] Update Profile button to open ClientInfoPage
- [x] Add close button (✕) to return to chat
- [x] Implement slide-over or modal presentation
- [x] Ensure proper routing and state management
- [x] Test navigation flow

### Phase 6: Testing
- [x] Test logo upload and preview
- [x] Test form field persistence
- [x] Test profile completion calculation
- [x] Test integration with PDF generation
- [x] Test mobile responsiveness
- [x] Test data clearing and reset

### Phase 7: Deployment
- [ ] Create checkpoint for Client Information Page
- [ ] Deploy to production
- [ ] Monitor user adoption
- [ ] Gather feedback


## Jobs Management System

### Phase 1: Data Model & Storage
- [x] Create job data model and TypeScript interfaces
- [x] Build jobStorage utility for localStorage persistence
- [x] Implement job reference number generation (PA-YYYY-NNNN format)
- [x] Create job CRUD operations (create, read, update, delete)
- [x] Implement timeline/activity log tracking
- [x] Add data migration and validation functions

### Phase 2: Save Job Modal
- [x] Create SaveJobModal component with drawer/slide-up layout
- [x] Build client details section (name, phone, email, WhatsApp, address)
- [x] Create job details section (title, summary, type, priority, scheduling)
- [x] Implement job status section (pill selector)
- [x] Add internal notes textarea
- [x] Implement AI-generated issue summary auto-population
- [x] Add auto-suggest for job titles based on conversation
- [x] Integrate with chat interface

### Phase 3: Jobs Tab & List View
- [x] Add Jobs tab to main navigation (briefcase icon)
- [x] Create Jobs page/component
- [x] Build dashboard summary strip (4 stat cards)
- [x] Implement job list view with cards
- [x] Add status and priority badges/indicators
- [x] Create action buttons (Open, Resume Chat, More)
- [x] Build empty state with illustration
- [x] Implement responsive mobile bottom navigation

### Phase 4: Kanban Board View
- [x] Create Kanban board component with 5 columns
- [x] Implement drag-and-drop with SortableJS
- [x] Add status update on card drop
- [x] Build empty column states
- [x] Implement horizontal scroll on mobile
- [x] Add column count badges
- [x] Create smooth animations for card movement

### Phase 5: Job Detail View
- [ ] Create job detail page/slide-over panel
- [ ] Build Overview tab (client details, issue summary, notes)
- [ ] Create Conversation tab (read-only chat display)
- [ ] Build Documents tab (PDF list with preview/download/share)
- [ ] Implement Timeline tab (activity log)
- [ ] Add inline editing for title, status, priority
- [ ] Create bottom action bar (Edit, Change Status, Share, Delete)
- [ ] Implement "Resume Chat" functionality

### Phase 6: Search, Filter & Sort
- [ ] Implement real-time search across all fields
- [ ] Add debounced search (200ms)
- [ ] Create filter pills for status, priority, job type
- [ ] Implement "This Month" quick filter
- [ ] Build sort options (Newest, Oldest, Scheduled Date, Client Name, Priority)
- [ ] Add search highlighting in results
- [ ] Create "No results" empty state
- [ ] Implement quick filter from stat cards

### Phase 7: WhatsApp & Auto-Save
- [ ] Implement WhatsApp share integration (wa.me links)
- [ ] Create pre-formatted job summary messages
- [ ] Build auto-save prompt (every 4th message)
- [ ] Add quick-save button to prompt
- [ ] Implement share via WhatsApp on job cards
- [ ] Create share via WhatsApp on documents
- [ ] Test WhatsApp message formatting

### Phase 8: Testing & Deployment
- [ ] Create comprehensive unit tests for job operations
- [ ] Test localStorage persistence across sessions
- [ ] Test Kanban drag-and-drop functionality
- [ ] Test search and filtering
- [ ] Test WhatsApp share links
- [ ] Test mobile responsiveness
- [ ] Verify integration with existing features
- [ ] Create checkpoint for Jobs system
- [ ] Deploy to production


## Tax Invoice Generator

### Phase 1: Data Model & Banking Setup
- [ ] Create invoice TypeScript interfaces and types
- [ ] Build invoiceStorage utility for localStorage persistence
- [ ] Create banking details storage and management
- [ ] Implement invoice numbering system (PA-INV-YYYY-NNNN)
- [ ] Add banking details validation

### Phase 2: Banking Details Modal
- [ ] Create BankingDetailsModal component
- [ ] Build bank dropdown with auto-fill branch codes
- [ ] Implement account type selector
- [ ] Create reference format radio buttons
- [ ] Add save and edit functionality
- [ ] Persist banking details to localStorage

### Phase 3: Invoice Details Modal
- [ ] Create CreateInvoiceModal component
- [ ] Build invoice identity section (number, dates, PO)
- [ ] Create Bill To section (client details)
- [ ] Create Bill From section (company details)
- [ ] Build line items table with editing
- [ ] Implement quick-add buttons (Labour, Call-Out Fee)
- [ ] Add totals calculation (subtotal, VAT, total)
- [ ] Create payment terms section
- [ ] Add optional thank you message

### Phase 4: PDF Generation
- [ ] Create Tax Invoice PDF generator
- [ ] Implement SARS-compliant layout
- [ ] Add company logo and header
- [ ] Build invoice meta block
- [ ] Create line items table with alternating rows
- [ ] Add banking details block
- [ ] Implement payment terms section
- [ ] Add thank you message section
- [ ] Create footer with compliance text
- [ ] Apply brand colour styling

### Phase 5: Invoice Status & Tracking
- [ ] Create invoice status enum (Draft, Sent, Overdue, Paid, Cancelled)
- [ ] Build status update functions
- [ ] Implement timeline logging for status changes
- [ ] Create overdue detection logic
- [ ] Add auto-check on app load
- [ ] Build overdue warning banner

### Phase 6: Invoices List View
- [ ] Create Invoices sub-section in Jobs tab
- [ ] Build invoice list table with all details
- [ ] Create financial summary strip (Outstanding, Overdue, Paid)
- [ ] Implement quick actions (Download, Share, Mark Paid)
- [ ] Add status badges and filtering

### Phase 7: WhatsApp & Client Detection
- [ ] Implement WhatsApp share functionality
- [ ] Create pre-formatted invoice messages
- [ ] Build repeat client detection
- [ ] Add client history notice
- [ ] Test WhatsApp message formatting

### Phase 8: Invoice Settings
- [ ] Add Invoice Settings section to Profile
- [ ] Create default payment terms field
- [ ] Add default due date period selector
- [ ] Build default call-out fee input
- [ ] Add VAT registration toggle
- [ ] Create invoice prefix editor
- [ ] Add next invoice number input
- [ ] Build banking details editor

### Phase 9: Testing & Deployment
- [ ] Write comprehensive unit tests
- [ ] Test PDF generation and styling
- [ ] Test invoice numbering system
- [ ] Test status tracking and overdue detection
- [ ] Test WhatsApp share links
- [ ] Test repeat client detection
- [ ] Verify SARS compliance
- [ ] Test mobile responsiveness
- [ ] Create checkpoint
- [ ] Deploy to production


## WhatsApp Integration & Repeat Client Detection

### Phase 1: WhatsApp Integration Utilities
- [ ] Create WhatsApp message formatter utility
- [ ] Build invoice summary text generator
- [ ] Implement phone number validation and formatting
- [ ] Create WhatsApp Web link generator (wa.me protocol)
- [ ] Add message template system for different scenarios
- [ ] Implement URL encoding for special characters

### Phase 2: Repeat Client Detection
- [ ] Create client history analyzer function
- [ ] Build repeat client detection logic
- [ ] Implement job history aggregation
- [ ] Create client statistics calculator
- [ ] Add previous invoice history lookup
- [ ] Build client profile summary generator

### Phase 3: Invoice Sharing Modal
- [ ] Create InvoiceShareModal component
- [ ] Build WhatsApp share button with phone input
- [ ] Implement email share option
- [ ] Add message preview section
- [ ] Create copy-to-clipboard functionality
- [ ] Add share history tracking

### Phase 4: Client History View
- [ ] Create ClientHistoryPanel component
- [ ] Build previous jobs timeline
- [ ] Display previous invoices list
- [ ] Show total spent and average job value
- [ ] Add job status indicators
- [ ] Implement quick re-quote functionality

### Phase 5: Invoice Creation Integration
- [ ] Add repeat client detection to CreateInvoiceModal
- [ ] Display client history when selecting existing client
- [ ] Show previous job types and costs
- [ ] Implement quick-populate from previous jobs
- [ ] Add "Repeat Job" button for similar services

### Phase 6: Invoices List Enhancement
- [ ] Add WhatsApp share button to invoice cards
- [ ] Create bulk share functionality
- [ ] Build invoice status badges
- [ ] Add financial summary strip
- [ ] Implement quick actions menu
- [ ] Add filter by client

### Phase 7: Testing & Deployment
- [ ] Test WhatsApp message formatting
- [ ] Test repeat client detection accuracy
- [ ] Test phone number validation
- [ ] Test message preview rendering
- [ ] Create checkpoint
- [ ] Deploy to production


## Invoices Tab Implementation

### Phase 1: Invoices Page & Dashboard
- [x] Create Invoices page component
- [x] Build financial summary cards (Outstanding, Overdue, Paid This Month)
- [x] Implement invoice list view with cards
- [x] Add status badges (Draft, Sent, Overdue, Paid)
- [x] Create empty state with illustration
- [x] Add responsive mobile layout

### Phase 2: Status & Summary
- [x] Implement invoice status indicators
- [x] Build color-coded status badges
- [x] Create financial summary calculations
- [x] Add invoice count by status
- [x] Implement total outstanding amount
- [x] Add paid this month tracking

### Phase 3: Search & Filter
- [x] Add real-time search by client/invoice number
- [x] Create filter pills (status, date range)
- [x] Implement sorting options (date, amount, status)
- [x] Add date range picker
- [x] Build filter reset functionality
- [x] Create active filter display

### Phase 4: WhatsApp Integration
- [x] Add WhatsApp share button to invoice cards
- [x] Integrate InvoiceShareModal
- [x] Implement quick share with phone number
- [x] Add share history tracking
- [x] Create bulk share functionality
- [x] Add share confirmation

### Phase 5: Invoice Details & Edit
- [x] Create invoice detail modal
- [x] Build edit functionality
- [x] Implement status change interface
- [x] Add payment date tracking
- [x] Create invoice notes section
- [x] Build PDF download button

### Phase 6: Overdue Detection
- [x] Implement overdue detection logic
- [x] Create overdue alert banner
- [x] Build overdue invoice highlighting
- [x] Add overdue amount calculation
- [x] Implement overdue filter
- [x] Create payment reminder feature

### Phase 7: Testing & Deployment
- [x] Test invoice list rendering
- [x] Test search and filtering
- [x] Test WhatsApp sharing
- [x] Test overdue detection
- [ ] Create checkpoint
- [ ] Deploy to production
