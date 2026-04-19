require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');
const Product = require('./models/Product');

const services = [
  // COLLEGE HUB (all college sub-services now under college category)
  {
    title: 'College Student Services', slug: 'college-student-services', category: 'college',
    description: 'Your complete college support hub — documents, resume, internship guidance, products and student query forum all in one place.',
    shortDesc: 'Complete college support — docs, resume, internship, products & student forum.',
    icon: '🎓', price: 0, priceLabel: 'Free to explore', isFeatured: true,
    features: ['Document Help', 'Resume Building', 'Internship Guidance', 'College Products Shop', 'Student Query Forum'],
    tags: ['college', 'student', 'documents', 'resume', 'internship', 'forum']
  },
  {
    title: 'College Documentation Help', slug: 'college-documentation', category: 'college',
    description: 'We help college students with all kinds of documentation — bonafide certificates, NOC letters, migration certificates, scholarship forms, and more.',
    shortDesc: 'Bonafide, NOC, migration certificates & scholarship forms handled for you.',
    icon: '📋', price: 299, priceLabel: 'Starting from', isFeatured: false,
    features: ['Bonafide Certificate', 'NOC Letter', 'Migration Certificate', 'Scholarship Form Filling', 'Character Certificate', 'Same Day Processing'],
    tags: ['college', 'documents', 'certificate', 'bonafide', 'noc']
  },
  {
    title: 'Resume Building', slug: 'resume-building', category: 'college',
    description: 'Get a professional, ATS-friendly resume built by experts. Whether you are a fresher or experienced professional, we craft resumes that get you shortlisted.',
    shortDesc: 'Professional ATS-friendly resume crafted by experts to get you shortlisted.',
    icon: '📄', price: 199, priceLabel: 'One time', isFeatured: false,
    features: ['ATS Optimized Resume', 'Professional Design', 'LinkedIn Profile Tips', 'Cover Letter', 'Unlimited Revisions', 'Delivered in 24 hours'],
    tags: ['resume', 'cv', 'job', 'fresher', 'career']
  },
  {
    title: 'Internship Placement Assistance', slug: 'internship-placement', category: 'college',
    description: 'We connect students with verified internship opportunities across top companies. Resume building, application tracking, and interview prep included.',
    shortDesc: 'Get placed in top internships — resume help, applications & interview prep.',
    icon: '💼', price: 499, priceLabel: 'One time fee', isFeatured: true,
    features: ['Resume Building', 'Company Matching', 'Application Submission', 'Interview Preparation', 'Offer Letter Assistance', 'Post Joining Support'],
    tags: ['internship', 'job', 'placement', 'resume', 'career']
  },
  {
    title: 'Government Scheme Assistance', slug: 'govt-scheme-assistance', category: 'college',
    description: 'Get help applying for government schemes, certificates and documents like income certificate, caste certificate, domicile, ration card, Ayushman Bharat, PM Kisan and more.',
    shortDesc: 'Apply for govt schemes, certificates & documents — income, caste, domicile & more.',
    icon: '🏛️', price: 149, priceLabel: 'Per document', isFeatured: false,
    features: ['Income Certificate', 'Caste Certificate', 'Domicile Certificate', 'Ration Card', 'Ayushman Bharat', 'PM Kisan Registration', 'Birth / Death Certificate'],
    tags: ['government', 'certificate', 'scheme', 'aadhaar', 'income', 'caste']
  },
  // TRAVEL
  {
    title: 'Tatkal Train Ticket Booking', slug: 'tatkal-train-booking', category: 'travel',
    description: 'Struggling to get tatkal train tickets? We book them for you the moment the window opens using our fast systems.',
    shortDesc: 'Fast tatkal ticket booking — we handle it the moment the window opens.',
    icon: '🚂', price: 149, priceLabel: 'Per ticket', isFeatured: true,
    features: ['Tatkal & Premium Tatkal', 'AC & Sleeper Classes', 'Booking Confirmation in Minutes', 'All Indian Railways Routes', 'SMS & Email Confirmation'],
    tags: ['train', 'tatkal', 'irctc', 'ticket', 'travel']
  },
  {
    title: 'Flight Ticket Booking', slug: 'flight-booking', category: 'travel',
    description: 'We find the best flight deals and book tickets for you across all major airlines. Domestic and international flights, one-way or round trip.',
    shortDesc: 'Best flight deals booked for you — domestic & international, all airlines.',
    icon: '✈️', price: 199, priceLabel: 'Per booking', isFeatured: false,
    features: ['All Major Airlines', 'Domestic & International', 'Best Price Guarantee', 'Round Trip & One Way', 'Instant E-Ticket', 'Cancellation Assistance'],
    tags: ['flight', 'airline', 'ticket', 'travel', 'international']
  },
  {
    title: 'Trip Planning & Group Tours', slug: 'trip-planning', category: 'travel',
    description: 'Planning a trip with friends, family or college group? We handle everything — destination selection, hotel booking, transport, itinerary planning and on-trip support. From hill stations to beaches, pilgrimages to adventure trips.',
    shortDesc: 'Complete trip planning — destination, hotels, transport & itinerary for groups.',
    icon: '🗺️', price: 499, priceLabel: 'Starting from', isFeatured: true,
    features: ['Destination Planning', 'Hotel & Resort Booking', 'Bus / Train / Flight Booking', 'Day-wise Itinerary', 'Group Discounts', 'On-Trip Support', 'Budget & Premium Packages'],
    tags: ['trip', 'tour', 'travel', 'group', 'holiday', 'college trip', 'family trip']
  },
  {
    title: 'Visa Assistance', slug: 'visa-assistance', category: 'travel',
    description: 'Planning to travel abroad? We help you with the complete visa application process — document checklist, form filling, appointment booking and tracking.',
    shortDesc: 'Complete visa application help — documents, form filling & appointment booking.',
    icon: '🛂', price: 999, priceLabel: 'Starting from', isFeatured: false,
    features: ['Document Checklist', 'Form Filling Assistance', 'Appointment Booking', 'Application Tracking', 'Tourist / Student / Work Visa', 'All Countries'],
    tags: ['visa', 'passport', 'travel', 'abroad', 'international']
  },
  // OFFICE
  {
    title: 'Office Event Management', slug: 'office-event-management', category: 'office',
    description: 'From team lunches to annual day celebrations, we plan and manage office events end-to-end.',
    shortDesc: 'End-to-end office event planning — venue, catering, decoration & more.',
    icon: '🏢', price: 1999, priceLabel: 'Starting from', isFeatured: false,
    features: ['Venue Booking', 'Catering Arrangements', 'Decoration & Setup', 'Guest Coordination', 'Photography & Videography', 'Post Event Cleanup'],
    tags: ['office', 'event', 'corporate', 'party', 'team']
  },
  // EVENTS
  {
    title: 'Birthday & Party Planning', slug: 'birthday-party-planning', category: 'event',
    description: 'Make your special day unforgettable! We plan birthdays, anniversaries, and surprise parties.',
    shortDesc: 'Birthdays, anniversaries & surprise parties — decoration, cake & more.',
    icon: '🎉', price: 999, priceLabel: 'Starting from', isFeatured: false,
    features: ['Theme Decoration', 'Cake Arrangement', 'Photography & Reels', 'Return Gifts', 'Surprise Planning', 'Entertainment'],
    tags: ['birthday', 'party', 'event', 'celebration', 'decoration']
  },
  // ACCOMMODATION
  {
    title: 'PG & Accommodation Finder', slug: 'accommodation-finder', category: 'accommodation',
    description: 'Looking for a PG, hostel, or flat near your college or office? We find verified, affordable options.',
    shortDesc: 'Find verified PG, hostel or flat near your college or office hassle-free.',
    icon: '🏠', price: 0, priceLabel: 'Free consultation', isFeatured: false,
    features: ['Verified Listings Only', 'Near College/Office', 'Budget Friendly Options', 'Virtual Tours', 'Move-in Assistance', 'No Brokerage'],
    tags: ['pg', 'hostel', 'flat', 'accommodation', 'rent']
  },
];

