import { Row, Col, Typography, Image } from "antd";
import ThanksCardSvg from "../assets/thanking-vector.svg";

import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

type ThanksCardProps = PageProps<Extract<KcContext, { pageId: "thanks-card.ftl" }>, I18n>;
export const ThanksCard = (props: ThanksCardProps) => {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode="Thank You!">
            <Row className="flex flex-col gap-4 mb-4">
                <Col span={24} className="flex justify-center">
                    <Image src={ThanksCardSvg} preview={false} />
                </Col>

                <Col span={24} className="flex justify-center">
                    <Typography.Text className={"text-[#29256E] text-lg"}>
                        Your details has been submitted &amp; this is currently under verification. You will receive an email once it is verified.
                    </Typography.Text>
                </Col>
            </Row>
        </Template>
    );
};
