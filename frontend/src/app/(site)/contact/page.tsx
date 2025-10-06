'use client';

import {Mail, Clock, MapPin, MessageCircle} from 'lucide-react';
import React, {useState} from 'react';

import {Container} from '@/components/ui';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        orderId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const categories = [
        {value: '', label: 'Sélectionnez une catégorie'},
        {value: 'technical', label: '🔧 Problème technique'},
        {value: 'order', label: '📦 Question sur ma commande'},
        {value: 'legal', label: '⚖️ Question juridique générale'},
        {value: 'billing', label: '💳 Facturation / Remboursement'},
        {value: 'suggestion', label: "💡 Suggestion d'amélioration"},
        {value: 'other', label: '❓ Autre'},
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: '',
                    message: '',
                    orderId: '',
                });
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90"/>
                        <h1 className="text-2xl md:text-4xl font-bold mb-4">Contact et
                            support</h1>
                        <p className="text-blue-100 text-lg">Notre équipe est là pour
                            vous accompagner</p>
                    </div>
                </Container>
            </div>

            <Container className="py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Quick info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Clock className="w-8 h-8 text-green-600"/>
                                <h3 className="font-bold text-gray-900">Délai de
                                    réponse</h3>
                            </div>
                            <p className="text-gray-700 text-sm">
                                <strong>48h maximum</strong> les jours ouvrés
                            </p>
                            <p className="text-xs text-gray-500 mt-2">Du lundi au
                                vendredi, 9h-18h</p>
                        </div>

                        <div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail className="w-8 h-8 text-blue-600"/>
                                <h3 className="font-bold text-gray-900">Email
                                    direct</h3>
                            </div>
                            <a
                                href="mailto:support@jemedefends.fr"
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                                support@jemedefends.fr
                            </a>
                            <p className="text-xs text-gray-500 mt-2">Pour les clients
                                ayant une commande</p>
                        </div>

                        <div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin className="w-8 h-8 text-purple-600"/>
                                <h3 className="font-bold text-gray-900">Basé en
                                    France</h3>
                            </div>
                            <p className="text-gray-700 text-sm">Tarnos,
                                Nouvelle-Aquitaine</p>
                            <p className="text-xs text-gray-500 mt-2">Équipe française,
                                support en français</p>
                        </div>
                    </div>

                    {/* Formulaire de contact et FAQ */}
                    {/* Implémentation complète du formulaire... */}
                </div>
            </Container>
        </div>
    );
};

export default ContactPage;
