export const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TibiaGG
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your ultimate Tibia gaming hub for hunting places, quest guides, and
            more!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Hunting Places
              </h2>
              <p className="text-emerald-600">
                Discover the best hunting spots for your level and vocation.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quest Guides
              </h2>
              <p className="text-gray-600">
                Complete quest walkthroughs and tutorials.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-emerald-800 mb-2">
                Character Tools
              </h2>
              <p className="text-emerald-600">
                Manage your characters and track progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
