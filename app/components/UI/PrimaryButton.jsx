const PrimaryButton = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={[
        "bg-gray-900 text-white font-medium py-2 rounded-md hover:bg-gray-800 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
