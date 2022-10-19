require('dotenv').config();
const { FRONEND_BASE } = process.env;

export const welcomeMailTemplate = `
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
    <title>MERQARY</title>
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
                                    <a href="http://merqary.nyusoft.in/"><img width="150px" src="http://merqary.nyusoft.in/assets/images/logo.png"/></a>
                                </tr>
                            </table></td>
                        </tr>
                        <tr>
                            <td class="content" align="left" style="padding-top:0px;background-color:#fff"> 

                                <table border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 100%;    border-bottom: solid 1px #ccc;">
                                    <tr>
                                        <td class="content-wrapper" style="padding-left:24px;padding-right:24px"><br>
                                            <div class="title" style="font-family: Helvetica, Arial, sans-serif; font-size: 14px;color: #000;text-align: left;
                                            padding-top: 20px;"> Hi, ***FIRSTNAME***</div></td>
                                        </tr>
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
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">Welcome to <strong>Your Ultimate Trading Card Universe.</strong></p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">We are beyond excited to have you join our passionate community.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">Now we don’t want to take up your time here, because everything you need is inside MERQARY, but we want you to know this MERQARY was conceived and purpose-built by traders and collectors, for traders and collectors,  just like you with the primary goal of making your collecting life QUICKER, CHEAPER and EASIER.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">Our Mission is to help you <strong>Unleash Your Passion For Trading and Collecting!</strong>. And that’s exactly what MERQARY allows you to do.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">There are a wealth of features and benefits on the platform that you will love. And we’re constantly developing and adding to the platform for you.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">And just so we’re clear. You won’t be receiving streams of unnecessary emails (etc) from us, because to be honest we just don’t think that’s cool.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">Anything we do send you from time to time will be focused on making sure you’re getting the most out of MERQARY.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">And as we are still in the Beta phase of launch, we politely ask for your patience if you come across any bugs on the platform.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">Well that’s it. <a target="_blank" rel="noopener noreferrer" href="${FRONEND_BASE}?token=***VERIFICATION_TOKEN***" style="text-decoration: none">Click this link to confirm your email</a>,and get started.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">If you have any issues whatsoever please contact us directly at info@MERQARY.com because we want to know.</p>
                                <p style="font-size:16px;margin:0;padding-bottom:20px;text-align:left;">We’ll see you on the inside and until then, have an absolutely incredible day.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-family: Helvetica, Arial, sans-serif;font-size: 14px;line-height: 22px;font-weight: 400;color: #333; padding-bottom: 30px;text-align: left;"><br>Cheers, </td>
                            <td style="font-family: Helvetica, Arial, sans-serif;font-size: 14px;line-height: 22px;font-weight: 400;color: #333; padding-bottom: 30px;text-align: left;"><br>Brendan and Paul</td>
                            <td style="font-family: Helvetica, Arial, sans-serif;font-size: 14px;line-height: 22px;font-weight: 400;color: #333; padding-bottom: 30px;text-align: left;"><br>MERQARY Founders</td>
                        </table>
                        <br></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
