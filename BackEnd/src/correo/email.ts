//Requerimos el paquete
import * as nodemailer from "nodemailer";//ASI SE IMPORTA EN TS
//import { nodemailer } from "nodemailer";
//const nodemailer = require('nodemailer');
import { google } from "googleapis";


const CLIENT_ID = '304122663052-74ktc04obvdpepe9bj6av56sm2ut86nc.apps.googleusercontent.com';
const CLIENT_SECRET = 'jmhTZZxeYeZrOgR1tpmP5jzY';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//0427g5CecTNTvCgYIARAAGAQSNwF-L9IrgSRO_IDjo9XcvXZEy1_hfcCaKYgyyX5TrWniz7GMA0Yp7EvrkRqaau5YW2BvckgjHmc';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

async function sendMail(){

    try {
        const accesToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'geproys@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accesToken: accesToken
            }
        });

        const mailOptions = {
            from: 'GePROYS 🔥🥵😈 <geproys@gmail.com>',
            to: 'ojuandamian@gmail.com',
            subject: 'Invitacion ',
            text: 'Hello from gmail using API',
            html: '<h1>Te han invitado a participar en un proyecto 😄</h1>',
        };

        const result = transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
}

sendMail().then(result=> console.log('Email sent...', result)).catch((error)=> console.log(error.message));

