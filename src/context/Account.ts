import Account from "@/interfaces/Account";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LikeState = {
    accountId: string;
    // closeModal: () => void;
    setAccountId: (content: Account) => void;
};

const store = create<LikeState>()(
    persist((set) => ({
        accountId: "",
        setAccountId: (content: Account) => {
            set((state) => {

                return { accountId: content._id };
            });
        },
    }),
        {
            name: "Storage", // unique name
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        }
    ));

export const useLikeStore = () => store((state) => state);