require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');

const services = [
  {
    title: 'College Documentation Help', slug: 'college-documentation', category: 'college',
    description: 'We help college students with all kinds of documentation — bonafide certificates, NOC letters, migration certificates, scholarship forms, and more.',
    shortDesc: 'Bonafide, NOC, migration certificates & scholarship forms handled for you.',
    icon: '🎓', price: 299, priceLabel: 'Starting from', isFeatured: true,
    features: ['Bonafide Certificate', 'NOC Letter', 'Migration Certificate', 'Scholarship Form Filling', 'Same Day Processing'],
    tags: ['college', 'documents', 'certificate', 'bonafide']
  },
  {
    title: 'Tatkal Train Ticket Booking', slug: 'tatkal-train-booking', category: 'travel',
    description: 'Struggling to get tatkal train tickets? We book them for you the moment the window opens using our fast systems.',
    shortDesc: 'Fast tatkal ticket booking — we handle it the moment the window opens.',
    icon: '🚂', price: 149, priceLabel: 'Per ticket', isFeatured: true,
    features: ['Tatkal & Premium Tatkal', 'AC & Sleeper Classes', 'Booking Confirmation in Minutes', 'All Indian Railways Routes'],
    tags: ['train', 'tatkal', 'irctc', 'ticket', 'travel']
  },
  {
    title: 'Office Event Management', slug: 'office-event-management', category: 'office',
    description: 'From team lunches to annual day celebrations, we plan and manage office events end-to-end.',
    shortDesc: 'End-to-end office event planning — venue, catering, decoration & more.',
    icon: '🏢', price: 1999, priceLabel: 'Starting from', isFeatured: false,
    features: ['Venue Booking', 'Catering Arrangements', 'Decoration & Setup', 'Guest Coordination', 'Photography'],
    tags: ['office', 'event', 'corporate', 'party']
  },
  {
    title: 'Internship Placement Assistance', slug: 'internship-placement', category: 'internship',
    description: 'We connect students with verified internship opportunities across top companies.',
    shortDesc: 'Get placed in top internships — resume help, applications & interview prep.',
    icon: '💼', price: 499, priceLabel: 'One time fee', isFeatured: true,
    features: ['Resume Building', 'Company Matching', 'Application Submission', 'Interview Preparation', 'Offer Letter Assistance'],
    tags: ['internship', 'job', 'placement', 'resume', 'career']
  },
  {
    title: 'PG & Accommodation Finder', slug: 'accommodation-finder', category: 'accommodation',
    description: 'Looking for a PG, hostel, or flat near your college or office? We find verified, affordable options.',
    shortDesc: 'Find verified PG, hostel or flat near your college or office hassle-free.',
    icon: '🏠', price: 0, priceLabel: 'Free consultation', isFeatured: false,
    features: ['Verified Listings Only', 'Near College/Office', 'Budget Friendly Options', 'Virtual Tours', 'Move-in Assistance'],
    tags: ['pg', 'hostel', 'flat', 'accommodation', 'rent']
  },
  {
    title: 'Birthday & Party Planning', slug: 'birthday-party-planning', category: 'event',
    description: 'Make your special day unforgettable! We plan birthdays, anniversaries, and surprise parties.',
    shortDesc: 'Birthdays, anniversaries & surprise parties — decoration, cake & more.',
    icon: '🎉', price: 999, priceLabel: 'Starting from', isFeatured: false,
    features: ['Theme Decoration', 'Cake Arrangement', 'Photography & Reels', 'Return Gifts', 'Surprise Planning'],
    tags: ['birthday', 'party', 'event', 'celebration', 'decoration']
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  // Seed services
  const existingServices = await Service.countDocuments();
  if (existingServices === 0) {
    await Service.insertMany(services);
    console.log('✅ 6 Services seeded');
  } else {
    console.log('⏭️  Services already exist, skipping');
  }

  // Seed admin
  const existingAdmin = await User.findOne({ email: 'admin@yourhelper.com' });
  if (!existingAdmin) {
    await User.create({ name: 'Admin', email: 'admin@yourhelper.com', phone: '9999999999', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created — email: admin@yourhelper.com | password: admin123');
  } else {
    console.log('⏭️  Admin already exists, skipping');
  }

  mongoose.disconnect();
  console.log('✅ Seed complete!');
}

seed().catch(err => { console.error(err); process.exit(1); });
