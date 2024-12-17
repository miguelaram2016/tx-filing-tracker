/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ResultsTable({ results }: { results: any[] | null }) {
  if (!results || results.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-600">
        <p>No results found. Please check your input and try again.</p>
      </div>
    );
  }

  return (
    <table className="table-auto w-full mt-6 border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-300 px-4 py-2">View</th>
          <th className="border border-gray-300 px-4 py-2">Document Number</th>
          <th className="border border-gray-300 px-4 py-2">Entity Name</th>
          <th className="border border-gray-300 px-4 py-2">Delivery Method</th>
          <th className="border border-gray-300 px-4 py-2">Expedited</th>
          <th className="border border-gray-300 px-4 py-2">Received Date</th>
          <th className="border border-gray-300 px-4 py-2">Document Type</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Filing Number</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="border border-gray-300 px-4 py-2">
              <a
                href={result.viewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            </td>
            <td className="border border-gray-300 px-4 py-2">{result.documentNumber}</td>
            <td className="border border-gray-300 px-4 py-2">{result.entityName}</td>
            <td className="border border-gray-300 px-4 py-2">{result.deliveryMethod}</td>
            <td className="border border-gray-300 px-4 py-2">{result.expedited || "No"}</td>
            <td className="border border-gray-300 px-4 py-2">{result.receivedDate}</td>
            <td className="border border-gray-300 px-4 py-2">{result.documentType}</td>
            <td className="border border-gray-300 px-4 py-2">{result.status}</td>
            <td className="border border-gray-300 px-4 py-2">{result.filingNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
