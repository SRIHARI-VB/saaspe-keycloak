import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { message, client, url, skipLink } = kcContext;

    const { msg } = i18n;

    const navigate = useNavigate();

    useEffect(() => {
        navigate(url.loginRestartFlowUrl);
    });

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div id="kc-error-message">
                <p className="instruction font-normal text-base" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                {!skipLink && client !== undefined && client.baseUrl !== undefined && url.loginAction && (
                    <p className="flex items-center gap-2 text-[#29256E] font-normal text-base outline-none">
                        <ArrowLeftIcon className="w-4 h-4" />
                        <a id="backToApplication" href={url.loginAction} className="no-underline">
                            Go back to Login
                        </a>
                    </p>
                )}
            </div>
        </Template>
    );
}
