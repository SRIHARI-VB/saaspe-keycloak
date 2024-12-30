import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Loader2 } from "lucide-react";
import { Button, Modal } from "antd";
import TermsAndConditions from "./TermsAndConditions";
import "../shared/ResponsiveStyles.css";
import { set } from "react-hook-form";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } = kcContext;

    const { msg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const [customErrorMessage, setCustomErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!areTermsAccepted) {
            setCustomErrorMessage("Please accept the terms and conditions.");
            return;
        }

        setIsSubmitting(true);

        const form = e.currentTarget;

        const mobileNumberInput = form.querySelector('input[name="mobileNumber"]') as HTMLInputElement;
        const countryCodeInput = form.querySelector('input[name="countryCode"]') as HTMLInputElement;

        if (mobileNumberInput && countryCodeInput) {
            const fullMobileNumber = `${countryCodeInput.value} ${mobileNumberInput.value}`;

            mobileNumberInput.value = fullMobileNumber;
        }

        form.submit();
    };

    return (
        <Template {...props} displayMessage={messagesPerField.exists("global")} displayRequiredFields={true} headerNode={msg("registerTitle")}>
            <div id="kc-form" className="form-container">
                <form id="kc-register-form" className={kcClsx("kcFormClass")} action={url.registrationAction} method="post" onSubmit={handleSubmit}>
                    <UserProfileFormFields
                        kcContext={kcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                    <TermsAcceptance
                        areTermsAccepted={areTermsAccepted}
                        setAreTermsAccepted={setAreTermsAccepted}
                        errorMessage={customErrorMessage}
                        setCustomErrorMessage={setCustomErrorMessage}
                    />
                    {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                        <div className="form-group">
                            <div className={kcClsx("kcInputWrapperClass")}>
                                <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                            </div>
                        </div>
                    )}
                    <div className={"flex flex-col gap-2"}>
                        {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                            <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                                <button
                                    className={clsx(
                                        kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                        "g-recaptcha"
                                    )}
                                    data-sitekey={recaptchaSiteKey}
                                    data-callback={() => {
                                        (document.getElementById("kc-register-form") as HTMLFormElement).submit();
                                    }}
                                    data-action={recaptchaAction}
                                    type="submit"
                                >
                                    {msg("doRegister")}
                                </button>
                            </div>
                        ) : (
                            <button
                                disabled={isSubmitting || !isFormSubmittable || !areTermsAccepted}
                                className={
                                    "bg-[#29256E] w-full h-11 top-11 rounded-md text-white font-medium text-base flex items-center justify-center gap-2"
                                }
                                type="submit"
                                value={"Sign Up"}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Signing up...</span>
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </button>
                        )}
                        {/* Back to Login */}
                        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                            <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                <div className="text-sm text-[rgba(138,144,153,1)] flex justify-center items-center gap-1">
                                    Go back to
                                    <span>
                                        <span>
                                            <a className="text-[#29256E] font-medium text-base hover:text-[#29256E] " href={url.loginUrl}>
                                                {"Login"}
                                            </a>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Template>
    );
}

function TermsAcceptance({
    areTermsAccepted,
    errorMessage,
    setAreTermsAccepted,
    setCustomErrorMessage
}: {
    errorMessage: string;
    areTermsAccepted: boolean;
    setAreTermsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
    setCustomErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal
                bodyStyle={{ padding: "0px 24px" }}
                title={<div style={{ fontSize: "24px", fontWeight: "bold" }}>Terms & Conditions</div>}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
                width={window.innerWidth < 768 ? "90%" : 900}
            >
                <TermsAndConditions />
            </Modal>

            <div className="flex flex-col">
                <div className="flex items-center gap-2 mt-2 mb-4">
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className={"accent-pink-500 h-4 w-4 !m-0"}
                        checked={areTermsAccepted}
                        onChange={e => {
                            setAreTermsAccepted(e.target.checked);
                            if (e.target.checked) {
                                setCustomErrorMessage("");
                            }
                        }}
                    />
                    <label htmlFor="termsAccepted" className={"text-base font-normal !m-0"}>
                        I accept{" "}
                        <span
                            className="text-[rgba(239,64,106,1)] cursor-pointer"
                            onClick={e => {
                                e.preventDefault();
                                showModal();
                            }}
                        >
                            Terms & Conditions
                        </span>
                    </label>
                </div>
                {errorMessage !== "" && <span className="text-red-500 text-sm mt-1">{errorMessage}</span>}
            </div>
        </>
    );
}
