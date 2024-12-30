/* eslint-disable react-refresh/only-export-components */
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase

import { getKcContextMock } from "./login/KcPageStory";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#29256E]" />
        </div>
    </div>
);

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "login-update-profile.ftl",
        overrides: {}
    });
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? <LoadingScreen /> : <KcPage kcContext={window.kcContext} />}
    </StrictMode>
);

// login-update-password
// login-reset-password   goes to forgot password page
// login-verify-email