const products = [
  { name: 'A4 Notebook (200 Pages)', description: 'Premium quality ruled notebook for college students.', category: 'stationery', price: 49, originalPrice: 70, icon: '📓', isFeatured: true, tags: ['notebook', 'stationery'] },
  { name: 'Geometry Box Set', description: 'Complete geometry box with compass, protractor, ruler and more.', category: 'stationery', price: 89, originalPrice: 120, icon: '📐', isFeatured: false, tags: ['geometry', 'stationery', 'maths'] },
  { name: 'Ball Pen Pack (10 pcs)', description: 'Smooth writing blue ball pens, pack of 10.', category: 'stationery', price: 39, originalPrice: 60, icon: '🖊️', isFeatured: false, tags: ['pen', 'stationery'] },
  { name: 'College Uniform Shirt', description: 'Standard white formal shirt for college uniform.', category: 'uniform', price: 299, originalPrice: 450, icon: '👔', isFeatured: true, tags: ['uniform', 'shirt', 'college'] },
  { name: 'College ID Card Holder', description: 'Durable ID card holder with neck strap.', category: 'accessories', price: 29, originalPrice: 50, icon: '🪪', isFeatured: false, tags: ['id card', 'accessories'] },
  { name: 'Scientific Calculator', description: 'Casio FX-991 type scientific calculator for engineering students.', category: 'electronics', price: 799, originalPrice: 1200, icon: '🔢', isFeatured: true, tags: ['calculator', 'electronics', 'engineering'] },
  { name: 'Engineering Drawing Book', description: 'A3 size drawing book for engineering students, 20 sheets.', category: 'books', price: 79, originalPrice: 110, icon: '📏', isFeatured: false, tags: ['drawing', 'engineering', 'books'] },
  { name: 'Backpack (College Bag)', description: 'Spacious 30L waterproof college backpack with laptop compartment.', category: 'accessories', price: 599, originalPrice: 999, icon: '🎒', isFeatured: true, tags: ['bag', 'backpack', 'accessories'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  await Service.deleteMany({});
  await Service.insertMany(services);
  console.log(`✅ ${services.length} Services seeded`);

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} Products seeded`);

  const existingAdmin = await User.findOne({ email: 'admin@yourhelper.com' });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', email: 'admin@yourhelper.com', phone: '9999999999', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created');
  } else {
    console.log('⏭️  Admin already exists');
  }

  mongoose.disconnect();
  console.log('✅ Seed complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
