<#import "template.ftl" as layout>
<@layout.emailLayout>
${kcSanitize(msg("passwordResetBodyHtml",link, linkExpiration, username, realmName, linkExpirationFormatter(linkExpiration)))?no_esc}
</@layout.emailLayout>
