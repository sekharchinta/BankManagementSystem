import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  onFilter,
  showFilter = false,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col gap-3 md:flex-row md:items-center ${className}`}
    >
      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            py-3
            pl-11
            pr-11
            text-slate-700
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
            outline-none
            transition
          "
        />

        {value && (
          <button
            onClick={() =>
              onChange({
                target: {
                  value: "",
                },
              })
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {showFilter && (
        <button
          onClick={onFilter}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-300
            bg-white
            px-5
            py-3
            hover:bg-slate-100
            transition
          "
        >
          <SlidersHorizontal size={18} />
          Filter
        </button>
      )}
    </div>
  );
}