import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ service }) {
  return (
    <div className="glass rounded-2xl p-6 card-hover group cursor-pointer">
      <div className="text-4xl mb-4">{service.icon}</div>
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">
        {service.category}
      </span>
      <h3 className="text-lg font-bold mt-3 mb-2 text-white">{service.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.shortDesc}</p>
      {service.price > 0 && (
        <p className="text-purple-400 font-semibold text-sm mb-4">
          {service.priceLabel} ₹{service.price}
        </p>
      )}
      <Link
        to={`/services/${service.slug}`}
        className="flex items-center gap-2 text-purple-400 text-sm font-medium group-hover:gap-3 transition-all"
      >
        Know More <ArrowRight size={14} />
      </Link>
    </div>
  );
}
