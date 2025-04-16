import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLibApplicationDetails,
  updateLibApplicationStatus,
  addLibApplicationNote,
  selectLibApplicationById,
} from '../redux/slices/libApplicationsSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import AttachmentPreview from '../components/AttachmentPreview';

const LibApplicationDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const application = useSelector((state) => selectLibApplicationById(state, id));
  const isLoading = useSelector((state) => state.libApplications.loadingStatus.fetchLibApplicationDetails === 'pending');
  const isUpdating = useSelector((state) => state.libApplications.loadingStatus.updateStatus === 'pending');
  const isAddingNote = useSelector((state) => state.libApplications.loadingStatus.addNote === 'pending');
  
  const [activeTab, setActiveTab] = useState('details');
  const [statusUpdateModal, setStatusUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchLibApplicationDetails(id));
    }
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  const handleStatusUpdate = () => {
    if (newStatus && id) {
      dispatch(updateLibApplicationStatus({
        applicationId: id,
        status: newStatus,
        notes: statusNotes
      })).then(() => {
        setStatusUpdateModal(false);
        setNewStatus('');
        setStatusNotes('');
      });
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (noteContent.trim() && id) {
      dispatch(addLibApplicationNote({
        applicationId: id,
        note: noteContent
      })).then(() => {
        setNoteContent('');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Application Not Found</h2>
        <p className="mt-2 text-gray-600">The application you're looking for doesn't exist or you don't have permission to view it.</p>
        <button
          onClick={() => navigate('/lib-applications')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Back to LIB Applications
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/lib-applications" className="text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">{application.form_name}</h1>
          </div>
          <p className="text-gray-600">
            Submitted by {application.customer.name} on {formatDate(application.submission_date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            to={`/conversations/${application.conversation_id}`}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            View Conversation
          </Link>
          <button
            onClick={() => setStatusUpdateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <div className="mt-1">
              <span
                className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                  application.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                  application.status === 'PENDING_DOCUMENTS' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'UNDER_REVIEW' ? 'bg-purple-100 text-purple-800' :
                  application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                {application.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="space-x-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <span className="text-sm text-gray-700">ID: {application.id}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm text-gray-700">{application.customer.phone_number}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Application Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Status History
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-3 border-b-2 font-medium text-sm ${
              activeTab === 'notes'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Application Details */}
        {activeTab === 'details' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.personal_details.full_name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.personal_details.date_of_birth}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Gender</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.personal_details.gender}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nationality</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.personal_details.nationality}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID Type / Number</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {application.form_data.personal_details.id_type.replace(/_/g, ' ')} / {application.form_data.personal_details.id_number}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Marital Status</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.personal_details.marital_status}</div>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.contact_details.phone_number}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Alternative Phone</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.contact_details.alternative_phone || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.contact_details.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Physical Address</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.contact_details.physical_address}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Postal Address</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.contact_details.postal_address}</div>
                  </div>
                </div>
              </section>

              {/* Employment Information */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employment Status</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.employment_details.employment_status.replace(/_/g, ' ')}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employer Name</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.employment_details.employer_name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Job Title</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.employment_details.job_title}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Industry</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.employment_details.industry}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Monthly Income</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {formatCurrency(application.form_data.employment_details.monthly_income)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Policy Details */}
              <section>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Policy Type</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.policy_details.policy_type}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Cover Amount</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {formatCurrency(application.form_data.policy_details.cover_amount)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Premium Amount</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {formatCurrency(application.form_data.policy_details.premium_amount)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Premium Payment Frequency</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.policy_details.premium_payment_frequency}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Policy Term (Years)</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.policy_details.policy_term}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Payment Method</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.policy_details.payment_method.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Health Information */}
            <section className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Health Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Has Existing Conditions</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.health_information.has_existing_conditions ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Smoker</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.health_information.smoker ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Height (cm)</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.health_information.height_cm}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Weight (kg)</label>
                    <div className="mt-1 text-sm text-gray-900">{application.form_data.health_information.weight_kg}</div>
                  </div>
                </div>

                {application.form_data.health_information.has_existing_conditions && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-500">Existing Conditions</label>
                    <ul className="mt-2 space-y-1 text-sm text-gray-900 list-disc list-inside">
                      {application.form_data.health_information.existing_conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Beneficiaries */}
            <section className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Beneficiaries</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Relationship
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {application.form_data.beneficiaries.map((beneficiary, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {beneficiary.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {beneficiary.relationship}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {beneficiary.phone_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {beneficiary.id_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {beneficiary.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Verification Status */}
            <section className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${application.verification_flags.id_verified ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center">
                    {application.verification_flags.id_verified ? (
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${application.verification_flags.id_verified ? 'text-green-700' : 'text-red-700'}`}>
                      ID Verification
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${application.verification_flags.income_verified ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center">
                    {application.verification_flags.income_verified ? (
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${application.verification_flags.income_verified ? 'text-green-700' : 'text-red-700'}`}>
                      Income Verification
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${application.verification_flags.medical_checked ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center">
                    {application.verification_flags.medical_checked ? (
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${application.verification_flags.medical_checked ? 'text-green-700' : 'text-red-700'}`}>
                      Medical Verification
                    </span>
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${application.verification_flags.beneficiary_details_complete ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center">
                    {application.verification_flags.beneficiary_details_complete ? (
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${application.verification_flags.beneficiary_details_complete ? 'text-green-700' : 'text-red-700'}`}>
                      Beneficiary Details
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {application.attachments.map((attachment) => (
                <div key={attachment.id} className="border rounded-lg overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-900">
                        {attachment.document_type.replace(/_/g, ' ')}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {attachment.type.split('/')[1].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <AttachmentPreview attachment={attachment} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {application.status_history.map((statusChange, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== application.status_history.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            statusChange.to_status === 'SUBMITTED' ? 'bg-blue-500' :
                            statusChange.to_status === 'PENDING_DOCUMENTS' ? 'bg-yellow-500' :
                            statusChange.to_status === 'UNDER_REVIEW' ? 'bg-purple-500' :
                            statusChange.to_status === 'APPROVED' ? 'bg-green-500' :
                            statusChange.to_status === 'REJECTED' ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}>
                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Status changed from <span className="font-medium text-gray-900">{statusChange.from_status.replace(/_/g, ' ')}</span> to{' '}
                              <span className="font-medium text-gray-900">{statusChange.to_status.replace(/_/g, ' ')}</span>
                            </p>
                            {statusChange.notes && (
                              <p className="mt-1 text-sm text-gray-600">{statusChange.notes}</p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {formatDate(statusChange.changed_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="p-6">
            {/* Add Note Form */}
            <div className="mb-6">
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Add Note
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="note"
                      name="note"
                      rows={3}
                      className="shadow-sm block w-full focus:ring-primary focus:border-primary sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add a note about this application..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    disabled={isAddingNote || !noteContent.trim()}
                  >
                    {isAddingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
              </form>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {application.notes.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No notes have been added to this application yet.
                  </p>
                </div>
              ) : (
                application.notes.slice().reverse().map((note) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{note.created_by}</div>
                        <span className="mx-2 text-gray-300">·</span>
                        <div className="text-sm text-gray-500">{formatDate(note.created_at)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setStatusUpdateModal(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Update Application Status
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Select a new status for this application. This will be recorded in the application history.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    New Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  >
                    <option value="">Select a status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="PENDING_DOCUMENTS">Pending Documents</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Add any notes about this status change..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setStatusUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={handleStatusUpdate}
                    disabled={isUpdating || !newStatus}
                  >
                    {isUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default LibApplicationDetails;