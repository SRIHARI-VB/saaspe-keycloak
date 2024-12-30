<#import "template.ftl" as layout>
<@layout.emailLayout>
<div style="text-align: center; margin-top: 20px">
    <p style="font-size: 24px; font-weight: 500; text-align: center; color: #7c8086">Hi, ${username}</p>
    <div style="display: flex; flex-direction: column; gap: 16px; margin: 18px 0">
        <p><a href="${link}" style="font-size: 22px; font-weight: 500; text-align: center; color: white; background-color: #29256E; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Temporary Password</a></p>
        <p style="font-size: 14px; font-weight: 400; text-align: center; color: rgba(138,144,153,1)">A temporary password has been generated for your SaasPe account. Please use this temporary password to set your new password.</p>
        <p style="font-size: 28px; font-weight: 600; text-align: center; color: #29256E"; ><b style="letter-spacing: 2px">${tempPassword}</b></p>
    </div>
</div>
</@layout.emailLayout>
