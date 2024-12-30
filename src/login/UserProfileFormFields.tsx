import { useEffect, useReducer, Fragment, useState } from "react";
import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { ChevronDown, Eye, EyeOff, Info } from "lucide-react";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const [showPasswordInfo, setShowPasswordInfo] = useState(false);
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <div
                            className={kcClsx("kcFormGroupClass")}
                            style={{
                                display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined
                            }}
                        >
                            <div className={kcClsx("kcLabelWrapperClass")}>
                                <div className="flex items-center gap-1">
                                    <label htmlFor={attribute.name} className={"text-[rgba(138,144,153,1)] font-normal text-base"}>
                                        {advancedMsg(attribute.displayName ?? "")}
                                    </label>
                                    {attribute.required && <span className="text-red-500 text-base"> *</span>}
                                    {(attribute.name === "password" || attribute.name === "password-confirm") && (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="text-[rgba(138,144,153,1)] hover:text-[#29256E] transition-colors"
                                                onMouseEnter={() => setShowPasswordInfo(true)}
                                                onMouseLeave={() => setShowPasswordInfo(false)}
                                            >
                                                <Info size={16} />
                                            </button>

                                            {showPasswordInfo && (
                                                <div className="absolute z-20 w-72 p-3 bg-white border border-gray-200 rounded-md shadow-lg left-7 top-1/2 -translate-y-1/2">
                                                    <div className="text-base text-[#29256E]">
                                                        Password must contain:
                                                        <ul className="list-disc text-sm text-[rgba(138,144,153,1)] ml-5 mt-1">
                                                            <li>Have at least one capital letter, one lower case letter</li>
                                                            <li>Have at least one special character & number (Ex: Abcd@123)</li>
                                                            <li>Not be same as the email</li>
                                                            <li>Have at least 8 characters</li>
                                                            <li>Not be same as the last three passwords</li>
                                                        </ul>
                                                    </div>
                                                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white transform rotate-45 -translate-y-1/2"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={kcClsx("kcInputWrapperClass")}>
                                {attribute.annotations.inputHelperTextBefore !== undefined && (
                                    <div
                                        className={kcClsx("kcInputHelperTextBeforeClass")}
                                        id={`form-help-text-before-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                    </div>
                                )}
                                <InputFieldByType
                                    attribute={attribute}
                                    valueOrValues={valueOrValues}
                                    displayableErrors={displayableErrors}
                                    dispatchFormAction={dispatchFormAction}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                />
                                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} kcClsx={kcClsx} fieldIndex={undefined} />
                                {attribute.annotations.inputHelperTextAfter !== undefined && (
                                    <div
                                        className={kcClsx("kcInputHelperTextAfterClass")}
                                        id={`form-help-text-after-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                                    </div>
                                )}

                                {AfterField !== undefined && (
                                    <AfterField
                                        attribute={attribute}
                                        dispatchFormAction={dispatchFormAction}
                                        displayableErrors={displayableErrors}
                                        valueOrValues={valueOrValues}
                                        kcClsx={kcClsx}
                                        i18n={i18n}
                                    />
                                )}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n, kcClsx } = props;

    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className={kcClsx("kcFormGroupClass")}
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <div className={kcClsx("kcContentWrapperClass")}>
                                <label id={`header-${attribute.group.name}`} className={"text-[rgba(138,144,153,1)] font-normal text-base"}>
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(groupDisplayDescription);

                            return (
                                <div className={kcClsx("kcLabelWrapperClass")}>
                                    <label id={`description-${attribute.group.name}`} className={kcClsx("kcLabelClass")}>
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }

                        return null;
                    })()}
                </div>
            );
        }
    }

    return null;
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined; kcClsx: KcClsx }) {
    const { attribute, fieldIndex } = props;

    const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

    if (displayableErrors.length === 0) {
        return null;
    }

    return (
        <span
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
            className={"text-red-500 text-sm mt-1"}
            aria-live="polite"
        >
            {displayableErrors
                .filter(error => error.fieldIndex === fieldIndex)
                .map(({ errorMessage }, i, arr) => (
                    <Fragment key={i}>
                        {errorMessage}
                        {arr.length - 1 !== i && <br />}
                    </Fragment>
                ))}
        </span>
    );
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            const inputNode = <InputTag {...props} fieldIndex={undefined} />;

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return (
                    <PasswordWrapper kcClsx={props.kcClsx} i18n={props.i18n} passwordInputId={attribute.name}>
                        {inputNode}
                    </PasswordWrapper>
                );
            }

            return inputNode;
        }
    }
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className={"relative"}>
            {children}
            <button
                type="button"
                className={"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
        </div>
    );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, kcClsx, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;

    const { advancedMsgStr } = i18n;

    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("+91");

    return (
        <div className={attribute.name === "mobileNumber" ? "flex items-center gap-2" : ""}>
            {attribute.name === "mobileNumber" && (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className={`py-2 w-[80px] flex items-center gap-1 px-4 text-base border ${
                            displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined ? "border-red-500" : ""
                        } rounded-md transition-all duration-200 outline-none focus:border-[#29256E] focus:border-2`}
                    >
                        {selectedCountry}
                        <ChevronDown
                            size={20}
                            className={`text-[rgba(123,122,140,0.64)] transition-transform ${isCountryOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {isCountryOpen && (
                        <div className="absolute z-10 w-[80px] mt-1 bg-white border rounded-md shadow-lg">
                            {["+91", "+1", "+44", "+61"].map(code => (
                                <button
                                    key={code}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCountry(code);
                                        setIsCountryOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-base text-left hover:bg-[#29256E]/10 rounded-md transition-colors"
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    )}
                    <input type="hidden" name="countryCode" value={selectedCountry} />
                </div>
            )}
            <input
                type={(() => {
                    const { inputType } = attribute.annotations;

                    if (inputType?.startsWith("html5-")) {
                        return inputType.slice(6);
                    }

                    return inputType ?? "text";
                })()}
                id={attribute.name}
                name={attribute.name}
                value={(() => {
                    if (fieldIndex !== undefined) {
                        assert(valueOrValues instanceof Array);
                        return valueOrValues[fieldIndex];
                    }

                    assert(typeof valueOrValues === "string");

                    return valueOrValues;
                })()}
                className={`py-2 w-full text-base px-4 border rounded-md mt-1 transition-all duration-200 focus:border-[#29256E] focus:border-2 outline-none ${
                    displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined ? "border-red-500" : ""
                }`}
                aria-invalid={displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined}
                disabled={attribute.readOnly}
                autoComplete={attribute.autocomplete}
                placeholder={
                    attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
                }
                pattern={attribute.annotations.inputTypePattern}
                size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
                maxLength={
                    attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)
                }
                minLength={
                    attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)
                }
                max={attribute.annotations.inputTypeMax}
                min={attribute.annotations.inputTypeMin}
                step={attribute.annotations.inputTypeStep}
                {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
                onChange={event =>
                    dispatchFormAction({
                        action: "update",
                        name: attribute.name,
                        valueOrValues: (() => {
                            if (fieldIndex !== undefined) {
                                assert(valueOrValues instanceof Array);

                                return valueOrValues.map((value, i) => {
                                    if (i === fieldIndex) {
                                        return event.target.value;
                                    }

                                    return value;
                                });
                            }

                            return event.target.value;
                        })()
                    })
                }
                onBlur={() =>
                    dispatchFormAction({
                        action: "focus lost",
                        name: attribute.name,
                        fieldIndex: fieldIndex
                    })
                }
            />
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);

                const values = valueOrValues;

                return (
                    <>
                        <FieldErrors attribute={attribute} kcClsx={kcClsx} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </div>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;

    const { msg } = i18n;

    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });

    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <>
            {hasRemove && (
                <>
                    <button
                        id={`kc-remove${idPostfix}`}
                        type="button"
                        className="pf-c-button pf-m-inline pf-m-link"
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </button>
                    {hasAdd ? <>&nbsp;|&nbsp;</> : null}
                </>
            )}
            {hasAdd && (
                <button
                    id={`kc-add${idPostfix}`}
                    type="button"
                    className="pf-c-button pf-m-inline pf-m-link"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </button>
            )}
        </>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, i18n, valueOrValues } = props;

    const { classDiv, classInput, classLabel, inputType } = (() => {
        const { inputType } = attribute.annotations;

        assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

        switch (inputType) {
            case "select-radiobuttons":
                return {
                    inputType: "radio",
                    classDiv: kcClsx("kcInputClassRadio"),
                    classInput: kcClsx("kcInputClassRadioInput"),
                    classLabel: kcClsx("kcInputClassRadioLabel")
                };
            case "multiselect-checkboxes":
                return {
                    inputType: "checkbox",
                    classDiv: kcClsx("kcInputClassCheckbox"),
                    classInput: kcClsx("kcInputClassCheckboxInput"),
                    classLabel: kcClsx("kcInputClassCheckboxLabel")
                };
        }
    })();

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;

            if (inputOptionsFromValidation === undefined) {
                break walk;
            }

            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

            if (validator === undefined) {
                break walk;
            }

            if (validator.options === undefined) {
                break walk;
            }

            return validator.options;
        }

        return attribute.validators.options?.options ?? [];
    })();

    return (
        <>
            {options.map(option => (
                <div key={option} className={classDiv}>
                    <input
                        type={inputType}
                        id={`${attribute.name}-${option}`}
                        name={attribute.name}
                        value={option}
                        className={classInput}
                        aria-invalid={props.displayableErrors.length !== 0}
                        disabled={attribute.readOnly}
                        checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                        onChange={event =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: (() => {
                                    const isChecked = event.target.checked;

                                    if (valueOrValues instanceof Array) {
                                        const newValues = [...valueOrValues];

                                        if (isChecked) {
                                            newValues.push(option);
                                        } else {
                                            newValues.splice(newValues.indexOf(option), 1);
                                        }

                                        return newValues;
                                    }

                                    return event.target.checked ? option : "";
                                })()
                            })
                        }
                        onBlur={() =>
                            dispatchFormAction({
                                action: "focus lost",
                                name: attribute.name,
                                fieldIndex: undefined
                            })
                        }
                    />
                    <label
                        htmlFor={`${attribute.name}-${option}`}
                        className={`${classLabel}${attribute.readOnly ? ` ${kcClsx("kcInputClassRadioCheckboxLabelDisabled")}` : ""}`}
                    >
                        {inputLabel(i18n, attribute, option)}
                    </label>
                </div>
            ))}
        </>
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, kcClsx, displayableErrors, valueOrValues } = props;

    assert(typeof valueOrValues === "string");

    const value = valueOrValues;

    return (
        <textarea
            id={attribute.name}
            name={attribute.name}
            className={kcClsx("kcInputClass")}
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
            rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
            maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
            value={value}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;
    const [isOpen, setIsOpen] = useState(false);

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;
            if (inputOptionsFromValidation === undefined) break walk;
            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];
            if (validator?.options === undefined) break walk;
            return validator.options;
        }
        return attribute.validators.options?.options ?? [];
    })();

    const selectedValue = typeof valueOrValues === "string" ? valueOrValues : valueOrValues[0] || "";

    return (
        <div className="relative mt-1">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`py-2 w-full flex gap-1 items-center text-left text-base px-4 border rounded-md transition-all duration-200 focus:border-[#29256E] focus:border-2 outline-none ${
                    displayableErrors.length !== 0 ? "border-red-500" : ""
                }`}
            >
                {selectedValue || `Select ${attribute.displayName}`}
                <ChevronDown
                    size={20}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(123,122,140,0.64)] transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />{" "}
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[rgba(123,122,140,0.64)] rounded-md shadow-lg">
                    {options.map(option => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                dispatchFormAction({
                                    action: "update",
                                    name: attribute.name,
                                    valueOrValues: option
                                });
                                dispatchFormAction({
                                    action: "focus lost",
                                    name: attribute.name,
                                    fieldIndex: undefined
                                });
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-base text-left hover:bg-[#29256E]/10 rounded-md transition-colors"
                        >
                            {inputLabel(i18n, attribute, option)}
                        </button>
                    ))}
                </div>
            )}

            <select name={attribute.name} value={valueOrValues} onChange={() => {}} className="hidden" aria-hidden="true">
                <option value=""></option>
                {options.map(option => (
                    <option key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </option>
                ))}
            </select>
        </div>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;

    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;

        return advancedMsg(inputOptionLabels[option] ?? option);
    }

    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }

    return option;
}
