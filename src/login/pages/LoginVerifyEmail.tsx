import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import lgImg from "../assets/auth-reset-password.png";
import "../shared/ResponsiveStyles.css";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <p className="instruction font-normal text-base">
                    {msg("emailVerifyInstruction2")}
                    <br />
                    <a href={url.loginAction} className="text-[#29256E] font-normal text-base outline-none">
                        {msg("doClickHere")}
                    </a>
                    &nbsp;
                    {msg("emailVerifyInstruction3")}
                </p>
            }
        >
            <div id="kc-header-wrapper" className="flex justify-center">
                <img src={lgImg} alt="logo" />
            </div>
            <p className="text-base font-normal text-[#7B7A8C]">
                {
                    "We have sent you a verification email to the registered email address. Please click on the verify button in the email to reset password."
                }
            </p>
        </Template>
    );
}
