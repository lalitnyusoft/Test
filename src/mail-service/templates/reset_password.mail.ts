require('dotenv').config();
const { FRONEND_RESET_PASSWORD } = process.env;
export const resetPasswordTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- So that mobile will display zoomed in -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- enable media queries for windows phone 8 -->
    <meta name="format-detection" content="telephone=no">
    <!-- disable auto telephone linking in iOS -->
    <title>GMX</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }
        table {
            border-spacing: 0;
        }
        table td {
            border-collapse: collapse;
        }
        .ExternalClass {
            width: 100%;
        }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
            line-height: 100%;
        }
        .ReadMsgBody {
            width: 100%;
            background-color: #ebebeb;
        }
        table {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        .yshortcuts a {
            border-bottom: none !important;
        }
        .soc {
            margin: 0px;
            padding: 0px;
            display: block;
            text-align: center;
        }
        .soc ul {
            margin: 0px;
            padding: 0px;
            float: left;
        }
        .soc ul li {
            list-style: none;
            float: left;
            margin: 0px 9px 0px 0px;
        }
        @media screen and (max-width: 599px) {
            .force-row, .container {
                width: 100% !important;
                max-width: 100% !important;
            }
        }
        @media screen and (max-width: 400px) {
            .container-padding {
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
            .col img {
                width: 100% !important;
            }
        }
        .ios-footer a {
            color: #aaaaaa !important;
            text-decoration: underline;
        }
        @media screen and (max-width: 599px) {
            .col {
                width: 100% !important;
                border-top: 1px solid #eee;
                padding-bottom: 0 !important;
            }
            .cols-wrapper {
                padding-top: 18px;
            }
            .img-wrapper {
                float: right;
                max-width: 40% !important;
                height: auto !important;
                margin-left: 12px;
            }
            .subtitle {
                margin-top: 0 !important;
            }
        }
        @media screen and (max-width: 400px) {
            .cols-wrapper {
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            .content-wrapper {
                padding-left: 12px !important;
                padding-right: 12px !important;
            }
        }
    </style>
</head>
<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"> 
    <table border="0" width="80%" cellpadding="0" cellspacing="0" bgcolor="#24140e" style="margin: auto;">
        <tr>
            <td align="center" valign="top" bgcolor="#24140e" style="background-color:#fff;"><!-- 600px container (white background) -->
                <table border="0" cellpadding="0" cellspacing="0" class="container" style="width:100%;border: solid 1px #d6d4d4;">
                    <tr>
                        <td class="content" align="left" style="padding-top:0px;padding-bottom:12px;background-color:#25231F;"><table border="0" cellpadding="0" cellspacing="0" class="force-row" style="width:100%;">
                            <tr>
                                <td align="center" valign="middle" class="content-wrapper" style="padding-left:24px;padding-right:24px"><br>
                                    <a href="http://gmx.nyusoft.in/"><img width="150px" src="http://gmx.nyusoft.in/assets/images/logo.png"/></a>
                                </tr>
                            </table></td>
                        </tr>
                        <tr>
                            <td class="content" align="left" style="padding-top:0px;background-color:#fff"> 

                                <table border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 100%;    border-bottom: solid 1px #ccc;">                                   
                                        <tr>
        <td class="cols-wrapper" style="padding-left:12px;padding-right:12px"><!--[if mso]>
         <table border="0" width="576" cellpadding="0" cellspacing="0" style="width: 576px;">
            <tr>
               <td width="192" style="width: 192px;" valign="top">
               <![endif]-->
               <table border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 100%;">
                <tr>
                    <td class="row" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><table border="0" cellpadding="0" cellspacing="0" style="width:100%;">
                        <tr>
                            <td class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:22px;font-weight:400;color:#333;padding-bottom:30px; text-align: left;">
                                <p style="font-size:30px;margin:0;max-width:450px;padding-bottom:20px;text-align:left;text-transform:uppercase">Password Reset</p>
                                <p style="font-size:16px;margin:0;max-width:450px;padding-bottom:20px;text-align:left;">Seems like you forgot your password for GMX.</p>
                                <p style="font-size:16px;margin:0;max-width:450px;padding-bottom:20px;text-align:left;">If this is true, click below to reset your password.</p>
                                <p style="font-size:16px;margin:0;max-width:450px;padding-bottom:20px;text-align:left;">If you did not forgot your password you can safely ignore this email.</p>                            
                            </td>
                        </tr>
                        <tr style="margin:0;text-align:center; padding-top:40px">
                            <td style="margin:0">
                                <a target="_blank" rel="noopener noreferrer" href="${FRONEND_RESET_PASSWORD}?token=***VERIFICATION_TOKEN***" style="text-decoration: none">
                                    <div style="border-left-color:transparent;border-top-width:0;box-sizing:border-box;height:0;margin:0;width:80%"></div>
                                    <div style="height:16px;margin:0;text-align:center"><span style="color:#fff;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:14px!important;letter-spacing:1px;line-height:1em;margin:0;text-transform:uppercase;background:linear-gradient(270deg, rgb(61, 67, 145) 0%, rgb(165, 107, 0) 0%, rgb(255, 201, 77) 24%, rgb(255, 201, 77) 55%, rgb(179, 117, 0) 98%);padding:12px 14px;transform:skewX(-12deg);color:#fff;font-weight:bold">Reset My Password</span></div>
                                    <div style="border-bottom-width:0;border-right-color:transparent;box-sizing:border-box;height:0;margin:0;width:80%"></div>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-family: Helvetica, Arial, sans-serif;font-size: 14px;line-height: 22px;font-weight: 400;color: #333; padding-bottom: 30px;text-align: left;"><br>Thank You</td>
                        </table>
                        <br></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
