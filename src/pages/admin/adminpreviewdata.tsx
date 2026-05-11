import { FiChevronLeft, FiPhone, FiMail } from "react-icons/fi";
import { useState } from "react";

const ImportPreviewPage = () => {
  const [openMapped, setOpenMapped] = useState(false);

  const rows = [
    {
      name: "Kathryn Murphy",
      phone: "(252) 555-0126",
      email: "michael.mitc@example.com",
      address: "5846 Hogar Island, Lubowitzfurt 43186-7963",
    },
    {
      name: "Robert Fox",
      phone: "(405) 555-0128",
      email: "bill.sanders@example.com",
      email2: "bill.sander99@example.com",
      email3: "bill.sanders@example.com",
      address: "950 Elysia Isle, Fort Alanaboro 43222",
    },
    {
      name: "Annette Black",
      phone: "(684) 555-0102",
      email: "willie.jennings@example.com",
      email2: "willie.jennings@example.com",
      address: "926 Wuckert Plaza, Lake Derickmouth 67020",
    },
    {
      name: "Marvin McKinney",
      phone: "(229) 555-0109",
      email: "alma.lawson@example.com",
      address: "791 Cedar Road, Newbarugh 54023",
    },
    {
      name: "Ralph Edwards",
      phone: "(808) 555-0111",
      email: "tanya.hill@example.com",
      address: "82366 Long Lane, Lake Rollinsilde 38172",
    },

    // ---- Added Rows ----

    {
      name: "Leslie Alexander",
      phone: "(602) 555-0183",
      email: "leslie.alexander@example.com",
      address: "9128 Sunset Drive, West Orlandoton 67213",
    },
    {
      name: "Jenny Wilson",
      phone: "(415) 555-0199",
      email: "jenny.wilson@example.com",
      address: "442 Lakewood Street, North Michaelport 84729",
    },
    {
      name: "Courtney Henry",
      phone: "(701) 555-0142",
      email: "courtney.henry@example.com",
      email2: "c.henry@example.com",
      address: "1185 Maple Street, Lake Phillipland 59012",
    },
    {
      name: "Theresa Webb",
      phone: "(318) 555-0138",
      email: "theresa.webb@example.com",
      address: "221 Greenway Circle, West Lorrieburgh 29163",
    },
    {
      name: "Cameron Williamson",
      phone: "(623) 555-0102",
      email: "cameron.will@example.com",
      email2: "cw@example.com",
      address: "703 Elm Street, East Aubreeton 39402",
    },
    {
      name: "Eleanor Pena",
      phone: "(347) 555-0177",
      email: "eleanor.pena@example.com",
      address: "904 Kings Highway, South Barrettburgh 76142",
    },
    {
      name: "Jerome Bell",
      phone: "(213) 555-0144",
      email: "jerome.bell@example.com",
      address: "678 Summer Avenue, Port Calebranch 37160",
    },
    {
      name: "Darlene Robertson",
      phone: "(480) 555-0163",
      email: "dar.robertson@example.com",
      email2: "darlene.rob@example.com",
      address: "153 Hillcrest Road, Lake Dianestad 62903",
    },
    {
      name: "Guy Hawkins",
      phone: "(755) 555-0106",
      email: "guy.hawkins@example.com",
      address: "309 Forest Street, West Nolanberg 83410",
    },
    {
      name: "Savannah Nguyen",
      phone: "(970) 555-0149",
      email: "sav.nguyen@example.com",
      address: "443 Valley Ridge, East Melanachester 52371",
    }
  ];

  return (
    <section className="min-h-screen  pr-10 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button className="text-gray-600 hover:text-black">
            <FiChevronLeft size={22} />
          </button>

          <h1 className="text-xl sm:text-2xl font-medium text-gray-900">
            Preview import history
          </h1>
        </div>

        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-2 sm:p-4">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4">
            Previewing the first 100 records. To see the entire import, please review
            the list or group in the data and dialer area.
          </p>

          {/* White Card */}
          <div className="">
            <div className="overflow-y-auto h-[65vh] custom-scrollbar">

              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-600 uppercase">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Phone Number</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Property Address</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="border-b last:border-none">

                      {/* Name */}
                      <td className="px-4 py-4">
                        <a
                        href=""
                            onClick={() => setOpenMapped(true)}className="text-blue-600 hover:underline cursor-pointer"

                        >
                          {row.name}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4 text-gray-700">
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-gray-500" size={14} />
                          {row.phone}
                        </div>
                      </td>

                      {/* Emails */}
                      <td className="px-4 py-4 text-gray-700">
                        <div className="flex items-start gap-2">
                          <FiMail className="text-gray-500 mt-1" size={14} />
                          <div className="flex flex-col leading-tight">
                            <span>{row.email}</span>
                            {row.email2 && <span>{row.email2}</span>}
                          </div>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-4 py-4 text-gray-700">{row.address}</td>

                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>


        </div>



      </div>

      {/* MAPPED FIELD MODAL */}
      {openMapped && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* DARK OVERLAY */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setOpenMapped(false)}
          ></div>

          {/* MODAL BOX */}
          <div className="relative bg-white rounded-2xl shadow-xl 
                    w-[90%] sm:w-[650px] max-h-[80vh] overflow-y-auto p-6 z-50">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mapped Fields</h2>
              <button
                onClick={() => setOpenMapped(false)}
                className="text-gray-600 hover:text-black text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Two Columns with Auto-mapping Visualization */}
            <div className="grid grid-cols-[1fr,40px,1fr] gap-0 items-center">
              
              {/* Header */}
              <div className="text-sm font-semibold text-gray-700 mb-4 px-2">Your fields (CSV)</div>
              <div className="mb-4"></div>
              <div className="text-sm font-semibold text-gray-700 mb-4 px-2">Multi-Dialer Fields</div>

              {/* Mapped Rows */}
              {[
                { yours: "First Name", mojo: "First Name" },
                { yours: "Last Name", mojo: "Last Name" },
                { yours: "Property Address", mojo: "Property Address" },
                { yours: "Property City", mojo: "Property City" },
                { yours: "Property State", mojo: "Property State" },
                { yours: "Property Zip", mojo: "Property Zip Code" },
                { yours: "Phone 1", mojo: "Phone" },
                { yours: "Email 1", mojo: "Email" },
              ].map((pair, i) => (
                <div key={i} className="contents">
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5 border text-gray-700 text-sm mb-2">
                    {pair.yours}
                  </div>
                  <div className="flex justify-center items-center mb-2 text-gray-400">
                    →
                  </div>
                  <div className="bg-[#FFCA06]/10 rounded-lg px-3 py-2.5 border border-[#FFCA06]/30 text-gray-800 text-sm font-medium mb-2">
                    {pair.mojo}
                  </div>
                </div>
              ))}

              {/* Unmapped / Other Fields */}
              <div className="col-span-3 mt-4 border-t pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Additional unmatched fields</p>
                <div className="flex flex-wrap gap-2">
                  {["Middle Name", "Phone 2", "Notes", "Tag 1"].map((f, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs border">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}


      {/* Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cfcfcf;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
      `}</style>
    </section>
  );
};

export default ImportPreviewPage;
