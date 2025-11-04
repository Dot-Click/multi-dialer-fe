import React from "react";

const LeadSheet = () => {
  // All questions in one array
  const questions = [
    {
      id: 1,
      question: "When we sell your home where are you moving to?",
      type: "text",
    },
    {
      id: 2,
      question: "How soon do you have to be there?",
      type: "text",
    },
    {
      id: 3,
      question: "What’s important about you being in X?",
      type: "text",
    },
    {
      id: 4,
      question: "What do you think stopped your home from selling?",
      type: "text",
    },
    {
      id: 5,
      question:
        "What specifically are you looking for in the agent you will hire?",
      type: "text",
    },
    {
      id: 6,
      question: "When I see you, what price do you have in mind for your home?",
      type: "text",
    },
    {
      id: 7,
      question:
        "So part of my job is knowing the numbers so you will be better prepared on what to expect at closing. I am curious what is the amount you owe on your home?",
      type: "text",
    },
    {
      id: 8,
      question: "Will all the decision makers be present for our meetings?",
      type: "radio",
    },
    {
      id: 9,
      question:
        "After our meeting if I am able to show you that it makes sense to list your home and get it sold, then would you be ready to list your home with me to do just that?",
      type: "radio",
    },
  ];

  return (
    <section className="w-full bg-white  rounded-2xl ">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Lead sheet:</h2>
         
        </div>

        <div className="flex gap-3">
             <select className=" bg-gray-200 w-fit border-gray-30 rounded-md md:px-4 md:py-2 px-2 py-1 text-[10px] md:text-sm  outline-none">
            <option>Expired Property</option>
            <option>New Listing</option>
            <option>Referral</option>
          </select>
          <button className="bg-gray-200 rounded-md md:px-4 md:py-2  px-2 py-1 text-[10px] md:text-sm hover:bg-gray-100">
            Print
          </button>
          <button className="bg-gray-200 rounded-md md:px-4 md:py-2  px-2 py-1 text-[10px] md:text-sm hover:bg-gray-100">
            Download
          </button>                   
          <button className="bg-gray-200   rounded-md md:px-4 md:py-2  px-2 py-1 text-[10px] md:text-sm hover:bg-gray-100">
            Send As Email 
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col  gap-6">
        {questions.map((q) => (
          <div key={q.id} className="flex px-3 py-3 rounded-md bg-gray-100 flex-col gap-2">
            <label className="text-gray-800 font-medium text-sm md:text-sm">
              {q.question}
            </label>

            {q.type === "text" ? (
              <textarea
                placeholder="Type your note here"
                className="w-full  rounded-md  text-sm text-gray-800 placeholder-gray-400  outline-none resize-none"
                rows={1}
              ></textarea>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <label className="flex text-sm  items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className=" accent-yellow-400"
                  />
                  Yes
                </label>
                <label className="flex text-sm items-center gap-2 text-gray-700">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className=" accent-yellow-400"
                  />
                  No
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadSheet;
