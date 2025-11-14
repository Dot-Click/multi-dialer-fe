import { useNavigate } from 'react-router-dom';

const AdminEditSignature = () => {
  const navigate = useNavigate();

  // "Cancel" بٹن پر کلک کرنے پر پچھلے صفحے پر واپس جانے کا فنکشن
  const handleCancel = () => {
    navigate(-1); // براؤزر ہسٹری میں ایک قدم پیچھے جاتا ہے
  };

  // "Save" بٹن پر کلک کرنے پر ڈیٹا محفوظ کرنے کا فنکشن (ابھی خالی ہے)
  const handleSave = () => {
    // TODO: یہاں ڈیٹا محفوظ کرنے کی منطق یا API کال شامل کریں
    console.log('Signature saved!');
    // کامیابی کے بعد صارف کو کسی دوسرے صفحے پر بھیج سکتے ہیں
    // navigate('/admin/signatures');
  };

  return (
    // مرکزی کنٹینر جس کا پس منظر ہلکا گرے ہے
    <div className=" min-h-screen font-sans">
      <div className=" mx-auto px-4 sm:px-6 lg:px-2">
        
        {/* === ہیڈر === */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          
          {/* عنوان */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-950">
            Edit Signature
          </h1>

          {/* ایکشن بٹنز */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 w-28 rounded-lg bg-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 w-28 rounded-lg bg-[#FFCA06] text-gray-950 font-semibold text-sm hover:bg-[#f1c00e] transition-colors duration-200"
            >
              Save
            </button>
          </div>
        </header>

        {/* === مواد کا کارڈ === */}
        <main className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[75vh]">
          <p className="text-center text-gray-400">
          
          </p>
        </main>
      </div>
    </div>
  );
};

export default AdminEditSignature;