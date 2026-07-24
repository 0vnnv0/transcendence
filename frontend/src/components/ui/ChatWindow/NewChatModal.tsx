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
  // State für das Eingabefeld
  const [inputValue, setInputValue] = useState('');
  // State für den verzögerten Suchbegriff (verhindert Spam ans Backend)
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { mutate: startChat, isPending: isStartingChat } = useStartChat();
  const { data: users, isLoading, isError } = useUsersSearch(debouncedSearch);

  // Debounce Logik: Warte 300ms nach dem letzten Tastendruck
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer); // Cleanup, wenn der User weitertippt
  }, [inputValue]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setDebouncedSearch('');
    }
  }, [isOpen]); // Dieser Effekt wird jedes Mal ausgeführt, wenn sich isOpen ändert
  
  // Early Return, wenn Modal geschlossen ist
  if (!isOpen) return null;

  const handleUserClick = (targetUserId: number) => {
    startChat({ currentUserId, targetUserId });
    onClose();
    setInputValue(''); // Reset nach Erfolg
  };

  // --------------------------------------------------------
  // Sauberes bedingtes Rendern für die Liste
  // --------------------------------------------------------
  let listContent = null;

  if (debouncedSearch.trim().length === 0) {
    listContent = (
      <div className="p-8 text-center text-gray-500 font-kyiv">
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
                src={user.avatarUrl || "/profile.jpg"} 
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

  // Das eigentliche Modal-UI
  // Wir nutzen einen sehr hohen z-index (z-[9999]), um sicherzugehen.
  const modalUI = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} 
    >
      <div 
        className="bg-purple-dark border border-black rounded-lg shadow-2xl w-[450px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header & Suchleiste */}
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
            className="w-full bg-mild-purple text-white font-kyiv border border-gray-600 rounded-md p-2 focus:outline-none focus:border-gray-400 transition-colors"
            autoFocus
          />
        </div>
        
        {/* Listen-Bereich mit Scrollbar, falls viele Ergebnisse kommen */}
        <div className="overflow-y-auto flex-1 min-h-[150px]">
          {listContent}
        </div>
      </div>
    </div>
  );

  // WICHTIG: createPortal heftet das HTML direkt an den <body> an!
  return createPortal(modalUI, document.body);
};