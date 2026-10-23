import React, { useState } from 'react';
import { Mail, Trash2, Clock, User, ShieldCheck } from 'lucide-react';
import { Item, type ItemStatus } from '../types';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onRequestBorrow?: (id: string) => void;
  deletingId?: string | null;
  showRequestButtons?: boolean;
}

/* ── Status badge config ── */
const STATUS_CONFIG: Record<ItemStatus, { label: string; classes: string; dot: string }> = {
  available: {
    label: 'Available',
    classes: 'bg-success/10 text-success border-success/20',
    dot: 'bg-success',
  },
  reserved: {
    label: 'Reserved',
    classes: 'bg-warning/10 text-warning border-warning/20',
    dot: 'bg-warning',
  },
  active: {
    label: 'Active',
    classes: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
};

const StatusBadge: React.FC<{ status: ItemStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${config.classes}`}
      aria-label={`Status: ${config.label}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
};

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onDelete,
  onRequestBorrow,
  deletingId,
  showRequestButtons = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEmailValid =
    item.ownerEmail &&
    typeof item.ownerEmail === 'string' &&
    item.ownerEmail.trim() !== '' &&
    item.ownerEmail.includes('@');
  const isCurrentlyDeleting = deletingId === item.id;
  const status: ItemStatus = item.status ?? 'available';

  const handleRequestBorrow = () => {
    if (onRequestBorrow) {
      onRequestBorrow(item.id);
    } else {
      const subject = encodeURIComponent(
        `CampusLend: Request to borrow ${item.title}`,
      );
      const body = encodeURIComponent(
        `Hi, I saw your listing for ${item.title} on CampusLend. I'm interested in borrowing it. Please let me know if it's still available and we can arrange pickup/delivery.`,
      );
      const mailtoLink = `mailto:${item.ownerEmail}?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <article
      className={`
        glass bg-white rounded-3xl p-6 shadow-medium hover:shadow-elevated
        transition-all duration-300 border border-gray-100 relative overflow-hidden
        ${isCurrentlyDeleting ? 'opacity-70 pointer-events-none scale-[0.98]' : 'hover:-translate-y-1 hover:scale-[1.02]'}
      `}
      aria-label={`Item: ${item.title}`}
    >
      {/* Decorative gradient orb for premium feel */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

      <div className="space-y-5 relative z-10">
        <div className="flex flex-col space-y-4">

          <div className="flex justify-between items-start gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase px-3.5 py-1.5 rounded-full">
              {item.category}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={status} />
              {isEmailValid && (
                <div
                  className="flex items-center text-success/80 bg-success/10 px-2 py-1 rounded-md"
                  title="Verified University Student"
                >
                  <ShieldCheck className="h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 truncate tracking-tight">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="pt-2 space-y-2.5 text-sm font-medium text-gray-600">
            <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <span>{item.maxBorrowTime} max</span>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <User className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <span>{isEmailValid ? item.ownerEmail.split('@')[0] : 'Contact'}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 w-full">
            {showRequestButtons && isEmailValid && !isCurrentlyDeleting ? (
              <button
                onClick={handleRequestBorrow}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 px-5 rounded-xl hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                Request to Borrow
              </button>
            ) : !showRequestButtons ? null : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 font-semibold py-3.5 px-5 rounded-xl cursor-not-allowed"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                {isCurrentlyDeleting ? 'Processing...' : 'Contact Unavailable'}
              </button>
            )}

            {!showDeleteConfirm && !isCurrentlyDeleting ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-100 hover:border-error/30 text-gray-500 hover:text-error hover:bg-error/5 font-semibold py-3 px-5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-error/10"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                Remove Listing
              </button>
            ) : null}

            {showDeleteConfirm && !isCurrentlyDeleting ? (
              <div className="p-3 bg-error/5 rounded-xl border border-error/20 space-y-3 animate-scale-in" role="alertdialog" aria-label="Confirm deletion">
                <p className="text-sm text-error font-medium text-center">Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      onDelete(item.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-error hover:bg-error/90 text-white font-medium py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-error/20"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2 px-3 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}

            {isCurrentlyDeleting && (
              <div className="w-full flex items-center justify-center py-3" role="status" aria-live="polite">
                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
                <span className="text-gray-500 font-medium">Removing...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
