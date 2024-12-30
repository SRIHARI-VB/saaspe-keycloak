import { useEffect } from "react";
import { message as antMessage } from "antd";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import "./Template.css";
import bgImg from "./assets/auth-bg.png";
import logo from "./assets/auth-logo.png";
import { Loader2 } from "lucide-react";
export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { displayMessage = true, headerNode, documentTitle, bodyClassName, kcContext, i18n, doUseDefaultCss, classes, children } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msgStr } = i18n;

    const { message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    useEffect(() => {
        if (displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction)) {
            switch (message.type) {
                case "success":
                    antMessage.success(message.summary);
                    break;
                case "warning":
                    antMessage.warning(message.summary);
                    break;
                case "error":
                    antMessage.error(message.summary);
                    break;
                case "info":
                    antMessage.info(message.summary);
                    break;
            }
        }
    }, [message, displayMessage, isAppInitiatedAction]);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 animate-spin text-[#29256E]" />
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            {/* Left side for the login image */}
            <div className="auth-split-view">
                <img src={bgImg} alt="Login" className="auth-split-image" />
            </div>

            {/* Right side for the login form */}
            <div className="auth-form-container">
                <div className="auth-form-wrapper">
                    <div className="auth-logo-wrapper">
                        <img src={logo} alt="logo" className="auth-logo" />
                    </div>

                    <div className="auth-form-card">
                        <header>
                            <h1 className="text-[#29256E] font-semibold text-2xl md:text-4xl text-center mb-6">{headerNode}</h1>
                        </header>
                        <div id="kc-content">
                            <div id="kc-content-wrapper">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
