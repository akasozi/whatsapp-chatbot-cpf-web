import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock service for LIB applications - would be replaced with a real service
const LibApplicationsService = {
  getLibApplications: async (filters = {}) => {
    // Simulate API call with mock data
    return Promise.resolve(mockLibApplicationsData);
  },
  
  getLibApplicationDetails: async (applicationId) => {
    // Find application in mock data
    const application = mockLibApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('LIB Application not found'));
    }
    return Promise.resolve(application);
  },
  
  updateLibApplicationStatus: async (applicationId, status, notes = '') => {
    // Find application in mock data
    const application = mockLibApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('LIB Application not found'));
    }
    
    // Update status
    application.status = status;
    
    // Add status change to history
    application.status_history.push({
      from_status: application.status,
      to_status: status,
      changed_at: new Date().toISOString(),
      notes: notes
    });
    
    return Promise.resolve(application);
  },
  
  addLibApplicationNote: async (applicationId, note) => {
    // Find application in mock data
    const application = mockLibApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('LIB Application not found'));
    }
    
    const newNote = {
      id: `note-${Date.now()}`,
      application_id: applicationId,
      content: note,
      created_at: new Date().toISOString(),
      created_by: 'Agent Demo'
    };
    
    // Add note to application
    application.notes.push(newNote);
    
    return Promise.resolve(newNote);
  }
};

