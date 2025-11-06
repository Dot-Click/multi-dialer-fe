import React from 'react';

// Sample data that matches the structure in the image
const eventData = [
  {
    name: 'Kathryn Murphy',
    startDate: '18/06/2021 09:13',
    repeat: 2,
    type: 'Email',
  },
  {
    name: 'Robert Fox',
    startDate: '29/10/2024 15:36',
    repeat: 3,
    type: 'SMS',
  },
  {
    name: 'Annette Black',
    startDate: '2021/11/2013 20:01',
    repeat: 1,
    type: 'Call back',
  },
  {
    name: 'Dianne Russell',
    startDate: '10/06/2021 19:30',
    repeat: 0,
    type: 'Email',
  },
  {
    name: 'Kathryn Murphy',
    startDate: '18/06/2021 09:13',
    repeat: 2,
    type: 'Email',
  },
  {
    name: 'Robert Fox',
    startDate: '29/10/2024 15:36',
    repeat: 3,
    type: 'SMS',
  },
  {
    name: 'Annette Black',
    startDate: '2021/11/2013 20:01',
    repeat: 1,
    type: 'Call back',
  },
  {
    name: 'Dianne Russell',
    startDate: '10/06/2021 19:30',
    repeat: 0,
    type: 'Email',
  },
  {
    name: 'Kathryn Murphy',
    startDate: '18/06/2021 09:13',
    repeat: 2,
    type: 'Email',
  },
  {
    name: 'Robert Fox',
    startDate: '29/10/2024 15:36',
    repeat: 3,
    type: 'SMS',
  },
];

const RecurringEvent = () => {
  return (
    <div className="py-4 px-3 min-h-screen">
      <div className=" bg-white overflow-hidden">
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '80vh' }}>
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="sticky top-0 bg-gray-200">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                  Start Date
                </th>
                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                  Repeat
                </th>
                <th scope="col" className="px-3 py-2 font-semibold text-gray-950">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {eventData.map((event, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <a href="#" className="text-blue-600 hover:underline">
                      {event.name}
                    </a>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {event.startDate}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {event.repeat}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {event.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecurringEvent;