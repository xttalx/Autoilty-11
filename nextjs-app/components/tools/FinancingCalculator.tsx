'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiPercent, FiCalendar } from 'react-icons/fi';

export default function FinancingCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculatePayment();
  }, [vehiclePrice, downPayment, interestRate, loanTerm]);

  const calculatePayment = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    if (principal <= 0 || monthlyRate <= 0 || numPayments <= 0) {
      setMonthlyPayment(0);
      setTotalInterest(0);
      setTotalAmount(0);
      return;
    }

    // Calculate monthly payment using standard loan formula
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = payment * numPayments;
    const interest = totalPaid - principal;

    setMonthlyPayment(payment);
    setTotalInterest(interest);
    setTotalAmount(totalPaid);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Details</h2>

          {/* Vehicle Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiDollarSign className="mr-2" />
              Vehicle Price
            </label>
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              step="100"
            />
          </div>

          {/* Down Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiDollarSign className="mr-2" />
              Down Payment
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              step="100"
              max={vehiclePrice}
            />
            <div className="mt-2 text-sm text-gray-500">
              {((downPayment / vehiclePrice) * 100).toFixed(1)}% of vehicle price
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiPercent className="mr-2" />
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              max="30"
              step="0.1"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FiCalendar className="mr-2" />
              Loan Term (months)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="36">36 months (3 years)</option>
              <option value="48">48 months (4 years)</option>
              <option value="60">60 months (5 years)</option>
              <option value="72">72 months (6 years)</option>
              <option value="84">84 months (7 years)</option>
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>

          <div className="space-y-6">
            {/* Monthly Payment */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
              <div className="text-4xl font-bold text-primary-600">
                ${monthlyPayment.toFixed(2)}
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-1">Total Amount Paid</div>
              <div className="text-3xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Total Interest */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-1">Total Interest</div>
              <div className="text-3xl font-bold text-red-600">
                ${totalInterest.toFixed(2)}
              </div>
            </div>

            {/* Loan Amount */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-sm text-gray-600 mb-1">Loan Amount</div>
              <div className="text-2xl font-bold text-gray-700">
                ${(vehiclePrice - downPayment).toLocaleString('en-CA', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
