// MainPage.tsx
import React from 'react';
import FileUpload from '../components/FileUpload';
import Chat from '../components/Chat'

const Main: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-black text-white flex">
      <div className="w-[30vw] min-h-screen p-6 flex justify-center items-center border-r border-white/10">
        <FileUpload/>
      </div>
      <div className="w-[70vw] min-h-screen p-6 border-l border-white/10 overflow-auto">
        <Chat/>
      </div>
    </div>
  );
};

export default Main;
