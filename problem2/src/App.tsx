import SwapForm from './components/SwapForm';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 fade-in gap-2 flex flex-col w-full max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Currency <span className="text-green-500">Swap</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-base">
            Trade tokens instantly with the best rates
          </p>
        </div>

        {/* Swap Form */}
        <div className="fade-in w-full max-w-3xl">
          <SwapForm />
        </div>
    </div>
  );
}

export default App;
