import React from "react";
import { Row, Col } from "antd";
import logo from "../assets/logo.svg";

const TermsAndConditions: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-[#e0eaf4] to-[#f7e6ea]">
            <div className="relative flex flex-col items-center max-h-[70vh] overflow-y-auto">
                <div
                    className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-10 z-0"
                    style={{ backgroundImage: `url(${logo})`, backgroundSize: "80%" }}
                ></div>

                <div className="z-10 w-full max-w-4xl mx-auto p-8 max-h-[80vh] overflow-y-auto">
                    <Row gutter={24}>
                        <Col span={24}>
                            <p className="text-[#5E5E5E] text-justify leading-8 text-base">
                                Please read these terms and conditions carefully. By accessing the SaaSPe application, you agree to be bound by the
                                terms and conditions below. SaaSPe reserves the right to alter, amend, and modify these terms and conditions at its
                                sole discretion. All such amendments and modifications will be duly notified on the SaaSPe application. If you are not
                                agreeable to the terms and conditions, we request you not to access the SaaSPe application. By using the information,
                                tools, features, and functionality located on the SaaSPe application, you expressly agree to be bound by this
                                agreement once you register as a member. Therefore, you agree to comply with the terms and conditions outlined in this
                                agreement. SaaSPe advises all visitors and registered members to thoroughly read and save the terms and conditions
                                provided for their services. Please take note of any rules and regulations that may affect your use of the service to
                                ensure a safe and enjoyable experience. Please note that SaaSPe provides services through the SaaSPe application and
                                requires users to be legally able to enter and comply with a legal contract as per the existing laws. You are only
                                allowed to use the SaaSPe application and enter into an agreement if you are legally permitted to do so. If you are
                                not eligible to enter a contract due to your age or any other reason, you are not allowed to use the services provided
                                by the SaaSPe application or enter into this agreement
                            </p>
                        </Col>

                        <Col span={24} className="pt-3">
                            <p className="text-[#5E5E5E] text-justify leading-8 text-base">
                                By accepting this agreement and using our services, you are confirming that you are of legal contracting age. SaaSPe
                                reserves the right to enforce this agreement upon you. This agreement cannot be invalidated by any means. If you are
                                representing any individuals, companies, third parties, or any other entities in any capacity, you confirm that you
                                have the valid authority and right to do so on their behalf. By entering into this agreement, you also confirm that
                                you have the right to bind such individuals, companies, third parties, or any other entities to this agreement. Please
                                ensure that you have the necessary authorization before proceeding with any actions on their behalf. The SaaSPe
                                application provides services specifically for SAAS optimization. It is important to note that the information and
                                guidance provided by the application are not intended to certify, guarantee, warrant, or offer any professional
                                advice. Therefore, you should not rely on the information and materials contained in the application for any purposes
                                other than their intended use. By accessing, browsing, and using the SaaSPe application, you agree that you understand
                                this limited and restricted use. Additionally, you are responsible for determining your specific requirements in all
                                actual matters. You are prohibited from unauthorized access, including misuse of passwords, or posted information on
                                the SaaSPe application. You acknowledge that SaaSPe may disclose and transfer any information that you provide through
                                the SaaSPe application:
                                <br />
                                (i) Our affiliates or information providers <br />
                                (ii) Only with your permission <br />
                                (iii) If required by law <br />
                                By using and providing information on the SaaSPe application, you agree to allow us to transfer, transmit, or process
                                your information to any country across the globe as we consider necessary or appropriate. This means that your
                                information may be processed in countries with data protection laws that differ from those in your own country. You
                                acknowledge and agree that your use of the SaaSPe application may be monitored, tracked, and recorded. By using the
                                application, you consent to such monitoring, tracking, and recording. Please make sure to stay updated with the latest
                                version of the terms and conditions posted on the SaaSPe application every time you visit. By accessing the SaaSPe
                                application or using our services, you automatically agree to comply with the revised terms and conditions. Any
                                updates will be posted on the SaaSPe application. The terms mentioned here refer to the agreement between our company
                                and the client. This involves the offer, acceptance, and payment necessary to provide our SaaSPe services and fulfil
                                the client's requirements. All the words used in singular, plural, capitalization, and genderspecific pronouns are
                                interchangeable and refer to the same thing.
                            </p>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
};

export default TermsAndConditions;
