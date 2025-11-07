

const groupOptions = ["Hot", "Warm", "Nurture", "Working"];


const ContactInfoBottom = () => {


    return (
        // Main Container
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <div className="space-y-6">



                {/* Group Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="flex   px-4 py-2 rounded-lg text-[15px] font-medium bg-gray-200 flex-wrap gap-4 justify-around">
                        {groupOptions.map((option) => (
                            <button
                                key={option}
                               
                                className={`
                  transition-colors duration-200
                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ContactInfoBottom;