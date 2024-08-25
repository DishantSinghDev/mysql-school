interface LoaderProps {
    active: boolean;
  }
  
  const Loader: React.FC<LoaderProps> = ({ active }) => {
    if (!active) {
      return null;
    }
  
    return (
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-300 z-50">
        <div className="h-full bg-gray-500 animate-loader"></div>
        <style jsx>{`
          @keyframes loader {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          
          .animate-loader {
            animation: loader 2s infinite;
          }
        `}</style>
      </div>
    );
  };
  
  export default Loader;
  