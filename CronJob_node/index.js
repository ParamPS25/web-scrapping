// const cron = require('node-cron');

// cron.schedule('*/5 * * * * *', () => {
//   console.log('running a task every 5 seconds');
// });

// console.log('Cron job started');

// *    *    *    *    *
// |    |    |    |    |
// |    |    |    |    └── Day of the Week (0 - 7) (Sunday = 0 or 7)
// |    |    |    └──── Month (1 - 12)
// |    |    └──────── Day of the Month (1 - 31)
// |    └──────────── Hour (0 - 23)
// └──────────────── Minute (0 - 59)

// * * * * * → Runs every minute
// 0 * * * * → Runs every hour
// 0 12 * * * → Runs at 12:00 PM every day
// 0 0 * * 1 → Runs every Monday at midnight


require('dotenv').config();
const cron = require('node-cron');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const sendMail = async () => {
    const mailoptions = {
        from: process.env.EMAIL,
        to: `prince6358patel@gmail.com`,
        subject: 'Test Email',
        text: 'Hello World'
    }

    try {
        await transporter.sendMail(mailoptions);
        console.log('Email sent');
    } catch (error) {
        console.log(error);
    }
}

cron.schedule('*/15 * * * * *', () => {
    console.log('sending mail every 15 seconds');
    sendMail();
});

// console.log('Email cron job scheduled. It will run every day at 9 AM.');
console.log('Email cron job scheduled. It will run every 15 seconds.');