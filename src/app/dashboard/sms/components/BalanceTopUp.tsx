export const BalanceTopUp: React.FC = () => {
  return (
    <div className="bg-purple-100 p-6 rounded-xl w-full">
      <div className="text-sm font-medium">SMS Balance</div>
      <div className="text-4xl font-bold mt-2">0.00</div>
      <input
        type="number"
        placeholder="Enter amount"
        className="w-full mt-4 p-2 border rounded"
      />
      <p className="text-red-500 text-xs mt-1">Minimum Top Up 500 Taka</p>
      <button className="bg-purple-600 text-white mt-3 py-2 w-full rounded">
        Top Up SMS
      </button>
    </div>
  );
};
