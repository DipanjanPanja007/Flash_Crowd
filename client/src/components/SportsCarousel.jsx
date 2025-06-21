import { useState, useEffect, useCallback } from 'react';
import {
  FaFootballBall,
  FaTableTennis,
  FaBasketballBall,
  FaVolleyballBall,
  FaCamera,
  FaChess,
  FaMusic,
  FaPenAlt,
  FaPalette,
  FaRunning,
  FaQuestion,
  FaMicrophone
} from 'react-icons/fa';

const sports = [
  { name: "Football", icon: <FaFootballBall /> },
  { name: "Cricket", icon: <FaTableTennis /> },
  { name: "Badminton", icon: <FaTableTennis /> },
  { name: "Basketball", icon: <FaBasketballBall /> },
  { name: "Volleyball", icon: <FaVolleyballBall /> },
  { name: "Photography", icon: <FaCamera /> },
  { name: "Quiz", icon: <FaQuestion /> },
  { name: "Chess", icon: <FaChess /> },
  { name: "Dance", icon: <FaRunning /> },
  { name: "Poetry", icon: <FaPenAlt /> },
  { name: "Art", icon: <FaPalette /> },
  { name: "Yoga", icon: <FaRunning /> },
  { name: "Singing", icon: <FaMicrophone /> }
];

const SportsCarousel = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSports, setVisibleSports] = useState([]);

  // Calculate visible sports based on current index
  const updateVisibleSports = useCallback(() => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % sports.length;
      items.push(sports[index]);
    }
    setVisibleSports(items);
  }, [currentIndex]);

  useEffect(() => {
    updateVisibleSports();
  }, [currentIndex, updateVisibleSports]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sports.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-indigo-800 mb-8 text-center">Sports & Activities</h2>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
        {visibleSports.map((sport, idx) => (
          <div
            key={`${sport.name}-${idx}`}
            className="w-full md:w-1/4 p-7 bg-white rounded-2xl shadow-md border border-gray-200 
                      flex flex-col items-center justify-center transition-all duration-300
                      hover:shadow-lg hover:border-indigo-300 hover:scale-[1.02]"
          >
            <div className="text-7xl text-indigo-600 mb-4 animate-pulse">
              {sport.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 text-center">
              {sport.name}
            </h3>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {sports.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index >= currentIndex && index < currentIndex + 3
                ? 'bg-indigo-600 w-6'
                : 'bg-gray-300'
              }`}
            aria-label={`Show ${sports[index].name}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SportsCarousel;