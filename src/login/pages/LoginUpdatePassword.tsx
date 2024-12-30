import { useEffect, useReducer, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import lgImg from "../assets/auth-reset-password.png";
import { EyeOff, Loader2 } from "lucide-react";
import { Eye } from "lucide-react";
import "../shared/ResponsiveStyles.css";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template {...props} displayMessage={messagesPerField.exists("global")} headerNode={msg("updatePasswordTitle")}>
            <div id="kc-form" className="form-container">
                <form
                    id="kc-passwd-update-form"
                    className={kcClsx("kcFormClass")}
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => {
                        setIsSubmitting(true);
                        return true;
                    }}
                >
                    <div className={kcClsx("kcFormGroupClass")}>
                        <div id="kc-header-wrapper" className="flex justify-center">
                            <img src={lgImg} alt="logo" />
                        </div>
                        <div className={kcClsx("kcLabelWrapperClass")}>
                            <label htmlFor="password-new" className={"text-[rgba(138,144,153,1)] font-normal text-base"}>
                                {msg("passwordNew")}
                                <span className="text-red-500 text-base"> *</span>
                            </label>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-new">
                                <input
                                    type="password"
                                    id="password-new"
                                    name="password-new"
                                    className={`py-2 w-full text-base px-4 border rounded-md transition-all duration-200 text-[#29256E] focus:border-[#29256E] focus:border-2 outline-none ${
                                        messagesPerField.existsError("password-new") ? "border-red-500" : ""
                                    }`}
                                    autoFocus
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                />
                            </PasswordWrapper>

                            {messagesPerField.existsError("password") && (
                                <span
                                    id="input-error-password"
                                    className={"text-red-500 text-sm mt-1"}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password"))
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcLabelWrapperClass")}>
                            <label htmlFor="password-confirm" className={"text-[rgba(138,144,153,1)] font-normal text-base"}>
                                {"Confirm Password"}
                                <span className="text-red-500 text-base"> *</span>
                            </label>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-confirm">
                                <input
                                    type="password"
                                    id="password-confirm"
                                    name="password-confirm"
                                    className={
                                        "py-2 w-full text-base px-4 border rounded-md transition-all duration-200 focus:border-[#29256E] focus:border-2 outline-none"
                                    }
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                />
                            </PasswordWrapper>

                            {messagesPerField.existsError("password-confirm") && (
                                <span
                                    id="input-error-password-confirm"
                                    className={"text-red-500 text-sm mt-1"}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password-confirm"))
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <button
                                className={
                                    "bg-[#29256E] w-full h-11 top-11 rounded-md text-white font-medium text-base flex items-center justify-center gap-2"
                                }
                                type="submit"
                                value={"Reset Password"}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{"Updating..."}</span>
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                            {isAppInitiatedAction && (
                                <button
                                    className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                    type="submit"
                                    name="cancel-aia"
                                    value="true"
                                >
                                    {msg("doCancel")}
                                </button>
                            )}
                        </div>
                    </div>
                    <div
                        id="kc-form-options"
                        className={kcClsx("kcFormOptionsClass")}
                        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
                    >
                        <span style={{ fontSize: "14px", color: "#8A9099", fontWeight: "400", lineHeight: "21px" }}>
                            Go back to{" "}
                            <a
                                href={url.loginRestartFlowUrl}
                                style={{ color: "#29256E", textDecoration: "none", fontWeight: "500", fontSize: "16px", lineHeight: "24px" }}
                            >
                                Login
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { kcClsx, i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={"flex items-center gap-2 mt-2"}>
                <input
                    type="checkbox"
                    className={"accent-pink-500 h-4 w-4 !m-0"}
                    id="logout-sessions"
                    name="logout-sessions"
                    value="on"
                    defaultChecked={true}
                />
                <label className="text-[#29256E] text-base font-normal !m-0">{msg("logoutOtherSessions")}</label>
            </div>
        </div>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className={`relative ${kcClsx("kcInputGroup")}`}>
            {children}
            <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer z-[999]"
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? (
                    <Eye size={20} className="text-gray-500 hover:text-gray-700" />
                ) : (
                    <EyeOff size={20} className="text-gray-500 hover:text-gray-700" />
                )}
            </button>
        </div>
    );
}
