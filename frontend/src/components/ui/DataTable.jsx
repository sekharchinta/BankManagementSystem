import React from "react";

export default function DataTable({
  columns,
  data,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              {columns.map((column) => (
                <th
                  key={column.key}
                  className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-slate-700
                    whitespace-nowrap
                  "
                >
                  {column.title}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-slate-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="
                        px-6
                        py-4
                        text-sm
                        text-slate-700
                        whitespace-nowrap
                      "
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>

                <td
                  colSpan={columns.length}
                  className="
                    py-10
                    text-center
                    text-slate-500
                  "
                >
                  {emptyMessage}
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}