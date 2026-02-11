import { toast } from "react-toastify";
import { create } from "zustand";

import { useUserStore } from "./userStore";
import { ChatStoreState } from "./types";

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  user: null,
  isChatPinned: false,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeBlocked: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
  changePinned: () => {
    set((state) => ({
      ...state,
      isChatPinned: !state.isChatPinned,
    }));
  },
  changeChat: ({ chatId, userInfo }) => {
    const currentUser = useUserStore.getState().currentUser;

    // Guard clause
    if (currentUser === null) return toast.error("Couldn't get the user data");

    // Check if chat is pinned
    const isPinned = currentUser.pinned.includes(userInfo.id);

    if (userInfo.blocked.includes(currentUser.id)) {
      // Check if other user is blocked current user
      return set({
        chatId,
        user: userInfo,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
        isChatPinned: isPinned,
      });
    }

    // Check if receiver is blocked
    if (currentUser.blocked.includes(userInfo.id)) {
      return set({
        chatId,
        user: userInfo,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
        isChatPinned: isPinned,
      });
    }

    // If no one is blocked
    return set({
      chatId,
      user: userInfo,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      isChatPinned: isPinned,
    });
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
      isChatPinned: false,
    });
  },
}));