// Mock data for LIB applications
export const mockLibApplicationsData = [
  {
    id: "lib-001",
    form_type: "LIB-FLEX",
    form_name: "LIB Flex Maisha Application",
    status: "SUBMITTED",
    submission_date: "2023-08-10T11:20:00Z",
    customer: {
      name: "Grace Nakato",
      phone_number: "+2567890123", // Links to conversation
      email: "grace.nakato@example.com",
      id_number: "7843910265"
    },
    form_data: {
      personal_details: {
        full_name: "Grace Nakato",
        date_of_birth: "1982-04-18",
        gender: "FEMALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "7843910265",
        marital_status: "MARRIED"
      },
      contact_details: {
        phone_number: "+2567890123",
        alternative_phone: "+2567890124",
        email: "grace.nakato@example.com",
        physical_address: "45 Kampala Road, Kampala",
        postal_address: "P.O Box 30002, Kampala"
      },
      employment_details: {
        employment_status: "EMPLOYED",
        employer_name: "East African Bank",
        job_title: "Branch Manager",
        industry: "BANKING",
        monthly_income: 5200000
      },
      policy_details: {
        policy_type: "INDIVIDUAL",
        cover_amount: 50000000,
        premium_payment_frequency: "MONTHLY",
        premium_amount: 250000,
        policy_term: 15,
        payment_method: "DIRECT_DEBIT"
      },
      beneficiaries: [
        {
          name: "Daniel Nakato",
          relationship: "SPOUSE",
          phone_number: "+2567890125",
          percentage: 60,
          id_number: "8943015267"
        },
        {
          name: "Samuel Nakato",
          relationship: "CHILD",
          phone_number: "+2567890126",
          percentage: 20,
          id_number: "9054126378"
        },
        {
          name: "Sarah Nakato",
          relationship: "CHILD",
          phone_number: "+2567890127",
          percentage: 20,
          id_number: "9154237489"
        }
      ],
      health_information: {
        has_existing_conditions: false,
        existing_conditions: [],
        smoker: false,
        height_cm: 165,
        weight_kg: 62
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true,
        health_disclosure: true
      }
    },
    attachments: [
      {
        id: "att-401",
        name: "national_id.jpg",
        type: "image/jpeg",
        size: 1356921,
        url: "https://example.com/attachments/grace_national_id.jpg",
        document_type: "ID_DOCUMENT"
      },
      {
        id: "att-402",
        name: "employment_letter.pdf",
        type: "application/pdf",
        size: 2145678,
        url: "https://example.com/attachments/grace_employment_letter.pdf",
        document_type: "EMPLOYMENT_PROOF"
      },
      {
        id: "att-403",
        name: "medical_report.pdf",
        type: "application/pdf",
        size: 3245761,
        url: "https://example.com/attachments/grace_medical_report.pdf",
        document_type: "MEDICAL_REPORT"
      }
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-08-10T11:20:00Z",
        notes: "Initial submission via WhatsApp"
      }
    ],
    notes: [
      {
        id: "note-401",
        application_id: "lib-001",
        content: "All required documents submitted. Medical report appears clean.",
        created_at: "2023-08-10T13:45:00Z",
        created_by: "Agent Lisa"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: true,
      medical_checked: true,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-201" // Cross-reference to conversation
  },
  {
    id: "lib-002",
    form_type: "LIB-FLEX",
    form_name: "LIB Flex Maisha Application",
    status: "UNDER_REVIEW",
    submission_date: "2023-08-05T09:30:00Z",
    customer: {
      name: "David Mugisha",
      phone_number: "+2564567890", // Links to conversation
      email: "david.mugisha@example.com",
      id_number: "6732184950"
    },
    form_data: {
      personal_details: {
        full_name: "David Mugisha",
        date_of_birth: "1975-09-22",
        gender: "MALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "6732184950",
        marital_status: "MARRIED"
      },
      contact_details: {
        phone_number: "+2564567890",
        alternative_phone: "+2564567891",
        email: "david.mugisha@example.com",
        physical_address: "78 Entebbe Road, Kampala",
        postal_address: "P.O Box 40021, Kampala"
      },
      employment_details: {
        employment_status: "SELF_EMPLOYED",
        employer_name: "Mugisha Enterprises",
        job_title: "Business Owner",
        industry: "RETAIL",
        monthly_income: 6500000
      },
      policy_details: {
        policy_type: "FAMILY",
        cover_amount: 75000000,
        premium_payment_frequency: "QUARTERLY",
        premium_amount: 950000,
        policy_term: 20,
        payment_method: "MOBILE_MONEY"
      },
      beneficiaries: [
        {
          name: "Maria Mugisha",
          relationship: "SPOUSE",
          phone_number: "+2564567892",
          percentage: 50,
          id_number: "7832195460"
        },
        {
          name: "James Mugisha",
          relationship: "CHILD",
          phone_number: "+2564567893",
          percentage: 25,
          id_number: "8943206571"
        },
        {
          name: "Rose Mugisha",
          relationship: "CHILD",
          phone_number: "+2564567894",
          percentage: 25,
          id_number: "9054317682"
        }
      ],
      health_information: {
        has_existing_conditions: true,
        existing_conditions: ["Hypertension - controlled with medication"],
        smoker: false,
        height_cm: 175,
        weight_kg: 82
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true,
        health_disclosure: true
      }
    },
    attachments: [
      {
        id: "att-501",
        name: "national_id.jpg",
        type: "image/jpeg",
        size: 1245890,
        url: "https://example.com/attachments/david_national_id.jpg",
        document_type: "ID_DOCUMENT"
      },
      {
        id: "att-502",
        name: "business_registration.pdf",
        type: "application/pdf",
        size: 2387456,
        url: "https://example.com/attachments/david_business_registration.pdf",
        document_type: "BUSINESS_DOCUMENT"
      },
      {
        id: "att-503",
        name: "medical_report.pdf",
        type: "application/pdf",
        size: 4532187,
        url: "https://example.com/attachments/david_medical_report.pdf",
        document_type: "MEDICAL_REPORT"
      },
      {
        id: "att-504",
        name: "bank_statements.pdf",
        type: "application/pdf",
        size: 5789321,
        url: "https://example.com/attachments/david_bank_statements.pdf",
        document_type: "FINANCIAL_DOCUMENT"
      }
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-08-05T09:30:00Z",
        notes: "Initial submission via WhatsApp"
      },
      {
        from_status: "SUBMITTED",
        to_status: "UNDER_REVIEW",
        changed_at: "2023-08-06T11:15:00Z",
        notes: "Medical history needs additional review due to hypertension"
      }
    ],
    notes: [
      {
        id: "note-501",
        application_id: "lib-002",
        content: "All documents received. Business finances look healthy. Medical team needs to evaluate the hypertension condition.",
        created_at: "2023-08-06T11:20:00Z",
        created_by: "Agent James"
      },
      {
        id: "note-502",
        application_id: "lib-002",
        content: "Requested additional medical history from customer. Awaiting response.",
        created_at: "2023-08-07T14:30:00Z",
        created_by: "Agent James"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: true,
      medical_checked: false,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-202" // Cross-reference to conversation
  },
  {
    id: "lib-003",
    form_type: "LIB-FLEX",
    form_name: "LIB Flex Maisha Application",
    status: "APPROVED",
    submission_date: "2023-07-28T14:15:00Z",
    customer: {
      name: "Patricia Namuddu",
      phone_number: "+2561234567", // Links to conversation
      email: "patricia.namuddu@example.com",
      id_number: "5621093847"
    },
    form_data: {
      personal_details: {
        full_name: "Patricia Namuddu",
        date_of_birth: "1988-12-05",
        gender: "FEMALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "5621093847",
        marital_status: "SINGLE"
      },
      contact_details: {
        phone_number: "+2561234567",
        alternative_phone: "+2561234568",
        email: "patricia.namuddu@example.com",
        physical_address: "23 Jinja Road, Kampala",
        postal_address: "P.O Box 50123, Kampala"
      },
      employment_details: {
        employment_status: "EMPLOYED",
        employer_name: "Kampala International University",
        job_title: "Senior Lecturer",
        industry: "EDUCATION",
        monthly_income: 4800000
      },
      policy_details: {
        policy_type: "INDIVIDUAL",
        cover_amount: 45000000,
        premium_payment_frequency: "MONTHLY",
        premium_amount: 200000,
        policy_term: 25,
        payment_method: "BANK_TRANSFER"
      },
      beneficiaries: [
        {
          name: "Robert Namuddu",
          relationship: "PARENT",
          phone_number: "+2561234569",
          percentage: 50,
          id_number: "4510982736"
        },
        {
          name: "Mary Namuddu",
          relationship: "PARENT",
          phone_number: "+2561234570",
          percentage: 50,
          id_number: "4610982736"
        }
      ],
      health_information: {
        has_existing_conditions: false,
        existing_conditions: [],
        smoker: false,
        height_cm: 160,
        weight_kg: 55
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true,
        health_disclosure: true
      }
    },
    attachments: [
      {
        id: "att-601",
        name: "national_id.jpg",
        type: "image/jpeg",
        size: 1123456,
        url: "https://example.com/attachments/patricia_national_id.jpg",
        document_type: "ID_DOCUMENT"
      },
      {
        id: "att-602",
        name: "employment_contract.pdf",
        type: "application/pdf",
        size: 2234567,
        url: "https://example.com/attachments/patricia_employment_contract.pdf",
        document_type: "EMPLOYMENT_PROOF"
      },
      {
        id: "att-603",
        name: "medical_report.pdf",
        type: "application/pdf",
        size: 3345678,
        url: "https://example.com/attachments/patricia_medical_report.pdf",
        document_type: "MEDICAL_REPORT"
      },
      {
        id: "att-604",
        name: "salary_slip.pdf",
        type: "application/pdf",
        size: 1456789,
        url: "https://example.com/attachments/patricia_salary_slip.pdf",
        document_type: "INCOME_PROOF"
      }
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-07-28T14:15:00Z",
        notes: "Initial submission via WhatsApp"
      },
      {
        from_status: "SUBMITTED",
        to_status: "UNDER_REVIEW",
        changed_at: "2023-07-29T09:30:00Z",
        notes: "All documents received, beginning verification process"
      },
      {
        from_status: "UNDER_REVIEW",
        to_status: "APPROVED",
        changed_at: "2023-08-02T15:45:00Z",
        notes: "All verifications complete, application meets all requirements"
      }
    ],
    notes: [
      {
        id: "note-601",
        application_id: "lib-003",
        content: "All documents verified. Employment contract confirmed with HR at KIU.",
        created_at: "2023-07-30T10:20:00Z",
        created_by: "Agent Peter"
      },
      {
        id: "note-602",
        application_id: "lib-003",
        content: "Medical report shows excellent health status. No concerns.",
        created_at: "2023-07-31T11:45:00Z",
        created_by: "Agent Peter"
      },
      {
        id: "note-603",
        application_id: "lib-003",
        content: "Beneficiary information verified. All requirements met for approval.",
        created_at: "2023-08-02T14:30:00Z",
        created_by: "Agent Peter"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: true,
      medical_checked: true,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-203" // Cross-reference to conversation
  }
];

// Fetch lib applications list
export const fetchLibApplications = createAsyncThunk(
  'libApplications/fetchLibApplications',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await LibApplicationsService.getLibApplications(filters);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch LIB applications');
    }
  }
);

// Fetch lib application details
export const fetchLibApplicationDetails = createAsyncThunk(
  'libApplications/fetchLibApplicationDetails',
  async (applicationId, { rejectWithValue }) => {
    try {
      return await LibApplicationsService.getLibApplicationDetails(applicationId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch LIB application details');
    }
  }
);

// Update lib application status
export const updateLibApplicationStatus = createAsyncThunk(
  'libApplications/updateStatus',
  async ({ applicationId, status, notes }, { rejectWithValue }) => {
    try {
      return await LibApplicationsService.updateLibApplicationStatus(applicationId, status, notes);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update LIB application status');
    }
  }
);

// Add note to lib application
export const addLibApplicationNote = createAsyncThunk(
  'libApplications/addNote',
  async ({ applicationId, note }, { rejectWithValue }) => {
    try {
      return await LibApplicationsService.addLibApplicationNote(applicationId, note);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add LIB application note');
    }
  }
);

const initialState = {
  // Normalized applications data
  byId: {},
  allIds: [],
  
  // Current view state
  selectedApplicationId: null,
  
  // UI state
  isLoading: false,
  loadingStatus: {
    fetchLibApplications: 'idle',
    fetchLibApplicationDetails: 'idle',
    updateStatus: 'idle',
    addNote: 'idle',
  },
  error: null,
  
  // Filters 
  activeFilters: {
    status: null,
    dateRange: null,
    searchTerm: '',
  }
};

const libApplicationsSlice = createSlice({
  name: 'libApplications',
  initialState,
  reducers: {
    selectLibApplication: (state, action) => {
      state.selectedApplicationId = action.payload;
    },
    
    clearSelectedLibApplication: (state) => {
      state.selectedApplicationId = null;
    },
    
    updateFilters: (state, action) => {
      state.activeFilters = {
        ...state.activeFilters,
        ...action.payload
      };
    },
    
    clearFilters: (state) => {
      state.activeFilters = {
        status: null,
        dateRange: null,
        searchTerm: '',
      };
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lib applications
      .addCase(fetchLibApplications.pending, (state) => {
        state.loadingStatus.fetchLibApplications = 'pending';
        state.error = null;
      })
      .addCase(fetchLibApplications.fulfilled, (state, action) => {
        state.loadingStatus.fetchLibApplications = 'succeeded';
        
        // Normalize the data
        state.byId = {};
        state.allIds = [];
        
        action.payload.forEach(application => {
          state.byId[application.id] = application;
          state.allIds.push(application.id);
        });
      })
      .addCase(fetchLibApplications.rejected, (state, action) => {
        state.loadingStatus.fetchLibApplications = 'failed';
        state.error = action.payload;
      })
      
      // Fetch lib application details
      .addCase(fetchLibApplicationDetails.pending, (state) => {
        state.loadingStatus.fetchLibApplicationDetails = 'pending';
        state.error = null;
      })
      .addCase(fetchLibApplicationDetails.fulfilled, (state, action) => {
        state.loadingStatus.fetchLibApplicationDetails = 'succeeded';
        
        const application = action.payload;
        
        // Update application details
        state.byId[application.id] = {
          ...state.byId[application.id],
          ...application
        };
        
        // Ensure this application is in our list
        if (!state.allIds.includes(application.id)) {
          state.allIds.push(application.id);
        }
      })
      .addCase(fetchLibApplicationDetails.rejected, (state, action) => {
        state.loadingStatus.fetchLibApplicationDetails = 'failed';
        state.error = action.payload;
      })
      
      // Update lib application status
      .addCase(updateLibApplicationStatus.pending, (state) => {
        state.loadingStatus.updateStatus = 'pending';
        state.error = null;
      })
      .addCase(updateLibApplicationStatus.fulfilled, (state, action) => {
        state.loadingStatus.updateStatus = 'succeeded';
        
        const application = action.payload;
        
        // Update application in state
        state.byId[application.id] = {
          ...state.byId[application.id],
          ...application
        };
      })
      .addCase(updateLibApplicationStatus.rejected, (state, action) => {
        state.loadingStatus.updateStatus = 'failed';
        state.error = action.payload;
      })
      
      // Add lib application note
      .addCase(addLibApplicationNote.pending, (state) => {
        state.loadingStatus.addNote = 'pending';
        state.error = null;
      })
      .addCase(addLibApplicationNote.fulfilled, (state, action) => {
        state.loadingStatus.addNote = 'succeeded';
        
        const note = action.payload;
        const applicationId = note.application_id;
        
        // Add note to application
        if (state.byId[applicationId]) {
          state.byId[applicationId].notes.push(note);
        }
      })
      .addCase(addLibApplicationNote.rejected, (state, action) => {
        state.loadingStatus.addNote = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  selectLibApplication,
  clearSelectedLibApplication,
  updateFilters,
  clearFilters,
  clearError
} = libApplicationsSlice.actions;

// Selectors
export const selectAllLibApplications = state => 
  state.libApplications.allIds.map(id => state.libApplications.byId[id]);

export const selectLibApplicationById = (state, applicationId) => 
  state.libApplications.byId[applicationId];

export const selectCurrentLibApplication = state => 
  state.libApplications.selectedApplicationId 
    ? state.libApplications.byId[state.libApplications.selectedApplicationId]
    : null;

export const selectIsLoading = state => 
  Object.values(state.libApplications.loadingStatus).some(status => status === 'pending');

export const selectFilteredLibApplications = state => {
  const { status, dateRange, searchTerm } = state.libApplications.activeFilters;
  const allApplications = selectAllLibApplications(state);
  
  return allApplications.filter(application => {
    // Filter by status
    if (status && application.status !== status) {
      return false;
    }
    
    // Filter by date range
    if (dateRange) {
      const submissionDate = new Date(application.submission_date);
      
      if (dateRange === 'TODAY') {
        const today = new Date();
        if (submissionDate.toDateString() !== today.toDateString()) {
          return false;
        }
      } else if (dateRange === 'WEEK') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (submissionDate < oneWeekAgo) {
          return false;
        }
      } else if (dateRange === 'MONTH') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        if (submissionDate < oneMonthAgo) {
          return false;
        }
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = application.customer.name?.toLowerCase().includes(searchLower);
      const matchesPhone = application.customer.phone_number?.includes(searchTerm);
      const matchesEmail = application.customer.email?.toLowerCase().includes(searchLower);
      const matchesId = application.customer.id_number?.includes(searchTerm);
      
      if (!matchesName && !matchesPhone && !matchesEmail && !matchesId) {
        return false;
      }
    }
    
    return true;
  });
};

export default libApplicationsSlice.reducer;