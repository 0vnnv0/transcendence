// components/NewChatModal.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // WICHTIG für das Z-Index Problem
import { useUsersSearch } from '../../../hooks/useUsers';
import { useStartChat } from '../../../hooks/useChat';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ 
  isOpen, 
  onClose, 
  currentUserId 
}) => {
	// console.log("aktuelle auth userId:", currentUserId);

  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { mutate: startChat, isPending: isStartingChat } = useStartChat();
  const { data: users, isLoading, isError } = useUsersSearch(debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer); 
  }, [inputValue]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setDebouncedSearch('');
    }
  }, [isOpen]); 
  if (!isOpen) return null;

  const handleUserClick = (targetUserId: number) => {
	
    startChat({ currentUserId, targetUserId });
    onClose();
    setInputValue('');
  };

  let listContent = null;

  if (debouncedSearch.trim().length === 0) {
    listContent = (
      <div className="p-8 text-center text-mild-purple font-kyiv">
        Type in a name to start chatting!
      </div>
    );
  } else if (isLoading) {
    listContent = <div className="p-4 text-gray-400 font-kyiv">Searching...</div>;
  } else if (isError) {
    listContent = <div className="p-4 text-red-500 font-kyiv">Error trying to load search</div>;
  } else if (!users || users.length === 0) {
    listContent = <div className="p-4 text-gray-400 font-kyiv">No user named "{debouncedSearch}" found</div>;
  } else {
    // Aktuellen User aus den Ergebnissen filtern
    const availableUsers = users.filter(user => user.id !== currentUserId);
	console.log("AV Users", availableUsers)
    if (availableUsers.length === 0) {
      listContent = <div className="p-4 text-gray-400 font-kyiv">That's you!</div>;
    } else {
      listContent = (
        <ul className="flex flex-col gap-2 p-2">
          {availableUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`flex items-center gap-3 p-2 cursor-pointer rounded-md transition-all 
                ${isStartingChat ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-700'}`}
            >
              <img 
                src={user.customAvatar || user.avatarUrl} 
                className="h-8 w-8 rounded-full object-cover"
                alt={user.intraName}
              />
              <span className="text-white font-kyiv">{user.intraName}</span>
            </li>
          ))}
        </ul>
      );
    }
  }


  const modalUI = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div 
        className="bg-purple-dark border border-black rounded-lg shadow-2xl w-[300px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="p-4 border-b border-gray-600 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="text-white font-kyiv text-lg">Start a new chat</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer transition-colors"
            >
              &times;
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Search user..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-mild-purple text-purple-dark font-kyiv border border-gray-600 rounded-md p-2 focus:outline-none focus:border-gray-400 transition-colors"
            autoFocus
          />
        </div>
        
        <div className="overflow-y-auto flex-1 min-h-[150px]">
          {listContent}
        </div>
      </div>
    </div>
  );

  return createPortal(modalUI, document.body);
};
