import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock service for applications - would be replaced with a real service
const ApplicationsService = {
  getApplications: async (filters = {}) => {
    // Simulate API call with mock data
    return Promise.resolve(mockApplicationsData);
  },
  
  getApplicationDetails: async (applicationId) => {
    // Find application in mock data
    const application = mockApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('Application not found'));
    }
    return Promise.resolve(application);
  },
  
  updateApplicationStatus: async (applicationId, status, notes = '') => {
    // Find application in mock data
    const application = mockApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('Application not found'));
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
  
  addApplicationNote: async (applicationId, note) => {
    // Find application in mock data
    const application = mockApplicationsData.find(app => app.id === applicationId);
    if (!application) {
      return Promise.reject(new Error('Application not found'));
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

// Mock data for applications
export const mockApplicationsData = [
  {
    id: "app-001",
    form_type: "IPP-1",
    form_name: "Individual Pension Plan Application",
    status: "SUBMITTED",
    submission_date: "2023-07-12T14:30:00Z",
    customer: {
      name: "John Doe",
      phone_number: "+1234567890", // Links to conversation
      email: "john.doe@example.com",
      id_number: "3374950281"
    },
    form_data: {
      personal_details: {
        full_name: "John Michael Doe",
        date_of_birth: "1985-06-15",
        gender: "MALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "3374950281",
        marital_status: "MARRIED"
      },
      contact_details: {
        phone_number: "+1234567890",
        alternative_phone: "+1234567899",
        email: "john.doe@example.com",
        physical_address: "123 Main St, Kampala",
        postal_address: "P.O Box 12345, Kampala"
      },
      employment_details: {
        employment_status: "EMPLOYED",
        employer_name: "ABC Corporation",
        job_title: "Senior Engineer",
        industry: "TECHNOLOGY",
        monthly_income: 3500000
      },
      contribution_details: {
        initial_contribution: 1000000,
        monthly_contribution: 350000,
        payment_method: "MOBILE_MONEY",
        start_date: "2023-08-01"
      },
      beneficiaries: [
        {
          name: "Jane Doe",
          relationship: "SPOUSE",
          phone_number: "+1234567000",
          percentage: 60,
          id_number: "1234567890"
        },
        {
          name: "Michael Doe",
          relationship: "CHILD",
          phone_number: "+1234567001",
          percentage: 40,
          id_number: "2345678901"
        }
      ],
      investment_preferences: {
        risk_tolerance: "MODERATE",
        preferred_portfolio: "BALANCED",
        investment_horizon: "10_YEARS_PLUS"
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true
      }
    },
    attachments: [
      {
        id: "att-101",
        name: "national_id.jpg",
        type: "image/jpeg",
        size: 1259340,
        url: "https://example.com/attachments/national_id.jpg",
        document_type: "ID_DOCUMENT"
      },
      {
        id: "att-102",
        name: "proof_of_income.pdf",
        type: "application/pdf",
        size: 2583921,
        url: "https://example.com/attachments/proof_of_income.pdf",
        document_type: "INCOME_PROOF"
      }
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-07-12T14:30:00Z",
        notes: "Initial submission via WhatsApp"
      }
    ],
    notes: [
      {
        id: "note-101",
        application_id: "app-001",
        content: "Customer completed all required fields. Documents verified.",
        created_at: "2023-07-12T15:10:00Z",
        created_by: "Agent Sarah"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: false,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-123" // Cross-reference to conversation
  },
  {
    id: "app-002",
    form_type: "IPP-1",
    form_name: "Individual Pension Plan Application",
    status: "PENDING_DOCUMENTS",
    submission_date: "2023-07-11T10:15:00Z",
    customer: {
      name: "Jane Smith",
      phone_number: "+1987654321", // Links to conversation
      email: "jane.smith@example.com",
      id_number: "4485067392"
    },
    form_data: {
      personal_details: {
        full_name: "Jane Elizabeth Smith",
        date_of_birth: "1990-03-22",
        gender: "FEMALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "4485067392",
        marital_status: "SINGLE"
      },
      contact_details: {
        phone_number: "+1987654321",
        alternative_phone: "",
        email: "jane.smith@example.com",
        physical_address: "456 Park Avenue, Kampala",
        postal_address: "P.O Box 54321, Kampala"
      },
      employment_details: {
        employment_status: "SELF_EMPLOYED",
        employer_name: "Self",
        job_title: "Consultant",
        industry: "FINANCE",
        monthly_income: 2800000
      },
      contribution_details: {
        initial_contribution: 750000,
        monthly_contribution: 280000,
        payment_method: "BANK_TRANSFER",
        start_date: "2023-08-01"
      },
      beneficiaries: [
        {
          name: "Robert Smith",
          relationship: "PARENT",
          phone_number: "+1987654000",
          percentage: 100,
          id_number: "3456789012"
        }
      ],
      investment_preferences: {
        risk_tolerance: "CONSERVATIVE",
        preferred_portfolio: "INCOME",
        investment_horizon: "5_TO_10_YEARS"
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true
      }
    },
    attachments: [
      {
        id: "att-201",
        name: "national_id.jpg",
        type: "image/jpeg",
        size: 945621,
        url: "https://example.com/attachments/jane_national_id.jpg",
        document_type: "ID_DOCUMENT"
      }
      // Missing income proof document
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-07-11T10:15:00Z",
        notes: "Initial submission via WhatsApp"
      },
      {
        from_status: "SUBMITTED",
        to_status: "PENDING_DOCUMENTS",
        changed_at: "2023-07-11T11:30:00Z",
        notes: "Missing income verification document"
      }
    ],
    notes: [
      {
        id: "note-201",
        application_id: "app-002",
        content: "Customer needs to provide proof of income document. ID verification completed.",
        created_at: "2023-07-11T11:35:00Z",
        created_by: "Agent Demo"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: false,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-124" // Cross-reference to conversation
  },
  {
    id: "app-003",
    form_type: "IPP-1",
    form_name: "Individual Pension Plan Application",
    status: "APPROVED",
    submission_date: "2023-07-05T09:45:00Z",
    customer: {
      name: "Robert Johnson",
      phone_number: "+1122334455", // Links to conversation
      email: "robert.johnson@example.com",
      id_number: "5596178403"
    },
    form_data: {
      personal_details: {
        full_name: "Robert Andrew Johnson",
        date_of_birth: "1978-11-30",
        gender: "MALE",
        nationality: "Ugandan",
        id_type: "NATIONAL_ID",
        id_number: "5596178403",
        marital_status: "MARRIED"
      },
      contact_details: {
        phone_number: "+1122334455",
        alternative_phone: "+1122334466",
        email: "robert.johnson@example.com",
        physical_address: "789 Oak Drive, Kampala",
        postal_address: "P.O Box 78901, Kampala"
      },
      employment_details: {
        employment_status: "EMPLOYED",
        employer_name: "Global Enterprises Ltd",
        job_title: "Finance Manager",
        industry: "FINANCE",
        monthly_income: 4200000
      },
      contribution_details: {
        initial_contribution: 2000000,
        monthly_contribution: 500000,
        payment_method: "DIRECT_DEBIT",
        start_date: "2023-07-15"
      },
      beneficiaries: [
        {
          name: "Sarah Johnson",
          relationship: "SPOUSE",
          phone_number: "+1122335577",
          percentage: 70,
          id_number: "6607289514"
        },
        {
          name: "Thomas Johnson",
          relationship: "CHILD",
          phone_number: "+1122335588",
          percentage: 30,
          id_number: "7718390625"
        }
      ],
      investment_preferences: {
        risk_tolerance: "AGGRESSIVE",
        preferred_portfolio: "GROWTH",
        investment_horizon: "10_YEARS_PLUS"
      },
      declarations: {
        terms_accepted: true,
        data_consent: true,
        information_accuracy: true
      }
    },
    attachments: [
      {
        id: "att-301",
        name: "national_id.pdf",
        type: "application/pdf",
        size: 1056421,
        url: "https://example.com/attachments/robert_national_id.pdf",
        document_type: "ID_DOCUMENT"
      },
      {
        id: "att-302",
        name: "salary_slip.pdf",
        type: "application/pdf",
        size: 890732,
        url: "https://example.com/attachments/robert_salary_slip.pdf",
        document_type: "INCOME_PROOF"
      },
      {
        id: "att-303",
        name: "employment_letter.pdf",
        type: "application/pdf",
        size: 1234567,
        url: "https://example.com/attachments/robert_employment_letter.pdf",
        document_type: "EMPLOYMENT_PROOF"
      }
    ],
    status_history: [
      {
        from_status: "DRAFT",
        to_status: "SUBMITTED",
        changed_at: "2023-07-05T09:45:00Z",
        notes: "Initial submission via WhatsApp"
      },
      {
        from_status: "SUBMITTED",
        to_status: "UNDER_REVIEW",
        changed_at: "2023-07-05T10:30:00Z",
        notes: "All documents received, starting review"
      },
      {
        from_status: "UNDER_REVIEW",
        to_status: "APPROVED",
        changed_at: "2023-07-07T14:20:00Z",
        notes: "All verifications complete, application approved"
      }
    ],
    notes: [
      {
        id: "note-301",
        application_id: "app-003",
        content: "All documents verified. Employment confirmed with HR at Global Enterprises.",
        created_at: "2023-07-06T11:35:00Z",
        created_by: "Agent Mark"
      },
      {
        id: "note-302",
        application_id: "app-003",
        content: "Beneficiary details verified. Investment preference confirmed.",
        created_at: "2023-07-07T09:15:00Z",
        created_by: "Agent Mark"
      },
      {
        id: "note-303",
        application_id: "app-003",
        content: "Application meets all requirements. Recommended for approval.",
        created_at: "2023-07-07T14:00:00Z",
        created_by: "Agent Mark"
      }
    ],
    verification_flags: {
      id_verified: true,
      income_verified: true,
      beneficiary_details_complete: true
    },
    conversation_id: "conv-125" // Cross-reference to conversation
  }
];

// Fetch applications list
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await ApplicationsService.getApplications(filters);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch applications');
    }
  }
);

// Fetch application details
export const fetchApplicationDetails = createAsyncThunk(
  'applications/fetchApplicationDetails',
  async (applicationId, { rejectWithValue }) => {
    try {
      return await ApplicationsService.getApplicationDetails(applicationId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch application details');
    }
  }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, status, notes }, { rejectWithValue }) => {
    try {
      return await ApplicationsService.updateApplicationStatus(applicationId, status, notes);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update application status');
    }
  }
);

