//vonageConfig.js
// const dotenv = require('dotenv');
// dotenv.config();

// const { Vonage } = require('@vonage/server-sdk');

// console.log('VONAGE_API_KEY:', process.env.VONAGE_API_KEY);
// console.log('VONAGE_API_SECRET:', process.env.VONAGE_API_SECRET);

// const vonage = new Vonage({
//     apiKey: process.env.VONAGE_API_KEY,
//     apiSecret: process.env.VONAGE_API_SECRET
// });

// module.exports = vonage;

//.env
// VONAGE_API_KEY = ed7bc954
// VONAGE_API_SECRET = NckjaS5nZfqkAsx9
// VONAGE_FROM_NUMBER = Vonage APIs

//Контроллер
// const vonage = require('../config/vonageConfig');

// const addPhoneNumber = async (req, res) => {
//     const { phone } = req.body;
//     try {
//         const user = await User.findByPk(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const confirmationCode = generateConfirmationCode();

//         await user.update({ phone, confirmationCode });

//         // Надсилання SMS з підтвердженням
//         const from = process.env.VONAGE_FROM_NUMBER;
//         const to = phone;
//         const text = `A text message sent using the Vonage SMS API ${confirmationCode}`;

//         await vonage.sms.send({ to, from, text })
//             .then(resp => {
//                 console.log('Message sent successfully');
//                 console.log(resp);
//                 res.status(200).json({ message: 'Phone number added. Please check your phone for the confirmation code.' });
//             })
//             .catch(err => {
//                 console.error('Error sending SMS:', err);
//                 res.status(500).json({ message: 'Error sending SMS' });
//             });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

