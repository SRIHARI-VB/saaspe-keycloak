import { useState } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button, Modal } from "antd";
import TermsAndConditions from "./TermsAndConditions";
import { Loader2 } from "lucide-react";

type IdpReviewUserProfileProps = PageProps<Extract<KcContext, { pageId: "idp-review-user-profile.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function IdpReviewUserProfile(props: IdpReviewUserProfileProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url, messagesPerField } = kcContext;

    const [isFomSubmittable, setIsFomSubmittable] = useState(false);
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

        form.submit();
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
            headerNode={msg("loginIdpReviewProfileTitle")}
        >
            <form id="kc-idp-review-profile-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post" onSubmit={handleSubmit}>
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    onIsFormSubmittableValueChange={setIsFomSubmittable}
                    kcClsx={kcClsx}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <TermsAcceptance
                                areTermsAccepted={areTermsAccepted}
                                errorMessage={customErrorMessage}
                                setAreTermsAccepted={setAreTermsAccepted}
                                setCustomErrorMessage={setCustomErrorMessage}
                            />
                        </div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <button
                            disabled={isSubmitting || !isFomSubmittable || !areTermsAccepted}
                            className={
                                "bg-[#29256E] w-full h-11 top-11 rounded-md text-white font-medium text-base flex items-center justify-center gap-2"
                            }
                            type="submit"
                            value={"Update Profile"}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </div>
            </form>
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
                <div className="flex w-full items-center gap-2">
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
                    <label htmlFor="termsAccepted" className={"text-base flex gap-1 font-normal !m-0"}>
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
