import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowLeft, Phone, MessageCircle, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PROMOS = [
  { code: 'DIWALI30', discount: '30% OFF', desc: 'On bookings above ₹499' },
  { code: 'WELCOME10', discount: '10% OFF', desc: 'For new users' },
  { code: 'STUDENT20', discount: '20% OFF', desc: 'On all college services' },
];

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
  'trip-planning': [
    { name: 'name', label: 'Your Full Name', type: 'text', required: true },
    { name: 'fromCity', label: 'From City', type: 'text', required: true },
    { name: 'toCity', label: 'Destination', type: 'text', required: true },
    { name: 'travelDate', label: 'Travel Date', type: 'date', required: true },
    { name: 'returnDate', label: 'Return Date', type: 'date', required: false },
    { name: 'groupSize', label: 'Number of People', type: 'number', required: true },
    { name: 'tripType', label: 'Trip Type', type: 'select', required: true, options: ['Leisure', 'College Trip', 'Family', 'Honeymoon', 'Corporate', 'Pilgrimage', 'Adventure'] },
    { name: 'budget', label: 'Budget per person (₹)', type: 'number', required: false },
    { name: 'requirements', label: 'Special Requirements', type: 'textarea', required: false },
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
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'accommodation-finder': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'accommodationType', label: 'Accommodation Type', type: 'select', required: true, options: ['PG (Paying Guest)', 'Hostel', 'Flat / Apartment', 'Room', 'Any'] },
    { name: 'preferredLocation', label: 'Preferred Area / City', type: 'text', required: true },
    { name: 'nearTo', label: 'Near To (College / Office Name)', type: 'text', required: true },
    { name: 'budget', label: 'Monthly Budget (₹)', type: 'number', required: true },
    { name: 'moveInDate', label: 'Expected Move-in Date', type: 'date', required: true },
    { name: 'requirements', label: 'Additional Requirements', type: 'textarea', required: false },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'birthday-party-planning': [
    { name: 'name', label: 'Your Name', type: 'text', required: true },
    { name: 'birthdayPersonName', label: "Birthday Person's Name", type: 'text', required: true },
    { name: 'eventDate', label: 'Party Date', type: 'date', required: true },
    { name: 'guestCount', label: 'Number of Guests', type: 'number', required: true },
    { name: 'venue', label: 'Venue (Home / Hall / Restaurant)', type: 'text', required: true },
    { name: 'theme', label: 'Preferred Theme', type: 'text', required: false },
    { name: 'budget', label: 'Approximate Budget (₹)', type: 'number', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'visa-assistance': [
    { name: 'name', label: 'Full Name (as on Passport)', type: 'text', required: true },
    { name: 'passportNumber', label: 'Passport Number', type: 'text', required: true },
    { name: 'destinationCountry', label: 'Destination Country', type: 'text', required: true },
    { name: 'visaType', label: 'Visa Type', type: 'select', required: true, options: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa', 'Medical Visa'] },
    { name: 'travelDate', label: 'Expected Travel Date', type: 'date', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ],
  'resume-building': [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'currentRole', label: 'Current Role / Student', type: 'text', required: true },
    { name: 'experience', label: 'Years of Experience', type: 'select', required: true, options: ['Fresher (0 years)', '1-2 years', '3-5 years', '5+ years'] },
    { name: 'targetRole', label: 'Target Job Role', type: 'text', required: true },
    { name: 'skills', label: 'Key Skills', type: 'textarea', required: true },
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

const DEFAULT_FORM = [
  { name: 'name', label: 'Your Full Name', type: 'text', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
  { name: 'details', label: 'Describe your requirement in detail', type: 'textarea', required: true },
];

const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

function BookingForm({ fields, onSubmit, loading, price, serviceName }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.name, ''])));
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const applyPromo = () => {
    const found = PROMOS.find(p => p.code === promoCode.toUpperCase());
    if (found) { setAppliedPromo(found); toast.success(`Promo applied: ${found.discount}`); }
    else toast.error('Invalid promo code');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, promoCode: appliedPromo?.code || '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-xs text-gray-400 mb-1">
            {field.label}{field.required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {field.type === 'select' ? (
            <select required={field.required} value={form[field.name]}
              onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
              className={ic + ' bg-[#0a0a0f]'}>
              <option value="">Select...</option>
              {field.options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea required={field.required} rows={3} placeholder={field.label}
              value={form[field.name]} onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
              className={ic + ' resize-none'} />
          ) : (
            <input type={field.type} required={field.required} placeholder={field.label}
              value={form[field.name]} onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
              className={ic} />
          )}
        </div>
      ))}

      {/* Promo Code */}
      <div className="glass rounded-xl p-4">
        <label className="block text-xs text-gray-400 mb-2 flex items-center gap-1"><Tag size={12} /> Have a promo code?</label>
        {appliedPromo ? (
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
            <span className="text-green-400 text-sm font-bold">{appliedPromo.code} — {appliedPromo.discount}</span>
            <button type="button" onClick={() => setAppliedPromo(null)} className="text-gray-400 text-xs hover:text-white">Remove</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="text" placeholder="Enter promo code" value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-xs uppercase" />
            <button type="button" onClick={applyPromo}
              className="glass px-4 py-2 rounded-lg text-xs text-purple-300 hover:bg-purple-600/20 transition-all">Apply</button>
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
        <MessageCircle size={16} />
        {loading ? 'Submitting...' : 'Submit Request via WhatsApp'}
      </button>
      <p className="text-center text-xs text-gray-500">We'll contact you on WhatsApp within 30 minutes</p>
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
      // Build WhatsApp message from form data
      const details = Object.entries(formData)
        .filter(([k, v]) => v && k !== 'promoCode')
        .map(([k, v]) => `*${k.replace(/([A-Z])/g, ' $1').trim()}*: ${v}`)
        .join('\n');

      const promoText = formData.promoCode ? `\n*Promo Code*: ${formData.promoCode}` : '';
      const message = encodeURIComponent(
        `Hi! I want to book *${service.title}*\n\n${details}${promoText}\n\n*Price*: ₹${service.price > 0 ? service.price : 'Free'}`
      );

      // Also save booking in DB
      await API.post('/bookings', {
        serviceId: service._id,
        details: formData,
        amount: service.price
      });

      // Redirect to WhatsApp
      window.open(`https://wa.me/917050813928?text=${message}`, '_blank');
      toast.success('Redirecting to WhatsApp! We\'ll confirm your booking shortly.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
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

      <div className="pt-24 pb-16">
        <div className="container-custom max-w-5xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={15} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left — Service Info (2/5) */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
              <div className="text-5xl mb-4">{service.icon}</div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">{service.category}</span>
              <h1 className="text-3xl font-black mt-3 mb-3">{service.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{service.description}</p>

              {service.features?.length > 0 && (
                <div className="glass rounded-2xl p-5 mb-5">
                  <h3 className="font-bold mb-3 text-sm">What's Included</h3>
                  <ul className="space-y-2">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle size={14} className="text-green-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass rounded-2xl p-4 mb-4">
                <p className="text-gray-400 text-xs mb-1">{service.priceLabel || 'Price'}</p>
                <p className="text-3xl font-black gradient-text">{service.price > 0 ? `₹${service.price}` : 'FREE'}</p>
              </div>

              {/* Direct WhatsApp */}
              <a href={`https://wa.me/917050813928?text=Hi! I want to know more about ${service.title}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 glass px-4 py-3 rounded-xl text-sm text-green-400 hover:bg-green-500/10 transition-all">
                <Phone size={16} /> Chat directly on WhatsApp
              </a>
            </motion.div>

            {/* Right — Booking Form (3/5) */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-1">Book This Service</h2>
                <p className="text-gray-400 text-xs mb-5">Fill the form — we'll contact you on WhatsApp within 30 mins</p>
                {user ? (
                  <BookingForm fields={formFields} onSubmit={handleBook} loading={booking} price={service.price} serviceName={service.title} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">🔐</p>
                    <p className="text-gray-400 mb-4 text-sm">Login to book this service</p>
                    <button onClick={() => navigate('/login')} className="btn-primary w-full mb-3">Login to Book</button>
                    <p className="text-gray-500 text-xs">New user? <Link to="/register" className="text-purple-400">Register free</Link></p>
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
