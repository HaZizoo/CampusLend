/**
 * Shared type definitions for CampusLend.
 */

/** Status of an item on the lending platform. */
export type ItemStatus = 'available' | 'reserved' | 'active';

/** An item available for borrowing on the platform. */
export interface Item {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  ownerEmail: string;
  maxBorrowTime: string;
  status?: ItemStatus;
}

/** Payload for creating a new item (no ID yet). */
export interface NewItemPayload {
  title: string;
  description: string;
  category: string;
  ownerEmail: string;
  maxBorrowTime: string;
  status?: ItemStatus;
}

/** Toast message types used for user feedback. */
export type MessageType = 'success' | 'error';
