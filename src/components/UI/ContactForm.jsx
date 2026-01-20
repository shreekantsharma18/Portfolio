import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Send } from 'lucide-react';

const ContactForm = () => {
    const formRef = useRef();
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY
        emailjs
            .send(
                'service_xxxxxxx', // REPLACE WITH YOUR SERVICE ID
                'template_xxxxxxx', // REPLACE WITH YOUR TEMPLATE ID
                {
                    from_name: form.name,
                    to_name: 'Shreekant Sharma',
                    from_email: form.email,
                    to_email: 'shreekantsharma18@gmail.com', // Explicitly setting this if needed by template, but usually template handles it
                    message: form.message,
                },
                'public_key_xxxxxxx' // REPLACE WITH YOUR PUBLIC KEY
            )
            .then(
                () => {
                    setLoading(false);
                    alert('Thank you. I will get back to you as soon as possible.');

                    setForm({
                        name: '',
                        email: '',
                        message: '',
                    });
                },
                (error) => {
                    setLoading(false);
                    console.error(error);
                    alert('Something went wrong. Please try again.');
                }
            );
    };

    return (
        <div className="bg-black/60 backdrop-blur-md border border-white/20 p-8 rounded-2xl w-full max-w-md mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                        placeholder="Your Name"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                        placeholder="your@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                    <textarea
                        rows={4}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/50 transition-colors resize-none"
                        placeholder="What's on your mind?"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
