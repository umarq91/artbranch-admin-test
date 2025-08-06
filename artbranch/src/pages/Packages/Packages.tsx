const PackageCard = ({
  tier,
  viewOnly,
  onClick,
}: {
  tier: { name: string; price: number; description: string[]; image: string };
  viewOnly?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="relative mb-1 overflow-hidden rounded-lg border border-gray-400 p-4 transition-transform hover:scale-105 w-full">
      {/* <img
        src={tier.image}
        alt={tier.name}
        className="absolute right-[-5px] top-[-5px] w-[30%] opacity-90"
      /> */}
      <div className="mb-2 flex items-center justify-between py-2">
        <div className="text-xl font-bold text-black">{tier.name}</div>
      </div>
      <div className="mb-1 text-lg text-black">${tier.price} / mo</div>
      {tier.description.map((d, idx) => (
        <div key={idx}>
          <p
            style={{ fontFamily: "Syne, sans-serif" }}
            className="mb-1 pb-4 pt-2 text-sm text-[#999]"
          >
            {d}
          </p>
          <hr />
        </div>
      ))}
      {!viewOnly && (
        <div className="mb-2 mt-4 flex justify-center">
          <button
            className="font-sync rounded-full bg-[#000000] px-10 py-2 text-sm font-semibold text-[#ffffff] transition-transform duration-200 hover:scale-110"
            onClick={onClick}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const Packages = () => {
  const packages = [
    {
      name: "Basic Package",
      price: 19.99,
      description: ["This is a great starter package", "Good for individuals"],
      image: "https://picsum.photos/200/300?grayscale",
    },
    {
      name: "Pro Package",
      price: 49.99,
      description: [
        "Best value for small teams",
        "Includes all basic features",
      ],
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Premium Package",
      price: 99.99,
      description: ["Advanced tools for enterprises", "All premium features"],
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <>
      {/* Cards section */}
      <div className="flex justify-between items-center mt-20 px-4 py-3 mx-4">
        <div className="text-lg font-semibold">Your Packages</div>
      </div>

      {/* Responsive cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mx-12 ">
        {packages.map((tier, index) => (
          <PackageCard
            key={index}
            tier={tier}
            onClick={() => alert(`Selected: ${tier.name}`)}
          />
        ))}
      </div>
    </>
  );
};

export default Packages;