// Add note to application
export const addApplicationNote = createAsyncThunk(
  'applications/addNote',
  async ({ applicationId, note }, { rejectWithValue }) => {
    try {
      return await ApplicationsService.addApplicationNote(applicationId, note);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add application note');
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
    fetchApplications: 'idle',
    fetchApplicationDetails: 'idle',
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

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    selectApplication: (state, action) => {
      state.selectedApplicationId = action.payload;
    },
    
    clearSelectedApplication: (state) => {
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
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.loadingStatus.fetchApplications = 'pending';
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loadingStatus.fetchApplications = 'succeeded';
        
        // Normalize the data
        state.byId = {};
        state.allIds = [];
        
        action.payload.forEach(application => {
          state.byId[application.id] = application;
          state.allIds.push(application.id);
        });
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loadingStatus.fetchApplications = 'failed';
        state.error = action.payload;
      })
      
      // Fetch application details
      .addCase(fetchApplicationDetails.pending, (state) => {
        state.loadingStatus.fetchApplicationDetails = 'pending';
        state.error = null;
      })
      .addCase(fetchApplicationDetails.fulfilled, (state, action) => {
        state.loadingStatus.fetchApplicationDetails = 'succeeded';
        
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
      .addCase(fetchApplicationDetails.rejected, (state, action) => {
        state.loadingStatus.fetchApplicationDetails = 'failed';
        state.error = action.payload;
      })
      
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loadingStatus.updateStatus = 'pending';
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loadingStatus.updateStatus = 'succeeded';
        
        const application = action.payload;
        
        // Update application in state
        state.byId[application.id] = {
          ...state.byId[application.id],
          ...application
        };
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loadingStatus.updateStatus = 'failed';
        state.error = action.payload;
      })
      
      // Add application note
      .addCase(addApplicationNote.pending, (state) => {
        state.loadingStatus.addNote = 'pending';
        state.error = null;
      })
      .addCase(addApplicationNote.fulfilled, (state, action) => {
        state.loadingStatus.addNote = 'succeeded';
        
        const note = action.payload;
        const applicationId = note.application_id;
        
        // Add note to application
        if (state.byId[applicationId]) {
          state.byId[applicationId].notes.push(note);
        }
      })
      .addCase(addApplicationNote.rejected, (state, action) => {
        state.loadingStatus.addNote = 'failed';
        state.error = action.payload;
      });
  }
});

export const { 
  selectApplication,
  clearSelectedApplication,
  updateFilters,
  clearFilters,
  clearError
} = applicationsSlice.actions;

// Selectors
export const selectAllApplications = state => 
  state.applications.allIds.map(id => state.applications.byId[id]);

export const selectApplicationById = (state, applicationId) => 
  state.applications.byId[applicationId];

export const selectCurrentApplication = state => 
  state.applications.selectedApplicationId 
    ? state.applications.byId[state.applications.selectedApplicationId]
    : null;

export const selectIsLoading = state => 
  Object.values(state.applications.loadingStatus).some(status => status === 'pending');

export const selectFilteredApplications = state => {
  const { status, dateRange, searchTerm } = state.applications.activeFilters;
  const allApplications = selectAllApplications(state);
  
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

export default applicationsSlice.reducer;