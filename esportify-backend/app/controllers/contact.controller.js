const transporter = require('../config/mailer');

exports.sendContactEmail = async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ error: "Email et message sont requis" });
    }

    const mailOptionsSupport = {
        from: email,
        to: 'contact.esportify@gmail.com',
        subject: 'Nouveau message de contact',
        text: `De: ${email}\nMessage: ${message}`,
    };


    const mailOptionsUser = {
        from: 'contact.esportify@gmail.com',
        to: email,
        subject: 'Confirmation de réception - Esportify',
        text:`
                Merci pour votre message !
                
                    Nos équipes traitent votre demande. Nous vous répondrons dans les plus brefs délais.
                
                Cordialement,
                L'équipe Esportify
        `,
    };

    try {
    
        await transporter.sendMail(mailOptionsSupport);
    
        await transporter.sendMail(mailOptionsUser);
    
        res.status(200).json({ message: 'Emails envoyés avec succès !' });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'envoi des emails" });
    }
    
};