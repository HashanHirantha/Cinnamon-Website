import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqData = [
    {
        category: 'Products',
        questions: [
            { q: 'What is the difference between Ceylon cinnamon and regular cinnamon?', a: 'Ceylon cinnamon (Cinnamomum verum) is the "true" cinnamon native to Sri Lanka. It has a delicate, sweet flavour and contains only trace amounts of coumarin (a compound that can be harmful in large doses). Regular cinnamon sold in most stores is actually Cassia cinnamon, which has a stronger, more pungent taste and significantly higher coumarin levels.' },
            { q: 'Are your products organic?', a: 'We offer both conventional and certified organic options. Products labelled as "Organic" on our shop have been grown without synthetic pesticides or fertilisers and carry organic certification. All of our products are 100% natural with no additives or preservatives.' },
            { q: 'How should I store my cinnamon?', a: 'Store in a cool, dry place away from direct sunlight. An airtight container is ideal. Whole cinnamon quills can stay fresh for up to 2 years; ground cinnamon is best used within 6–12 months for optimal flavour and potency.' },
            { q: 'What is the shelf life of your products?', a: 'Cinnamon quills: 18–24 months. Cinnamon powder: 12–18 months. Cinnamon tea: 18 months. Essential oils: 24+ months. All products display a "Best Before" date on the packaging.' },
        ],
    },
    {
        category: 'Orders & Shipping',
        questions: [
            { q: 'How long does shipping take?', a: 'Domestic (Sri Lanka): 2–4 business days. International: 7–14 business days depending on your location. Orders are processed within 1–2 business days.' },
            { q: 'Do you ship internationally?', a: 'Yes! We ship to over 14 countries including the US, UK, EU, Middle East, Australia, and across Asia. Visit our Shipping page for full details and rates.' },
            { q: 'How can I track my order?', a: 'Once your order ships, you will receive an email with a tracking number and a link to track your package in real-time.' },
            { q: 'Is there free shipping?', a: 'Yes — free shipping is available on all orders over $50 (international) or over LKR 5,000 (domestic Sri Lanka).' },
        ],
    },
    {
        category: 'Returns & Payments',
        questions: [
            { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unopened, sealed products in their original packaging. Damaged or incorrect items are eligible for a full refund with photo evidence. See our Returns page for full details.' },
            { q: 'What payment methods do you accept?', a: 'We accept major credit/debit cards (Visa, Mastercard, AMEX), PayHere (for local payments in LKR), and bank transfers. More payment options will be available soon.' },
            { q: 'Are prices in USD or LKR?', a: 'Prices on our website are displayed in USD by default. Local Sri Lankan customers can pay in LKR via PayHere at checkout.' },
        ],
    },
    {
        category: 'Wholesale & Business',
        questions: [
            { q: 'Do you offer wholesale pricing?', a: 'Yes! We offer competitive wholesale rates for bulk orders. Contact us at wholesale@ceylone.com or via our Contact page with your requirements.' },
            { q: 'Can I become a distributor?', a: "We are always looking for distribution partners worldwide. Please reach out via our Contact page with your business details and we'll discuss partnership opportunities." },
        ],
    },
];

const FAQItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-cream-200 last:border-0">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 px-1 text-left group">
                <span className="text-sm font-medium text-gray-800 group-hover:text-cinnamon-700 transition-colors pr-4">{question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <p className="text-sm text-gray-600 leading-relaxed pb-5 px-1">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const [search, setSearch] = useState('');

    const filteredData = faqData.map((cat) => ({
        ...cat,
        questions: cat.questions.filter(
            (q) => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((cat) => cat.questions.length > 0);

    return (
        <div className="min-h-screen bg-cream-50 pt-20">
            <div className="bg-cinnamon-900 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-cinnamon-400 text-sm font-medium uppercase tracking-widest mb-2">Help Centre</p>
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-6">Frequently Asked Questions</h1>
                    <div className="max-w-md mx-auto flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 gap-3">
                        <Search className="w-4 h-4 text-cream-200/60" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions..."
                            className="flex-1 bg-transparent text-sm text-white placeholder-cream-200/50 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
                {filteredData.length === 0 && (
                    <p className="text-center text-gray-500 py-12">No questions match your search. Try different keywords.</p>
                )}
                {filteredData.map((cat) => (
                    <motion.div key={cat.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
                        <h2 className="font-serif text-xl font-bold text-cinnamon-900 mb-4">{cat.category}</h2>
                        {cat.questions.map((q) => (
                            <FAQItem key={q.q} question={q.q} answer={q.a} />
                        ))}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
