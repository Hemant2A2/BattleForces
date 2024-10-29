import React from 'react';
import { useNavigate } from 'react-router-dom';

// Shared Tailwind CSS classes
const buttonClasses = "py-3 px-6 rounded-full shadow-lg text-lg transition-transform transform hover:scale-105";
const flexCenterClasses = "flex items-center justify-center min-h-screen bg-background";
const textCenterClasses = "text-center";
const imageClasses = "mx-auto rounded-lg shadow-lg mb-8 w-3/4 sm:w-1/2"; // Adjusted image size
const titleClasses = "text-4xl font-extrabold text-gray-800 mb-6"; // Title style

const Home = () => {
  return (
    <div className={flexCenterClasses}>
      <Content />
    </div>
  );
};

const Content = () => {
  return (
    <div className={textCenterClasses}>
      <Title />
      <MainImage />
      <Buttons />
    </div>
  );
};

// New Title component for "BATTLEFORCES"
const Title = () => {
  return (
    <h1 className={titleClasses}>BATTLEFORCES</h1>
  );
};

const MainImage = () => {
  return (
    <img src="./app_logo.png" alt="Main feature image" className={imageClasses} />
  );
};

const Buttons = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-4">
      <Button
        redirect={() => navigate('/login')}
        text="Login"
        bgColor="bg-blue-500"
        textColor="text-white"
        hoverColor="hover:bg-blue-600"
      />
      <Button
        redirect={() => navigate('/submit-handle')}
        text="Register"
        bgColor="bg-blue-500"
        textColor="text-white"
        hoverColor="hover:bg-blue-600"
        additionalClasses="ml-4"
      />
    </div>
  );
};

const Button = ({ redirect, text, bgColor, textColor, hoverColor, additionalClasses = "" }) => {
  return (
    <button
      onClick={redirect}
      className={`${bgColor} ${textColor} ${buttonClasses} ${hoverColor} ${additionalClasses}`}
    >
      {text}
    </button>
  );
};

export default Home;
