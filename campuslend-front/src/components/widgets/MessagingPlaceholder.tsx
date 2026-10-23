import React from 'react';

interface MessagingPlaceholderProps {
  title: string;
  onStartChat: (userId: string) => void;
}

const MessagingPlaceholder: React.FC<MessagingPlaceholderProps> = ({ title, onStartChat }) => {
  return (
    <div className="glass rounded-2xl p-6 shadow-glass transition-all duration-300 hover:shadow-glass-hover">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-muted mt-1">
          Secure messaging for coordinating campus meetups
        </p>
      </div>

      <div className="space-y-3">
        {/* Mock chat previews */}
        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 rounded-full h-9 w-9 flex items-center justify-center text-primary font-semibold text-sm">
              AJ
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm">Alex Johnson</h4>
              <p className="text-xs text-muted truncate">Hey, is the calculator still available?</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">2h ago</span>
          </div>
        </div>

        <div className="border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-success/10 rounded-full h-9 w-9 flex items-center justify-center text-success font-semibold text-sm">
              SC
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm">Sam Chen</h4>
              <p className="text-xs text-muted truncate">Thanks for the textbook! Great condition.</p>
            </div>
            <span className="text-xs text-muted whitespace-nowrap">1d ago</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onStartChat('user-123')}
        className="w-full mt-4 flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 text-sm font-medium text-gray-700"
      >
        Start New Chat →
      </button>
    </div>
  );
};

export default MessagingPlaceholder;
