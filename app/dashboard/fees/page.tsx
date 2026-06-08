"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/store";
import { Modal } from "../../components/ui/modal";
import {
  DollarSign,
  Plus,
  CreditCard,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Lock,
  ArrowRight,
  TrendingUp,
  Percent,
  Check,
  Loader2
} from "lucide-react";

export default function FeesPage() {
  const {
    activeRole,
    students,
    fees,
    payFee,
    addFeeInvoice
  } = useAppState();

  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState("");

  // Payment Form States
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• ••••");
  const [expiry, setExpiry] = useState("MM/YY");
  const [cvc, setCvc] = useState("•••");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // New Invoice States
  const [invoiceTitle, setInvoiceTitle] = useState("");
  const [amount, setAmount] = useState(1500);
  const [selectedStudentId, setSelectedStudentId] = useState("s1");
  const [dueDate, setDueDate] = useState("2026-06-30");

  const activeStudent = students[0] || { id: "s1", name: "Alex Rivera" };

  const handlePayClick = (feeId: string) => {
    setSelectedFeeId(feeId);
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCardName("");
    setIsSuccess(false);
    setIsProcessing(false);
    setIsPayOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        payFee(selectedFeeId);
        setIsPayOpen(false);
      }, 1500);
    }, 2000);
  };

  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeeInvoice({
      studentId: selectedStudentId,
      title: invoiceTitle,
      amount,
      dueDate
    });
    setInvoiceTitle("");
    setIsAddOpen(false);
  };

  const getStudentName = (sId: string) => {
    return students.find((s) => s.id === sId)?.name || "Unknown Student";
  };

  const getClassName = (cId: string) => {
    // We can assume classes are available from context, but we don't have it directly. Let's search students' class id or mock
    return "Class 10A";
  };

  // Calculations
  const visibleInvoices = fees.filter((f) => {
    // If student role, only show their own invoices
    if (activeRole === "student" && f.studentId !== activeStudent.id) return false;
    // Search matching
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      getStudentName(f.studentId).toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const collected = fees
    .filter((f) => (activeRole !== "student" || f.studentId === activeStudent.id) && f.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pending = fees
    .filter((f) => (activeRole !== "student" || f.studentId === activeStudent.id) && f.status === "Unpaid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const overdue = fees
    .filter((f) => (activeRole !== "student" || f.studentId === activeStudent.id) && f.status === "Overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const selectedFee = fees.find((f) => f.id === selectedFeeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="page-title">
            {activeRole === "student" ? "My Billing & Invoices" : "Billing Ledger Desk"}
          </h1>
          <p className="page-desc mt-1">
            Track student fee payments, invoice balances, and record collections.
          </p>
        </div>

        {activeRole === "admin" && (
           <button
            onClick={() => setIsAddOpen(true)}
             className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
         <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Total Collected</span>
              <span className="text-2xl font-bold block text-slate-900 dark:text-white mt-0.5">${collected.toLocaleString()}</span>
            </div>
          </div>
           <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Settled
          </span>
        </div>

         <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Pending Dues</span>
               <span className="text-2xl font-bold block text-slate-900 dark:text-white mt-0.5">${pending.toLocaleString()}</span>
            </div>
          </div>
           <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            Unpaid
          </span>
        </div>

         <div className="bg-white dark:bg-slate-900 border border-border rounded-xl p-6 card-shadow text-left flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
               <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Overdue Balances</span>
               <span className="text-2xl font-bold block text-rose-600 mt-0.5">${overdue.toLocaleString()}</span>
            </div>
          </div>
           <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
            Immediate
          </span>
        </div>
      </div>

      {/* Invoice Directory Search & Lists */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative text-left">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or invoice title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-10 pr-4 py-2.5 text-[13px] text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-border rounded-xl outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 shadow-sm transition-all"
          />
        </div>

        {/* Invoice directory list table */}
         <div className="bg-white dark:bg-slate-900 border border-border rounded-xl card-shadow overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                 <tr className="border-b border-border bg-slate-50/50 dark:bg-slate-800/50 text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="px-6 py-4">Invoice Detail</th>
                  {activeRole !== "student" && <th className="px-6 py-4">Student Profile</th>}
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Amount Billed</th>
                  <th className="px-6 py-4">Payment status</th>
                  <th className="px-6 py-4 text-right">Settlement Action</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-border text-[13px]">
                {visibleInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={activeRole === "student" ? 5 : 6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No invoices found matching query.
                    </td>
                  </tr>
                ) : (
                  visibleInvoices.map((invoice) => (
                     <tr key={invoice.id} className="hover:bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-900 dark:text-white">{invoice.title}</span>
                           <span className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Inv: {invoice.id}</span>
                        </div>
                      </td>
                      {activeRole !== "student" && (
                         <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200">
                          {getStudentName(invoice.studentId)}
                        </td>
                      )}
                       <td className="px-6 py-4 font-mono text-slate-500 dark:text-slate-400">{invoice.dueDate}</td>
                       <td className="px-6 py-4 font-bold font-mono text-slate-800 dark:text-slate-100">${invoice.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            invoice.status === "Paid"
                               ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : invoice.status === "Overdue"
                               ? "bg-rose-50 text-rose-700 border border-rose-200"
                               : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                             className={`w-1.5 h-1.5 rounded-full ${
                              invoice.status === "Paid"
                                ? "bg-emerald-500"
                                : invoice.status === "Overdue"
                                ? "bg-rose-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {invoice.status !== "Paid" ? (
                          <button
                            onClick={() => handlePayClick(invoice.id)}
                             className="px-3.5 py-1.5 text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Dues</span>
                          </button>
                        ) : (
                           <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 flex items-center justify-end gap-1.5">
                            <Check className="w-4 h-4 text-emerald-500" /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          STRIPE-LIKE PAYMENT GATEWAY POPUP
          ---------------------------------------------------- */}
      <Modal isOpen={isPayOpen} onClose={() => setIsPayOpen(false)} title="Checkout Sandbox Gateway">
        <form onSubmit={handlePaymentSubmit} className="space-y-5">
           <div className="p-5 bg-slate-900 dark:bg-slate-100 text-white rounded-xl text-left shadow-lg space-y-4">
            <div className="flex justify-between items-start">
              <div>
                 <span className="text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Checkout Total</span>
                 <h3 className="text-3xl font-semibold font-mono mt-1">${selectedFee?.amount}</h3>
              </div>
               <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 text-slate-300">
                SANDBOX MODE
              </span>
            </div>
             <div className="text-[12px] text-slate-300 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
               <span className="font-bold text-white">Invoice:</span> {selectedFee?.title} ({selectedFee?.id})
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Cardholder Name</label>
              <input
                required
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Credit Card Number</label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                   className="w-full pl-10 pr-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Expiration Date</label>
                <input
                  required
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                   className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                 <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">CVC Code</label>
                <input
                  required
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  placeholder="123"
                   className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isProcessing || isSuccess}
               className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white text-[14px] font-semibold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Checkout...</span>
                </>
              ) : isSuccess ? (
                <>
                   <Check className="w-5 h-5" />
                  <span>Dues Settled Successfully!</span>
                </>
              ) : (
                <>
                   <Lock className="w-4 h-4" />
                  <span>Pay ${selectedFee?.amount} securely</span>
                </>
              )}
            </button>
             <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1 mt-1">
              Secure sandbox transaction powered by Academix Stripe.
            </p>
          </div>
        </form>
      </Modal>

      {/* ----------------------------------------------------
          GENERATE INVOICE MODAL
          ---------------------------------------------------- */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Generate billing Invoice">
        <form onSubmit={handleCreateInvoiceSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5 text-left">
             <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Invoice statement Title</label>
            <input
              required
              type="text"
              value={invoiceTitle}
              onChange={(e) => setInvoiceTitle(e.target.value)}
              placeholder="e.g. Term 3 Tuition Fees"
               className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 text-left col-span-1">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Billing Amount ($)</label>
              <input
                required
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left col-span-1">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] font-medium text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({getClassName(s.classId)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left col-span-1">
               <label className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Due Date</label>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                 className="px-3.5 py-2.5 border border-border rounded-lg bg-white dark:bg-slate-900 text-[13px] text-slate-900 dark:text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm font-mono text-slate-600 dark:text-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
             <button
              type="button"
              onClick={() => setIsAddOpen(false)}
               className="px-4 py-2 border border-border text-[13px] font-bold rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
               className="px-4 py-2 bg-primary hover:bg-primary/90 text-[13px] font-semibold rounded-lg text-white shadow-sm transition-colors cursor-pointer"
            >
              Post Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
