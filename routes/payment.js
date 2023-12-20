import express from "express";
import Stripe from "stripe";

const router = express.Router();
const SECRET_KEY =
    "sk_test_51OMuoCKyLzVEH8ptLEULllMk1SnKvbMLksmBb76AzQghUwRXlJUKTkr8gdHOIH3Ofe6qygRrSFwcHP28matKiUww003co22Izy";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });

router.post("/create-payment-intent", async (req, res) => {
    try {
        let data = req.body;
        let buyer = data?.buyer
        const allCustomers = await stripe.customers.list()
        let isExistingClient = allCustomers.data?.filter((e) => e?.id == buyer.id)
        if (isExistingClient?.length == 0) {
            const customer = await stripe.customers.create({
                id: buyer?.id,
                name: buyer?.fullName,
                email: buyer?.email,
                phone: buyer?.phone,
            });
        }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: buyer.id },
            { apiVersion: '2020-08-27' }
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data?.totalBill * 100,
            currency: "usd",
            customer: buyer.id,
            payment_method_types: ["card"]
        });
        const clientSecret = paymentIntent?.client_secret;
        res.json({
            paymentIntent: paymentIntent,
            clientSecret: clientSecret,
            ephemeralKey: ephemeralKey.secret,
            customer: buyer,
        });
        res.end();
    } catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
        res.end();
    }
});


router.get("/retrieve-payment-intent", async (req, res) => {
    try {
        let id = req.params.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(id);
        res.json(paymentIntent)
    } catch (e) {
        console.log(e.message);
        res.json({ error: e.message });
        res.end();
    }
})
export default router;
