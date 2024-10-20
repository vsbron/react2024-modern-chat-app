import { create } from "zustand";

import { useUserStore } from "./userStore";
import { ChangeChatProps, ChatStoreState } from "./types";

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeBlocked: () => {
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
  changeChat: ({ chatId, userInfo }: ChangeChatProps) => {
    const currentUser = useUserStore.getState().currentUser;

    // Check if other user is blocked current user
    if (userInfo.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: userInfo,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    }

    // Check if receiver is blocked
    if (currentUser.blocked.includes(userInfo.id)) {
      return set({
        chatId,
        user: userInfo,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    }

    // If no one is blocked
    return set({
      chatId,
      user: userInfo,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
