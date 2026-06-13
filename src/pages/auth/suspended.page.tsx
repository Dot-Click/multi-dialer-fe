const SuspendedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[24px] shadow-lg p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-[24px] font-[700] text-[#1D2C45] dark:text-white mb-2">
          Account Suspended
        </h1>
        <p className="text-[15px] text-[#6B7280] dark:text-gray-400 mb-8">
          Your account has been suspended. Please contact support to resolve
          this issue and regain access.
        </p>

        <a
          href="mailto:support@slingoo.com"
          className="inline-block bg-[#FFCA06] text-[#1D2C45] font-[600] text-[15px] px-8 py-3 rounded-[12px] hover:bg-yellow-400 transition-colors"
        >
          Contact Support
        </a>

        <div className="mt-4">
          <a
            href="/agent/login"
            className="text-[14px] text-[#6B7280] hover:text-[#1D2C45] dark:hover:text-white transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuspendedPage;
