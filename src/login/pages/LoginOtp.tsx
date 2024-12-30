import { useState, useRef } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import lgImg from "../assets/auth-reset-password.png";
import { Loader2 } from "lucide-react";
import "../shared/ResponsiveStyles.css";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField } = kcContext;

    const { msg } = i18n;

    const handleOtpChange = (index: number, value: string) => {
        // Only take the last character if more than one character is entered
        const sanitizedValue = value.slice(-1);

        // Handle single digit input and deletion
        const newOtp = [...otp];
        newOtp[index] = sanitizedValue;
        setOtp(newOtp);

        // If inputting a digit
        if (sanitizedValue !== "") {
            // Find the first empty input field starting from the current index
            const firstEmptyIndex = newOtp.findIndex((digit, idx) => digit === "" && idx >= index);
            if (firstEmptyIndex !== -1) {
                // If there's an empty field after or at current position, focus on it
                inputRefs.current[firstEmptyIndex]?.focus();
            } else if (index < 5) {
                // If no empty fields after current position, move to next input
                inputRefs.current[index + 1]?.focus();
            }
        }
        // If deleting
        else {
            // Find the first empty input field
            const firstEmptyIndex = newOtp.findIndex(digit => digit === "");
            if (firstEmptyIndex !== -1) {
                // Focus on the first empty field
                inputRefs.current[firstEmptyIndex]?.focus();
            } else if (index > 0) {
                // If no empty fields, move to previous input
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (pastedData) {
            const newOtp = [...otp];
            pastedData.split("").forEach((digit, i) => {
                if (index + i < 6) {
                    newOtp[index + i] = digit;
                }
            });
            setOtp(newOtp);

            const nextEmptyIndex = newOtp.findIndex((digit, i) => !digit && i >= index);
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus();
            } else {
                inputRefs.current[Math.min(index + pastedData.length, 5)]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <Template {...props} displayMessage={messagesPerField.exists("global")} headerNode={msg("doLogIn")}>
            <div id="kc-form" className="form-container">
                <form
                    id="kc-otp-login-form"
                    className={kcClsx("kcFormClass")}
                    action={url.loginAction}
                    method="post"
                    onSubmit={() => {
                        setIsSubmitting(true);
                        return true;
                    }}
                >
                    <div className="flex flex-col gap-4">
                        <p className="text-base font-normal text-[#7B7A8C] text-center">
                            {
                                "We have sent you a verification email to the registered email address. Please click on the verify button in the email to reset password."
                            }
                        </p>
                        <div className="flex justify-center">
                            <img src={lgImg} alt="logo" />
                        </div>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcLabelWrapperClass")}>
                            <label htmlFor="otp" className={"text-[rgba(138,144,153,1)] font-normal text-base"}>
                                {msg("loginOtpOneTime")}
                            </label>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input type="hidden" name="otp" value={otp.join("")} />
                            <div className="flex gap-2 justify-between">
                                {[0, 1, 2, 3, 4, 5].map(index => (
                                    <input
                                        key={index}
                                        ref={el => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={otp[index]}
                                        onChange={e => handleOtpChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        onPaste={e => handlePaste(e, index)} // Add paste handler
                                        className="h-[64px] w-[48px] text-center border-[#8A9099] border transition-all duration-200 text-[#29256E] font-normal text-xl focus:border-[#29256E] focus:border hover:border-[#29256E] outline-none rounded-md"
                                        autoFocus={index === 0}
                                        aria-invalid={messagesPerField.existsError("totp")}
                                    />
                                ))}
                            </div>
                            {messagesPerField.existsError("totp") && (
                                <span
                                    id="input-error-otp-code"
                                    className={"text-red-500 text-sm mt-1"}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("totp"))
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                            <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                        </div>
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <button
                                className={
                                    "bg-[#29256E] w-full h-11 top-11 rounded-md text-white font-medium text-base flex items-center justify-center gap-2"
                                }
                                name="login"
                                id="kc-login"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    "Verify"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Back to Login */}
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <div className="flex justify-center items-center gap-1">
                                <a className="text-[#29256E] font-medium text-base hover:text-[#29256E] " href={url.loginUrl}>
                                    {"Resend OTP"}
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Template>
    );
}
