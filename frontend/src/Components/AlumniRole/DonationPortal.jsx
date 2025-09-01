import React, { useState } from "react";
import {
  FaHandHoldingHeart,
  FaHistory,
  FaGift,
  FaRegCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import AlumniNavbar from "../AlumniNavbar";

const DonationPortal = () => {
  const [donations] = useState([
    { donor: "John D.", amount: 500, date: "2024-02-15", fund: "Scholarship" },
    { donor: "Sarah M.", amount: 1000, date: "2024-02-14", fund: "Research" },
  ]);
  const [amount, setAmount] = useState("");
  const [fund, setFund] = useState("Scholarship Fund");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      alert("Please enter a donation amount.");
      return;
    }
    alert(`Thank you for your donation of ₹${amount} to the ${fund}!`);
    setAmount("");
    setFund("Scholarship Fund");
  };

  return (
    <>
      <AlumniNavbar />
      {/* Hero Section with Layered Gradients */}
      <div className="relative min-h-screen pb-24 bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 overflow-x-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl top-[-8rem] left-[-10rem] animate-pulse" />
          <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-500/10 rounded-full blur-3xl bottom-[-8rem] right-[-10rem] animate-pulse" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto pt-32 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-full shadow-lg border border-white/20 mb-6">
            <FaHandHoldingHeart className="text-5xl text-indigo-400 animate-bounce" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Give Back to <span className="text-indigo-300">Your Alma Mater</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-200 mb-4 font-medium">
            Your generosity empowers the next generation of leaders and innovators.
          </p>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 px-4">
          {/* Donation Form */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col justify-between min-h-[32rem]">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-xl shadow">
                  <FaGift className="text-2xl text-white" />
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Make a Contribution
                </h2>
              </div>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Donation Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-100 mb-2">
                    Select Fund
                  </label>
                  <div className="relative">
                    <select
                      value={fund}
                      onChange={(e) => setFund(e.target.value)}
                      className="w-full px-4 py-3 bg-white/70 text-slate-900 rounded-xl border-0 shadow focus:ring-2 focus:ring-indigo-400/50 focus:outline-none text-lg font-semibold transition appearance-none"
                    >
                      <option>Scholarship Fund</option>
                      <option>Research Initiative</option>
                      <option>Infrastructure Development</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white text-lg font-bold shadow-lg hover:from-indigo-600 hover:to-blue-800 transition-all duration-150"
                >
                  Donate Now
                </button>
              </form>
            </div>
            <div className="mt-8 text-center text-indigo-100 text-sm opacity-70">
              100% of your donation goes directly to your selected fund.
            </div>
          </div>

          {/* Recent Donations Timeline */}
          <div className="backdrop-blur-2xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl p-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-xl shadow">
                <FaHistory className="text-2xl text-white" />
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Recent Contributions
              </h2>
            </div>
            <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:h-[calc(100%-32px)] before:w-1 before:bg-gradient-to-b from-indigo-400/30 to-blue-400/10">
              {donations.map((donation, index) => (
                <div key={index} className="relative mb-12 group">
                  <div className="absolute left-[-9px] top-2 w-5 h-5 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full ring-4 ring-white/40 shadow" />
                  <div className="ml-6 p-6 bg-white/80 rounded-xl border-l-4 border-indigo-400 group-hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{donation.donor}</h3>
                      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {donation.fund}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <FaRegCalendarAlt className="text-indigo-400" />
                      {donation.date}
                    </div>
                    <div className="text-2xl font-extrabold text-indigo-500">
                      ₹{donation.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-indigo-100 text-xs opacity-60">
              Thank you for your support!
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonationPortal;
