const semesterOrder = { SPR: 1, SUM: 2, FAL: 3 };

function parseYearSemester(yearSem) {
  if (!yearSem) return 0;
  const [yearStr, sem] = yearSem.split("-");
  const year = parseInt(yearStr);
  const semOrder = semesterOrder[sem];
  return year * 10 + semOrder; // Year has higher weight
}

export default function Table({ searchResults }) {
  if (!searchResults || searchResults.length === 0) return null;

  // Sort descending by year-semester
  const sortedResults = [...searchResults].sort(
    (a, b) => parseYearSemester(b.year) - parseYearSemester(a.year)
  );

  return (
    <div className="w-1/2 ml-auto mr-10 mt-10 mb-10 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Grade Distribution Table</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Year", "Semester", "Professor", "GPA", "Section",
              "A", "B", "C", "D", "F", "Q", "I", "S", "U", "X"
            ].map((header) => (
              <th
                key={header}
                className="border border-gray-300 px-2 py-1 whitespace-nowrap text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((course, courseIdx) => {
            const [yearOnly, semesterOnly] = course.year?.includes("-")? course.year.split("-") : [course.year, "-"];

            return course.section_num.map((section, secIdx) => {
              const prof = course.instructor[secIdx];
              const gpa = course.gpa[secIdx];
              const A = course.A[secIdx];
              const B = course.B[secIdx];
              const C = course.C[secIdx];
              const D = course.D[secIdx];
              const F = course.F[secIdx];
              const ISUQX = course.ISUQX[secIdx];
              const [I, S, U, Q, X] = ISUQX;

              return (
                <tr key={`${courseIdx}-${secIdx}`} className="text-center hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-1">{yearOnly}</td>
                  <td className="border border-gray-300 px-2 py-1">{semesterOnly}</td>
                  <td className="border border-gray-300 px-2 py-1 max-w-xs break-words">{prof}</td>
                  <td className="border border-gray-300 px-2 py-1">{parseFloat(gpa).toFixed(3)}</td>
                  <td className="border border-gray-300 px-2 py-1">{section}</td>
                  <td className="border border-gray-300 px-2 py-1">{A}</td>
                  <td className="border border-gray-300 px-2 py-1">{B}</td>
                  <td className="border border-gray-300 px-2 py-1">{C}</td>
                  <td className="border border-gray-300 px-2 py-1">{D}</td>
                  <td className="border border-gray-300 px-2 py-1">{F}</td>
                  <td className="border border-gray-300 px-2 py-1">{Q}</td>
                  <td className="border border-gray-300 px-2 py-1">{I}</td>
                  <td className="border border-gray-300 px-2 py-1">{S}</td>
                  <td className="border border-gray-300 px-2 py-1">{U}</td>
                  <td className="border border-gray-300 px-2 py-1">{X}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
