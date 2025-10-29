import { Metadata } from 'next';
import FinancingCalculator from '@/components/tools/FinancingCalculator';
import { generateSEOMetadata, generateFAQSchema } from '@/lib/seo';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Vehicle Financing Calculator - Calculate Your Car Loan | Autoilty.com',
  description: 'Calculate your monthly car payment, total interest, and loan terms with our free vehicle financing calculator. Best rates in Canada.',
  keywords: [
    'car loan calculator',
    'vehicle financing calculator',
    'auto loan calculator Canada',
    'car payment calculator',
    'financing calculator',
  ],
  url: '/tools/financing',
});

const faqs = [
  {
    question: 'How does the financing calculator work?',
    answer: 'Our calculator uses your vehicle price, down payment, interest rate, and loan term to calculate your monthly payment and total interest paid over the life of the loan.',
  },
  {
    question: 'What interest rates should I use?',
    answer: 'Interest rates vary by lender and your credit score. New car loans typically range from 3-7% APR, while used car loans are usually 5-10% APR in Canada.',
  },
  {
    question: 'Can I calculate financing for different loan terms?',
    answer: 'Yes, you can adjust the loan term (typically 36, 48, 60, or 72 months) to see how it affects your monthly payment and total interest.',
  },
];

export default function FinancingCalculatorPage() {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Vehicle Financing Calculator
            </h1>
            <p className="text-xl text-gray-600">
              Calculate your monthly payment and total interest for any vehicle loan
            </p>
          </div>

          <FinancingCalculator />

          {/* FAQ Section */}
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
