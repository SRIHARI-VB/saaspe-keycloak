import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import lgImg from "../assets/auth-reset-password.png";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import "../shared/ResponsiveStyles.css";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <Template {...props} displayMessage={messagesPerField.exists("global")} headerNode={msg("emailForgotTitle")}>
            <div id="kc-form" className="form-container">
                <form
                    id="kc-reset-password-form"
                    className={kcClsx("kcFormClass")}
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => {
                        setIsSubmitting(true);
                        return true;
                    }}
                >
                    <div className={kcClsx("kcFormGroupClass")} style={{ color: "#8A9099", fontWeight: 400, fontSize: 14 }}>
                        <div id="kc-header-wrapper" className="flex justify-center">
                            <img src={lgImg} alt="logo" />
                        </div>
                        <div className={kcClsx("kcLabelWrapperClass")}>
                            <label htmlFor="username" className="text-[rgba(138,144,153,1)] font-normal text-base">
                                {!realm.loginWithEmailAllowed
                                    ? msg("username")
                                    : !realm.registrationEmailAsUsername
                                      ? msg("usernameOrEmail")
                                      : msg("email")}
                                <span className="text-red-500 text-base"> *</span>
                            </label>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={`py-2 w-full text-base px-4 border rounded-md transition-all duration-200 text-[#29256E] focus:border-[#29256E] focus:border-2 outline-none ${
                                    messagesPerField.existsError("username") ? "border-red-500" : ""
                                }`}
                                autoFocus
                                defaultValue={auth.attemptedUsername ?? ""}
                                aria-invalid={messagesPerField.existsError("username")}
                            />
                            {messagesPerField.existsError("username") && (
                                <span
                                    id="input-error-username"
                                    className={"text-red-500 text-sm mt-1"}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("username"))
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <button
                                className={
                                    "bg-[#29256E] w-full h-11 top-11 rounded-md text-white font-medium text-base flex items-center justify-center gap-2"
                                }
                                type="submit"
                                value={msgStr("doSubmit")}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{"Resetting..."}</span>
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </div>
                        <div
                            id="kc-form-options"
                            className={kcClsx("kcFormOptionsClass")}
                            style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
                        >
                            <span style={{ fontSize: "14px", color: "#8A9099", fontWeight: "400", lineHeight: "21px" }}>
                                Go back to{" "}
                                <a href={url.loginUrl} className="text-[#29256E] text-base font-medium">
                                    Login
                                </a>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </Template>
    );
}
