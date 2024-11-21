import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define User model
const User = mongoose.model("User", new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));

// Define ImgInfo model
const ImgInfo = mongoose.model("imginfo", new mongoose.Schema({
    name: String,
}));

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            // Handle login
            if (req.url === '/login') {
                const { email, password } = req.body;
                const user = await User.findOne({ email: email });

                if (user) {
                    if (password === user.password) {
                        return res.status(200).json({ message: "Login Successfully", user: user });
                    } else {
                        return res.status(401).json({ message: "Password didn't match" });
                    }
                } else {
                    return res.status(404).json({ message: "User not registered" });
                }
            }

            // Handle registration
            if (req.url === '/register') {
                const { name, email, password } = req.body;

                const existingUser = await User.findOne({ email: email });
                if (existingUser) {
                    return res.status(409).json({ message: "User already registered" });
                }

                // Validate email format
                const emailPattern = /\w+@\w+\.\w+/;
                if (!email.match(emailPattern)) {
                    return res.status(400).json({ message: "Invalid email" });
                }

                // Validate name
                if (name.search(/[0-9]/) !== -1) {
                    return res.status(400).json({ message: "Name should not contain digits" });
                }

                // Validate password
                if (password.length < 8 || password.length > 12 || 
                    password.match(/[0-9]/) == null || 
                    password.match(/[a-z]/) == null || 
                    password.match(/[A-Z]/) == null || 
                    password.match(/\W/) == null) {
                    return res.status(400).json({ message: "Password must be 8-12 characters long, contain at least one special character, one capital letter, and one digit." });
                }

                // Create new user
                const user = new User({ name, email, password });
                await user.save();
                return res.status(201).json({ message: "Successfully Registered, Please login now." });
            }

            // Handle upload
            if (req.url === '/upload') {
                const { pic } = req.body;
                const img = new ImgInfo({ name: pic });
                await img.save();
                return res.status(200).json({ message: "Uploaded" });
            }

            // Handle unsupported method
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        
        default:
            res.setHeader('Allow', ['POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
