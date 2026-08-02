import { BadgeAlert, BadgeCheck } from "lucide-react";

const patients = [
  {
    id: 1,
    name: "Rahul Sharma",
    age: 45,
    glucose: 180,
    result: "High Risk",
  },
  {
    id: 2,
    name: "Neha Patil",
    age: 36,
    glucose: 118,
    result: "Low Risk",
  },
  {
    id: 3,
    name: "Amit Verma",
    age: 52,
    glucose: 205,
    result: "High Risk",
  },
];

const AssessmentTable = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Recent Assessments
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-200">

              <th className="text-left py-3 text-slate-600">Patient</th>

              <th className="text-left py-3 text-slate-600">Age</th>

              <th className="text-left py-3 text-slate-600">Glucose</th>

              <th className="text-left py-3 text-slate-600">Prediction</th>

            </tr>

          </thead>

          <tbody>

            {patients.map((patient) => (

              <tr
                key={patient.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="py-4 font-medium">
                  {patient.name}
                </td>

                <td>{patient.age}</td>

                <td>{patient.glucose}</td>

                <td>

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      patient.result === "High Risk"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {patient.result === "High Risk" ? (
                      <BadgeAlert size={16} />
                    ) : (
                      <BadgeCheck size={16} />
                    )}

                    {patient.result}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AssessmentTable;