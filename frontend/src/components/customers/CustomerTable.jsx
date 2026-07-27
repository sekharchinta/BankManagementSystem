import { useState } from "react";
import { Search, Trash2, Eye, User, CreditCard, Mail, Phone, Calendar, MapPin } from "lucide-react";

export default function CustomerTable({ customers, onDelete }) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.full_name?.toLowerCase().includes(term) ||
      c.fullname?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term) ||
      c.account_number?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter customers by name, email, phone or account #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      {/* Customer List Table */}
      <div className="rounded-2xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Primary Account</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No customers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const custId = customer.id || customer.customer_id;
                  const name = customer.full_name || customer.fullname || "Customer";
                  const email = customer.email || "N/A";
                  const phone = customer.phone || customer.phnno || "N/A";
                  const accNum = customer.account_number || "SB100000001";

                  return (
                    <tr key={custId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">#{custId}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span>{name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{email}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">{phone}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {accNum}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-slate-800 transition"
                            title="View Customer Profile"
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={() => onDelete(custId)}
                            className="flex h-7 items-center gap-1 rounded-lg bg-rose-50 px-2 text-[11px] font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 transition"
                            title="Delete Customer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal Popup */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-lg">
                  {(selectedCustomer.full_name || selectedCustomer.fullname || "C").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedCustomer.full_name || selectedCustomer.fullname}</h3>
                  <p className="text-xs text-slate-400">Customer Record #{selectedCustomer.id || selectedCustomer.customer_id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <Mail className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Email Address</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedCustomer.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <Phone className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Contact Phone</p>
                  <p className="font-mono font-semibold text-slate-800 dark:text-slate-200">{selectedCustomer.phone || selectedCustomer.phnno || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <CreditCard className="h-4 w-4 text-indigo-500" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Primary Account Number</p>
                  <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedCustomer.account_number || "SB100000001"}</p>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <MapPin className="h-4 w-4 text-indigo-500" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Address</p>
                    <p className="font-medium text-slate-800 dark:text-slate-200">{selectedCustomer.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Close Customer Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}