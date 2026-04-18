import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Custom form fields per service slug
const SERVICE_FORMS = {
  'college-documentation': [
    { name: 'studentName', label: 'Full Name (as on college records)', type: 'text', required: true },
    { name: 'collegeName', label: 'College Name', type: 'text', required: true },
    { name: 'course', label: 'Course & Year (e.g. B.Tech 3rd Year)', type: 'text', required: true },
    { name: 'rollNumber', label: 'Roll Number / Enrollment Number', type: 'text', required: true },
    { name: 'documentType', label: 'Document Required', type: 'select', required: true, options: ['Bonafide Certificate', 'NOC Letter', 'Migration Certificate', 'Scholarship Form', 'Character Certificate', 'Other'] },
    { name: 'purpose', label: 'Purpose / Reason', type: 'textarea', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'tatkal-train-booking': [
    { name: 'passengerName', label: 'Passenger Full Name', type: 'text', required: true },
    { name: 'age', label: 'Age', type: 'number', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
    { name: 'fromStation', label: 'From Station', type: 'text', required: true },
    { name: 'toStation', label: 'To Station', type: 'text', required: true },
    { name: 'travelDate', label: 'Travel Date', type: 'date', required: true },
    { name: 'trainNumber', label: 'Train Number / Name (if known)', type: 'text', required: false },
    { name: 'classType', label: 'Class', type: 'select', required: true, options: ['Sleeper (SL)', 'AC 3 Tier (3A)', 'AC 2 Tier (2A)', 'AC First Class (1A)', 'Second Sitting (2S)'] },
    { name: 'idType', label: 'ID Proof Type', type: 'select', required: true, options: ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID', 'Driving License'] },
    { name: 'idNumber', label: 'ID Proof Number', type: 'text', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'office-event-management': [
    { name: 'companyName', label: 'Company / Organization Name', type: 'text', required: true },
    { name: 'contactPerson', label: 'Contact Person Name', type: 'text', required: true },
    { name: 'eventType', label: 'Event Type', type: 'select', required: true, options: ['Team Lunch / Dinner', 'Annual Day', 'Product Launch', 'Conference / Seminar', 'Team Outing', 'Award Ceremony', 'Other'] },
    { name: 'guestCount', label: 'Expected Number of Guests', type: 'number', required: true },
    { name: 'eventDate', label: 'Event Date', type: 'date', required: true },
    { name: 'venue', label: 'Preferred Venue / Location', type: 'text', required: false },
    { name: 'budget', label: 'Approximate Budget (₹)', type: 'number', required: true },
    { name: 'requirements', label: 'Special Requirements', type: 'textarea', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'internship-placement': [
    { name: 'studentName', label: 'Full Name', type: 'text', required: true },
    { name: 'qualification', label: 'Current Qualification (e.g. B.Tech CSE Final Year)', type: 'text', required: true },
    { name: 'skills', label: 'Key Skills (e.g. Python, React, Marketing)', type: 'text', required: true },
    { name: 'preferredDomain', label: 'Preferred Domain', type: 'select', required: true, options: ['Software Development', 'Web Development', 'Data Science / AI', 'Digital Marketing', 'Finance / Accounting', 'HR / Management', 'Design / UI-UX', 'Content Writing', 'Other'] },
    { name: 'preferredLocation', label: 'Preferred Location', type: 'text', required: true },
    { name: 'duration', label: 'Internship Duration', type: 'select', required: true, options: ['1 Month', '2 Months', '3 Months', '6 Months', 'Flexible'] },
    { name: 'stipend', label: 'Expected Stipend (₹/month)', type: 'text', required: false },
    { name: 'resumeLink', label: 'Resume Link (Google Drive / LinkedIn)', type: 'text', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'accommodation-finder': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'accommodationType', label: 'Accommodation Type', type: 'select', required: true, options: ['PG (Paying Guest)', 'Hostel', 'Flat / Apartment', 'Room', 'Any'] },
    { name: 'preferredLocation', label: 'Preferred Area / City', type: 'text', required: true },
    { name: 'nearTo', label: 'Near To (College / Office Name)', type: 'text', required: true },
    { name: 'occupancy', label: 'Occupancy', type: 'select', required: true, options: ['Single', 'Double Sharing', 'Triple Sharing', 'Any'] },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: ['Male', 'Female', 'Any'] },
    { name: 'budget', label: 'Monthly Budget (₹)', type: 'number', required: true },
    { name: 'moveInDate', label: 'Expected Move-in Date', type: 'date', required: true },
    { name: 'requirements', label: 'Additional Requirements (food, AC, WiFi etc.)', type: 'textarea', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'birthday-party-planning': [
    { name: 'name', label: 'Your Name', type: 'text', required: true },
    { name: 'birthdayPersonName', label: 'Birthday Person\'s Name', type: 'text', required: true },
    { name: 'age', label: 'Turning Age', type: 'number', required: true },
    { name: 'eventDate', label: 'Party Date', type: 'date', required: true },
    { name: 'guestCount', label: 'Number of Guests', type: 'number', required: true },
    { name: 'venue', label: 'Venue (Home / Hall / Restaurant)', type: 'text', required: true },
    { name: 'theme', label: 'Preferred Theme (e.g. Superhero, Floral, Royal)', type: 'text', required: false },
    { name: 'services', label: 'Services Needed', type: 'select', required: true, options: ['Full Package (Decoration + Cake + Photo)', 'Decoration Only', 'Cake + Decoration', 'Photography Only', 'Custom'] },
    { name: 'budget', label: 'Approximate Budget (₹)', type: 'number', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'visa-assistance': [
    { name: 'name', label: 'Full Name (as on Passport)', type: 'text', required: true },
    { name: 'passportNumber', label: 'Passport Number', type: 'text', required: true },
    { name: 'passportExpiry', label: 'Passport Expiry Date', type: 'date', required: true },
    { name: 'destinationCountry', label: 'Destination Country', type: 'text', required: true },
    { name: 'visaType', label: 'Visa Type', type: 'select', required: true, options: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa', 'Medical Visa'] },
    { name: 'travelDate', label: 'Expected Travel Date', type: 'date', required: true },
    { name: 'duration', label: 'Duration of Stay', type: 'text', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'resume-building': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'currentRole', label: 'Current Role / Student', type: 'text', required: true },
    { name: 'experience', label: 'Years of Experience', type: 'select', required: true, options: ['Fresher (0 years)', '1-2 years', '3-5 years', '5+ years'] },
    { name: 'targetRole', label: 'Target Job Role', type: 'text', required: true },
    { name: 'skills', label: 'Key Skills', type: 'textarea', required: true },
    { name: 'linkedinUrl', label: 'LinkedIn Profile URL (if any)', type: 'text', required: false },
    { name: 'resumeType', label: 'Resume Type', type: 'select', required: true, options: ['Fresher Resume', 'Experienced Resume', 'Tech Resume', 'Creative Resume', 'ATS Friendly Resume'] },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'flight-booking': [
    { name: 'passengerName', label: 'Passenger Full Name', type: 'text', required: true },
    { name: 'fromCity', label: 'From City / Airport', type: 'text', required: true },
    { name: 'toCity', label: 'To City / Airport', type: 'text', required: true },
    { name: 'travelDate', label: 'Travel Date', type: 'date', required: true },
    { name: 'returnDate', label: 'Return Date (if round trip)', type: 'date', required: false },
    { name: 'tripType', label: 'Trip Type', type: 'select', required: true, options: ['One Way', 'Round Trip'] },
    { name: 'classType', label: 'Class', type: 'select', required: true, options: ['Economy', 'Business', 'First Class'] },
    { name: 'adults', label: 'Number of Adults', type: 'number', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'govt-scheme-assistance': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'aadhaarNumber', label: 'Aadhaar Number', type: 'text', required: true },
    { name: 'schemeType', label: 'Scheme / Service Required', type: 'select', required: true, options: ['PM Kisan', 'Ayushman Bharat', 'Scholarship Application', 'Ration Card', 'Income Certificate', 'Caste Certificate', 'Domicile Certificate', 'Birth Certificate', 'Death Certificate', 'Other'] },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'details', label: 'Additional Details', type: 'textarea', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
};

// Default form for any service not in the list above
const DEFAULT_FORM = [
  { name: 'name', label: 'Your Full Name', type: 'text', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'details', label: 'Describe your requirement in detail', type: 'textarea', required: true },
];

function BookingForm({ fields, onSubmit, loading, price }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.name, ''])));

  const handleChange = (name, value) => setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-xs text-gray-400 mb-1">{field.label}{field.required && <span className="text-red-400 ml-1">*</span>}</label>
          {field.type === 'select' ? (
            <select required={field.required} value={form[field.name]} onChange={e => handleChange(field.name, e.target.value)} className={inputClass + ' bg-[#0a0a0f]'}>
              <option value="">Select...</option>
              {field.options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea required={field.required} rows={3} placeholder={field.label} value={form[field.name]} onChange={e => handleChange(field.name, e.target.value)} className={inputClass + ' resize-none'} />
          ) : (
            <input type={field.type} required={field.required} placeholder={field.label} value={form[field.name]} onChange={e => handleChange(field.name, e.target.value)} className={inputClass} />
          )}
        </div>
      ))}
      <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
        {loading ? 'Processing...' : price > 0 ? `Book & Pay ₹${price}` : 'Book Now (Free)'}
      </button>
    </form>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    API.get(`/services/${slug}`).then(res => { setService(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const handleBook = async (formData) => {
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    try {
      const { data } = await API.post('/bookings', {
        serviceId: service._id,
        details: formData,
        amount: service.price
      });
      if (service.price > 0) {
        await API.post('/payment/create-order', { amount: service.price, bookingId: data.bookingId });
        await API.post('/payment/verify', { bookingId: data._id });
        toast.success('🎉 Booking confirmed & payment done!');
      } else {
        toast.success(`✅ Booking confirmed! ID: ${data.bookingId}`);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="pt-24 text-center py-20 text-gray-400">Loading...</div>;
  if (!service) return <div className="pt-24 text-center py-20 text-gray-400">Service not found</div>;

  const formFields = SERVICE_FORMS[slug] || DEFAULT_FORM;

  return (
    <>
      <Helmet>
        <title>{service.title} - Your Helper</title>
        <meta name="description" content={service.shortDesc} />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom max-w-6xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Services
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="text-6xl mb-4">{service.icon}</div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">
                {service.category}
              </span>
              <h1 className="text-4xl font-black mt-4 mb-4">{service.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>

              {service.features?.length > 0 && (
                <div className="glass rounded-2xl p-6 mb-6">
                  <h3 className="font-bold mb-4">✅ What's Included</h3>
                  <ul className="space-y-3">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass rounded-2xl p-5">
                <p className="text-gray-400 text-xs mb-1">{service.priceLabel || 'Price'}</p>
                <p className="text-3xl font-black gradient-text">{service.price > 0 ? `₹${service.price}` : 'FREE'}</p>
                <p className="text-xs text-gray-500 mt-2">🔒 100% secure • Instant confirmation • 24/7 support</p>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-2">Book This Service</h2>
                <p className="text-gray-400 text-sm mb-6">Fill in the details below and we'll get back to you within 2 hours.</p>
                {user ? (
                  <BookingForm fields={formFields} onSubmit={handleBook} loading={booking} price={service.price} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-5xl mb-4">🔐</p>
                    <p className="text-gray-400 mb-6">Please login to book this service</p>
                    <button onClick={() => navigate('/login')} className="btn-primary w-full">Login to Book</button>
                    <p className="text-gray-500 text-xs mt-3">Don't have an account? <a href="/register" className="text-purple-400">Register free</a></p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
