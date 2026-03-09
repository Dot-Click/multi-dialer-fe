import scripticon from "../../../assets/scripticon.png"

const scriptContent = [
  "Hi, is this [First Name]?",
  "Great, [First Name], this is [Your Name]. I don't want to take much of your time. The reason I'm calling is that I noticed the property on [Address] is no longer listed.",
  "Before I let you go, may I quickly ask—are you still considering selling the home, or have your plans changed?",
  "I completely understand. The market right now is moving in some interesting ways, and many homeowners aren't sure whether to relist or wait. If it's helpful, I'd be glad to share what similar homes nearby are currently going for, just so you have the info at hand.",
  "Would that be something you'd like me to send over?",
];

const ContactInfoScript = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 w-full h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <img src={scripticon} alt="scripticon"  className="w-3 object-contain"/>
        <h3 className="text-base font-medium text-gray-700">Script</h3>
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="space-y-4">
          {scriptContent.map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfoScript;