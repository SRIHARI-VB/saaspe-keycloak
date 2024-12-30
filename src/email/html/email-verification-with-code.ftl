<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("emailVerificationBodyCodeHtml",realmName, code, ttl, username))?no_esc}
</@layout.emailLayout>
