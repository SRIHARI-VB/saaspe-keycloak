import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Eye, Loader2 } from "lucide-react";
import { EyeOff } from "lucide-react";
import { Checkbox } from "antd";
import "../shared/ResponsiveStyles.css";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const SocialIcons = {
        microsoft: (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_5772_102701)">
                    <path d="M9.51115 9.50724H0.0703125V0.0664062H9.51115V9.50724Z" fill="#F1511B" />
                    <path d="M19.933 9.50724H10.4922V0.0664062H19.933V9.50724Z" fill="#80CC28" />
                    <path d="M9.51115 19.933H0.0703125V10.4922H9.51115V19.933Z" fill="#00ADEF" />
                    <path d="M19.933 19.933H10.4922V10.4922H19.933V19.933Z" fill="#FBBC09" />
                </g>
                <defs>
                    <clipPath id="clip0_5772_102701">
                        <rect width="20" height="20" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),
        github: (
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                <path
                    fill="#24292f"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10v76c0 5.523 4.477 10 10 10h76c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10H10zm36.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                />
            </svg>
        )
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={"Login"}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container" className="form-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={<></>}
        >
            <div id="kc-form" className="form-container">
                <div id="kc-form-wrapper" className="space-y-4">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                            className="space-y-4 w-full"
                        >
                            {!usernameHidden && (
                                <div className={"flex flex-col "}>
                                    <label htmlFor="username" className="text-[rgba(138,144,153,1)] font-normal text-base">
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                        <span className="text-red-500 text-base"> *</span>
                                    </label>
                                    <input
                                        tabIndex={2}
                                        id="username"
                                        className={`auth-input-field ${messagesPerField.existsError("username", "password") ? "error" : ""}`}
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                    {messagesPerField.existsError("username", "password") && (
                                        <span
                                            id="input-error"
                                            className={"text-red-500 text-sm mt-1"}
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            <div className={"flex flex-col"}>
                                <label htmlFor="password" className="text-[rgba(138,144,153,1)] font-normal text-base">
                                    {msg("password")}
                                    <span className="text-red-500 text-base"> *</span>
                                </label>

                                <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                    <input
                                        tabIndex={3}
                                        id="password"
                                        className={`py-2 w-full text-base px-4 border rounded-md transition-all duration-200 text-[#29256E] focus:border-[#29256E] focus:border-2 outline-none ${
                                            messagesPerField.existsError("username", "password") ? "border-red-500" : ""
                                        }`}
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                </PasswordWrapper>
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        className={"text-red-500 text-sm mt-1"}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )}
                            </div>

                            <div className={"font-normal text-base"}>
                                <div id="kc-form-options" className="flex items-center justify-between">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="flex gap-2 items-center">
                                            <Checkbox id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} tabIndex={5} />
                                            <span className="text-base">{msg("rememberMe")}</span>
                                        </div>
                                    )}

                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a
                                                className={
                                                    "text-[#EF406A] font-normal text-base focus:outline-none focus-visible:ring-0 outline-none focus-visible:ring-offset-2"
                                                }
                                                tabIndex={6}
                                                href={url.loginResetCredentialsUrl}
                                            >
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <button
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className="auth-button primary"
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                >
                                    {isLoginButtonDisabled ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Logging In...</span>
                                        </>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <div className="relative flex items-center w-full">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-2 text-xs md:text-sm text-[#8A9099] whitespace-nowrap">OR LOGIN WITH BELOW OPTIONS</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>

                                {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                                    <div id="kc-social-providers" className="w-full">
                                        <ul className="flex flex-col gap-2 w-full">
                                            {social.providers.map((...[p]) => (
                                                <li key={p.alias} className="w-full">
                                                    <a
                                                        id={`social-${p.alias}`}
                                                        className="flex items-center justify-center gap-2 p-2 border border-[#8A9099] !no-underline !hover:no-underline hover:border-[#29256E] rounded-md hover:bg-gray-50 w-full"
                                                        type="button"
                                                        href={p.loginUrl}
                                                    >
                                                        {SocialIcons[p.alias as keyof typeof SocialIcons] || (
                                                            <div className="w-6 h-6 bg-gray-200 rounded-full" /> // Fallback icon
                                                        )}
                                                        <span
                                                            className="!no-underline !hover:no-underline text-base text-[#8A9099]"
                                                            dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                                        ></span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="text-base text-center text-gray-600">
                                    Don't have an account?{" "}
                                    <a href={url.registrationUrl} className="text-[#EF406A]">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
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
