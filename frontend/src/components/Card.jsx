const Card = ({ title, description, image, category, onClick, className }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 ${
        className || ""
      }`}
      onClick={onClick}
    >
      {image && (
        <div className="h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        {category && (
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-2">
            {category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
    </div>
  );
};

export default Card;
