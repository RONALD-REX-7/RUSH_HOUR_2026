import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Problem, ChatMessage } from '../../types';
import {
  Send,
  Image,
  Paperclip,
  CheckCheck,
  User as UserIcon,
  Bot,
  Sparkles,
  FileText,
  X,
} from 'lucide-react';
import { StatusBadge } from '../ui/Badge';

interface ChatWindowProps {
  problem: Problem;
  isReadOnly?: boolean; // For admin monitoring
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ problem, isReadOnly = false }) => {
  const { chats, currentUser, sendChatMessage } = useApp();
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const problemChats = (chats || []).filter((c) => c.problemId === problem.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [problemChats]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage && !selectedFile) return;

    sendChatMessage(
      problem.id,
      inputText,
      selectedImage || undefined,
      selectedFile?.url,
      selectedFile?.name
    );

    setInputText('');
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const sampleQuickResponses = [
    'I have reached the site location.',
    'Could you provide additional landmark details?',
    'Work has started. Photos attached.',
    'Work is complete! Please inspect.',
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {problem.id}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              {problem.title}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <span>{problem.category}</span>
              <span>•</span>
              <span>{problem.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={problem.status} />
          {isReadOnly && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Admin Monitoring Mode
            </span>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
        {problemChats.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Sparkles className="w-8 h-8 mb-2 text-blue-500 animate-bounce" />
            <p className="text-xs font-medium">No chat messages yet for {problem.id}.</p>
            <p className="text-[11px] mt-1">
              Start the discussion regarding site inspection, updates, or materials!
            </p>
          </div>
        ) : (
          problemChats.map((msg) => {
            const isMe = currentUser && msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  isMe ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-slate-200 dark:border-slate-700"
                />

                <div
                  className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] opacity-80 gap-2">
                    <span className="font-bold">{msg.senderName}</span>
                    <span className="capitalize text-[9px] px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10">
                      {msg.senderRole}
                    </span>
                  </div>

                  {msg.content && <p className="leading-relaxed">{msg.content}</p>}

                  {/* Image attachment */}
                  {msg.imageUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                      <img
                        src={msg.imageUrl}
                        alt="Attachment"
                        className="max-h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* File attachment */}
                  {msg.fileUrl && (
                    <div className="mt-2 flex items-center space-x-2 p-2 rounded-lg bg-black/10 dark:bg-white/10 text-[11px]">
                      <FileText className="w-4 h-4" />
                      <span className="font-semibold underline truncate">
                        {msg.fileName || 'Attached Document'}
                      </span>
                    </div>
                  )}

                  <div className="mt-1 flex items-center justify-end space-x-1 text-[9px] opacity-70">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Previews */}
      {(selectedImage || selectedFile) && (
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          {selectedImage && (
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Upload preview"
                className="w-12 h-12 rounded-lg object-cover border"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {selectedFile && (
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>{selectedFile.name}</span>
              <button onClick={() => setSelectedFile(null)}>
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick response pills */}
      {!isReadOnly && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium whitespace-nowrap">Quick Reply:</span>
          {sampleQuickResponses.map((res, i) => (
            <button
              key={i}
              onClick={() => setInputText(res)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {res}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      {!isReadOnly ? (
        <form
          onSubmit={handleSend}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2"
        >
          {/* Quick Image Upload simulation button */}
          <button
            type="button"
            onClick={() =>
              setSelectedImage(
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
              )
            }
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Attach Inspection Photo"
          >
            <Image className="w-4 h-4" />
          </button>

          {/* File Upload simulation button */}
          <button
            type="button"
            onClick={() =>
              setSelectedFile({
                name: 'Inspection_Report_Site_Plan.pdf',
                url: '#',
              })
            }
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Attach Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message regarding problem resolution..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !selectedImage && !selectedFile}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 font-medium border-t border-slate-200 dark:border-slate-700">
          Admin Read-Only Monitoring View
        </div>
      )}
    </div>
  );
};
