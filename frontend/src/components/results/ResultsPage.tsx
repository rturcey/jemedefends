// frontend/src/components/results/ResultsPage.tsx
'use client';

import {motion} from 'framer-motion';
import {
    CheckCircle,
    Download,
    Mail,
    Shield,
    Lock,
    Eye,
    CreditCard,
    FileText,
    Sparkles,
    Clock,
    Zap,
    RefreshCw,
    X,
    Check,
    Stamp,
    Package,
    Award,
    Printer,
    ChevronDown,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import React, {useState, useRef, useEffect} from 'react';

// ===============================
// PRIX ET CONFIGURATION
// ===============================
const ORIGINAL_PRICES = {
    pdf: 4.99,
    postal: 14.99,
} as const;

const PRICES = {
    pdf: 2.99,
    pdfPlusPostal: 12.99,
    postal: 12.99,
    relancePromo: 0.99,
    relancePostalPromo: 8.99,
} as const;

const formatEuro = (n: number): string =>
    new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(n);

const normalizeSignature = (sig: string) => ({
    dataUrl: sig,
    base64: sig.replace(/^data:image\/\w+;base64,/, ''),
});

// ===============================
// TYPES
// ===============================
type Letter = {
    id: string;
    buyer_email?: string;
    // ajoute d'autres champs si besoin
};

interface SignaturePadProps {
    onSignatureChange: (signature: string | null) => void;
    disabled?: boolean;
}

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    selectedOption: 'pdf' | 'postal';
    email: string;
    signature: string;
    loading: boolean;
    onPreview: () => Promise<void>;
}

interface PaidModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (type: 'pdf' | 'postal', email: string, signature: string) => Promise<void>;
    loading: boolean;
    defaultOption?: 'pdf' | 'postal';
    formEmail?: string;
}

// ===============================
// SIGNATURE PAD
// ===============================
const SignaturePad: React.FC<SignaturePadProps> = ({onSignatureChange, disabled}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const displayWidth = 400;
        const displayHeight = 120;
        const scale = window.devicePixelRatio || 2;

        canvas.width = displayWidth * scale;
        canvas.height = displayHeight * scale;
        ctx.scale(scale, scale);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    useEffect(() => {
        const up = () => {
            if (!isDrawing) return;
            setIsDrawing(false);
            const canvas = canvasRef.current;
            if (canvas && !isEmpty) onSignatureChange(canvas.toDataURL('image/png'));
        };
        document.addEventListener('mouseup', up);
        document.addEventListener('touchend', up);
        return () => {
            document.removeEventListener('mouseup', up);
            document.removeEventListener('touchend', up);
        };
    }, [isDrawing, isEmpty, onSignatureChange]);

    const getXY = (e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) => {
        const r = c.getBoundingClientRect();
        if ('touches' in e) {
            return {
                x: (e as React.TouchEvent).touches[0].clientX - r.left,
                y: (e as React.TouchEvent).touches[0].clientY - r.top,
            };
        }
        const me = e as React.MouseEvent;
        return {x: me.clientX - r.left, y: me.clientY - r.top};
    };

    const start = (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled) return;
        e.preventDefault();
        const c = canvasRef.current;
        const ctx = c?.getContext('2d');
        if (!c || !ctx) return;
        setIsDrawing(true);
        const {x, y} = getXY(e, c);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || disabled) return;
        e.preventDefault();
        const c = canvasRef.current;
        const ctx = c?.getContext('2d');
        if (!c || !ctx) return;
        const {x, y} = getXY(e, c);
        ctx.lineTo(x, y);
        ctx.stroke();
        if (isEmpty) setIsEmpty(false);
    };

    const clear = () => {
        if (disabled) return;
        const c = canvasRef.current;
        const ctx = c?.getContext('2d');
        if (!c || !ctx) return;
        const w = 400,
            h = 120;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        setIsEmpty(true);
        onSignatureChange(null);
    };

    return (
        <div className="space-y-2">
            <div
                className="relative border-2 border-dashed border-blue-200 rounded-2xl bg-white overflow-hidden">
                <canvas
                    ref={canvasRef}
                    style={{width: '400px', height: '120px'}}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={start}
                    onMouseMove={draw}
                    onTouchStart={start}
                    onTouchMove={draw}
                />
                {isEmpty && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span
                            className="text-xs sm:text-sm text-gray-400">Signez ici</span>
                    </div>
                )}
            </div>
            {!isEmpty && (
                <button
                    className="text-xs text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
                    onClick={clear}
                    disabled={disabled}
                >
                    <RefreshCw className="w-3 h-3" aria-hidden="true"/>
                    Recommencer
                </button>
            )}
        </div>
    );
};

// NOUVELLE MODALE DE VÉRIFICATION (unifiée, sans cache PDF)
const VerificationModal: React.FC<VerificationModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onConfirm,
                                                                 selectedOption,
                                                                 email,
                                                                 signature,
                                                                 loading,
                                                                 onPreview,
                                                             }) => {
    const [confirmInfo, setConfirmInfo] = useState(false);
    const [confirmNoRefund, setConfirmNoRefund] = useState(false);

    const canProceed = confirmInfo && confirmNoRefund && !loading;
    const basePrice = selectedOption === 'pdf' ? PRICES.pdf : PRICES.pdfPlusPostal;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="font-bold text-lg">Vérification avant paiement</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Aperçu PDF */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={onPreview}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-400 text-blue-800 rounded-xl hover:bg-blue-50 font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
                        >
                            <Eye className="w-4 h-4" aria-hidden="true"/>
                            Vérifier ma lettre
                        </button>
                    </div>

                    {/* Lien modifier */}
                    <div className="flex justify-center">
                        <a
                            href="/formulaire"
                            className="text-sm text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4"/>
                            Modifier mes informations
                        </a>
                    </div>

                    {/* Cases à cocher obligatoires */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmInfo}
                                onChange={e => setConfirmInfo(e.target.checked)}
                                className="mt-0.5 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                Je confirme que toutes les informations contenues dans ce PDF sont correctes et
                correspondent à ma situation.
              </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmNoRefund}
                                onChange={e => setConfirmNoRefund(e.target.checked)}
                                className="mt-0.5 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                Je comprends qu'il n'y aura pas de droit de rétractation (sauf problème technique
                avéré,
                <a href="mailto:support@jemedefends.fr" className="underline ml-1">
                  support@jemedefends.fr
                </a>
                ).
              </span>
                        </label>
                    </div>

                    {/* Récap prix */}
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div
                            className="flex justify-between text-sm text-gray-700 mb-2">
                            <span>{selectedOption === 'pdf' ? 'PDF professionnel' : 'PDF + Envoi postal'}</span>
                            <span
                                className="font-semibold">{formatEuro(basePrice)}</span>
                        </div>
                        <div
                            className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-blue-200">
                            <span>Total</span>
                            <span>{formatEuro(basePrice)}</span>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="p-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 disabled:opacity-50 font-medium transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!canProceed}
                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    Traitement...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4"/>
                                    Procéder au paiement
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// MODALE VERSION PAYANTE
const PaidModal: React.FC<PaidModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 onVerify,
                                                 loading,
                                                 defaultOption = 'postal',
                                                 formEmail,
                                             }) => {
    const [signature, setSignature] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<'pdf' | 'postal'>(defaultOption);

    const [email, setEmail] = useState('');
    useEffect(() => {
        if (isOpen && formEmail) {
            setEmail(formEmail);
        }
    }, [isOpen, formEmail]);

    useEffect(() => {
        if (isOpen) setSelectedOption(defaultOption);
    }, [isOpen, defaultOption]);

    const canProceed = email && signature && email.includes('@');

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="font-bold text-lg">Choisissez votre formule</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Choix de formule */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Choisissez votre
                            formule :</h4>

                        {/* PDF seul */}
                        <div
                            className={`border-2 rounded-2xl p-3 cursor-pointer transition-all ${
                                selectedOption === 'pdf'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedOption('pdf')}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            selectedOption === 'pdf' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                        }`}
                                    >
                                        {selectedOption === 'pdf' && <div
                                            className="w-2 h-2 bg-white rounded-full"/>}
                                    </div>
                                    <h5 className="font-bold text-gray-900">PDF
                                        seul</h5>
                                </div>
                                <span
                                    className="text-lg font-bold text-blue-800">{formatEuro(PRICES.pdf)}</span>
                            </div>
                            <ul className="text-xs text-slate-800 space-y-1 ml-6">
                                <li>✓ PDF professionnel avec logo</li>
                                <li>✓ Signature électronique intégrée</li>
                                <li>✓ Téléchargement immédiat</li>
                            </ul>
                        </div>

                        {/* PDF + LRAR papier */}
                        <div
                            className={`border-2 rounded-2xl p-3 cursor-pointer transition-all relative ${
                                selectedOption === 'postal'
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedOption('postal')}
                        >
                            <div
                                className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                On fait tout !
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                            selectedOption === 'postal'
                                                ? 'border-indigo-500 bg-indigo-500'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        {selectedOption === 'postal' && (
                                            <div
                                                className="w-2 h-2 bg-white rounded-full"/>
                                        )}
                                    </div>
                                    <h5 className="font-bold text-gray-900">PDF + Envoi
                                        recommandé (LRAR papier)</h5>
                                </div>
                                <span className="text-lg font-bold text-indigo-700">
                  {formatEuro(PRICES.pdfPlusPostal)}
                </span>
                            </div>
                            <ul className="text-xs text-slate-800 space-y-1 ml-6">
                                <li>✓ PDF professionnel avec logo</li>
                                <li>✓ Signature électronique intégrée</li>
                                <li>
                                    ✓ <strong>Impression et envoi recommandé AR
                                    papier</strong>
                                </li>
                                <li>✓ Suivi postal en ligne</li>
                            </ul>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Votre
                            email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="exemple@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                        />
                    </div>

                    {/* Signature */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Votre signature électronique
                        </label>
                        <SignaturePad onSignatureChange={setSignature}
                                      disabled={loading}/>
                    </div>

                    {/* CTA : "Vérifier & Payer" */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="p-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 disabled:opacity-50 font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => onVerify(selectedOption, email, signature!)}
                                disabled={!canProceed || loading}
                                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                ) : (
                                    <Eye className="w-4 h-4"/>
                                )}
                                Vérifier & Payer
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// === Liste: mobile collapsé, desktop complet ===
function MobileList({
                        items,
                        mobileVisible = 3,
                    }: {
    items: React.ReactNode[];
    mobileVisible?: number;
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Mobile: collapsé */}
            <div className="sm:hidden space-y-2">
                {(open ? items : items.slice(0, mobileVisible)).map((it, i) => (
                    <div key={`m-${i}`}
                         className="flex items-start gap-2 text-[15px] leading-5">
                        {it}
                    </div>
                ))}
                {items.length > mobileVisible && (
                    <button
                        type="button"
                        onClick={() => setOpen(v => !v)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-700 hover:ring-blue-300 hover:bg-blue-100 active:scale-[0.99] transition"
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                        {open ? 'Voir moins' : `Voir plus (${items.length - mobileVisible})`}
                    </button>
                )}
            </div>

            {/* Desktop: toujours tout afficher */}
            <div className="hidden sm:block space-y-2">
                {items.map((it, i) => (
                    <div key={`d-${i}`}
                         className="flex items-start gap-2 text-[15px] leading-6">
                        {it}
                    </div>
                ))}
            </div>
        </>
    );
}

// ===============================
// DATA HOOK
// ===============================
const useResultsPage = () => {
    const [loading, setLoading] = useState(false);

    const getLetterId = (): string | null => sessionStorage.getItem('currentLetterId');

    const generateFreeVersion = async (): Promise<void> => {
        const letterId = getLetterId();
        if (!letterId) throw new Error('Aucune lettre trouvée');
        try {
            setLoading(true);
            const r = await fetch('/api/v1/letters/preview-text', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({letter_id: letterId}),
            });
            if (!r.ok) throw new Error(`Erreur ${r.status}`);
            const text = await r.text();
            const blob = new Blob([text], {type: 'text/plain; charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mise-en-demeure.txt';
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setLoading(false);
        }
    };

    const previewPdf = async (opts: {
        watermark: boolean;
        signatureDataUrl?: string | null;
    }): Promise<void> => {
        const letterId = getLetterId();
        if (!letterId) throw new Error('Aucune lettre trouvée');
        try {
            setLoading(true);
            const body: any = {
                letter_id: letterId,
                add_watermark: opts.watermark,
                pdf_type: 'preview',
                signature_data_url: opts.signatureDataUrl ?? null,
            };
            if (opts.signatureDataUrl) {
                body.signature_base64 = opts.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
            }
            const r = await fetch('/api/v1/letters/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/pdf',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });
            if (!r.ok) throw new Error(`Erreur ${r.status}`);
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            // Ouvre tout de suite puis révoque (pas de cache)
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 0);
        } finally {
            setLoading(false);
        }
    };

    // NEW: récupère la lettre par GET /api/v1/letters/:id et la met en cache local
    const fetchAndCacheLetter = async (): Promise<Letter | null> => {
        const letterId = getLetterId();
        if (!letterId) throw new Error('Aucune lettre trouvée');
        try {
            setLoading(true);
            const r = await fetch(`/api/v1/letters/${encodeURIComponent(letterId)}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!r.ok) throw new Error(`Erreur ${r.status}`);
            const data = await r.json();
            const letter: Letter = (data?.letter ?? data) as Letter;
            sessionStorage.setItem('currentLetterSnapshot', JSON.stringify(letter));
            return letter;
        } finally {
            setLoading(false);
        }
    };

    return {loading, generateFreeVersion, previewPdf, fetchAndCacheLetter};
};

// ===============================
// PAGE
// ===============================
export default function ResultsPage(): JSX.Element {
    const [paidModalOpen, setPaidModalOpen] = useState(false);
    const [paidDefaultOption, setPaidDefaultOption] = useState<'pdf' | 'postal'>('postal');
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const {
        loading,
        generateFreeVersion,
        previewPdf,
        fetchAndCacheLetter
    } = useResultsPage();

    const [pendingData, setPendingData] = useState<{
        type: 'pdf' | 'postal';
        email: string;
        signature: string;
    } | null>(null);

    const [letter, setLetter] = useState<Letter | null>(null);
    const [paidFormEmail, setPaidFormEmail] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const l = await fetchAndCacheLetter();
                setLetter(l);
            } catch (e) {
                console.error('Impossible de charger la lettre :', e);
            }
        })();
    }, []);

    // 1) Depuis la modale payante, après saisie d’email + signature :
    const handleVerify = async (type: 'pdf' | 'postal', email: string, signature: string) => {
        setPendingData({type, email, signature});
        setPaidModalOpen(false);
        setVerificationModalOpen(true);
    };

    // 2) Dans la modale de vérification, le bouton "Vérifier ma lettre" (aperçu sans watermark et AVEC signature)
    const handlePreviewWithSignature = async () => {
        if (!pendingData) return;
        const {signature} = pendingData;
        await previewPdf({watermark: false, signatureDataUrl: signature});
    };

    // 3) Aperçu gratuit (watermark + sans signature)
    const handleFreePreview = async () => {
        await previewPdf({watermark: true, signatureDataUrl: null});
    };

    // 4) Paiement (on garde la signature + email en sessionStorage, comme avant)
    const handleConfirmPayment = async () => {
        if (!pendingData) return;
        try {
            setPaymentLoading(true);
            const {type, email, signature} = pendingData;
            const letterId = sessionStorage.getItem('currentLetterId');
            const amount = type === 'postal' ? PRICES.pdfPlusPostal : PRICES.pdf;
            const sig = normalizeSignature(signature);

            sessionStorage.setItem(
                'pendingPayment',
                JSON.stringify({
                    type,
                    email,
                    letterId,
                    amount,
                    signature_data_url: sig.dataUrl,
                    signature_base64: sig.base64,
                }),
            );

            window.location.href = `/paiement?type=${type}&amount=${amount}&email=${encodeURIComponent(email)}`;
        } catch (e) {
            console.error(e);
            alert('Erreur lors de la préparation du paiement');
        } finally {
            setPaymentLoading(false);
        }
    };

    const previewRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 sm:py-12 pb-28 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* HERO */}
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className="text-center mb-8"
                >
                    {/* Badge caché sur mobile */}
                    <div
                        className="hidden sm:inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-2 rounded-full font-semibold mb-3 text-sm shadow-sm">
                        <CheckCircle className="w-4 h-4" aria-hidden="true"/>
                        Votre lettre juridique est prête
                    </div>

                    <h1 className="hidden sm:block text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                        Plus qu'une étape : l'envoi
                    </h1>

                    <p className="text-base text-gray-700 max-w-xl mx-auto leading-relaxed mb-2">
            <span>
              Téléchargez et/ou envoyez votre lettre.{' '}
                <strong className="text-blue-700">Sans inscription !</strong>
            </span>
                    </p>
                </motion.div>

                {/* VERSION GRATUITE */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2}}
                    className="mb-6"
                >
                    <div
                        className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5">
                        <div
                            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                            <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-gray-600 mt-0.5"
                                          aria-hidden="true"/>
                                <div>
                                    <span className="font-semibold text-gray-900">Version gratuite disponible</span>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        Texte brut • Vous gérez tout (formatage,
                                        impression, signature, envoi LRAR) •
                                        ~1h de travail • coût ~8€
                                    </p>
                                </div>
                            </div>
                            <div className="sm:ml-auto w-full sm:w-auto">
                                <button
                                    onClick={generateFreeVersion}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-slate-800 rounded-xl hover:bg-gray-300 transition-colors font-medium inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" aria-hidden="true"/>
                                    Télécharger
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* OFFRES */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-4 items-stretch">
                    {/* Service Complet */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.1}}
                        className="h-full"
                    >
                        <div
                            className="h-full bg-white rounded-2xl p-4 sm:p-5 ring-1 ring-orange-100 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                            <div className="mb-3 sm:mb-4">
                                <div
                                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:block">
                                    <div
                                        className="col-span-2 flex items-center gap-2 sm:justify-center sm:mb-3">
                                        <div
                                            className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Zap
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                                aria-hidden="true"/>
                                        </div>
                                        <div className="text-left sm:text-center">
                                            <h3 className="text-base sm:text-xl font-semibold text-gray-900 leading-5">
                                                Service Complet
                                            </h3>
                                            <p className="text-[11px] sm:text-xs text-orange-800">
                                                On s'occupe de tout !
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right sm:text-center">
                                        <div
                                            className="flex items-baseline justify-end sm:justify-center gap-1.5">
                      <span
                          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-orange-600">
                        12,99€
                      </span>
                                            <span
                                                className="text-xs sm:text-sm text-slate-500 line-through">
                        {formatEuro(ORIGINAL_PRICES.postal)}
                      </span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-orange-700 mt-0.5 sm:mt-1">
                                            Prix de lancement
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setPaidDefaultOption('postal');
                                        setPaidFormEmail(letter?.buyer_email || '');
                                        setPaidModalOpen(true);
                                    }}
                                    className="sm:hidden mt-3 w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                                >
                  <span className="inline-flex items-center gap-2">
                    <Package className="w-5 h-5" aria-hidden="true"/>
                    Envoyer ma lettre
                  </span>
                                </button>
                            </div>

                            <div
                                className="mx-auto w-full max-w-[290px] sm:max-w-none flex items-center justify-center gap-2 text-[12px] sm:text-[13px] text-emerald-900 bg-emerald-50/70 border border-emerald-100 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 mb-3 sm:mb-4">
                                <Clock className="w-4 h-4" aria-hidden="true"/>
                                <span>Courrier posté le jour-même*</span>
                            </div>

                            <MobileList
                                mobileVisible={2}
                                items={[
                                    <>
                                        <Check
                                            className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                                            aria-hidden="true"/>
                                        <span className="text-slate-800">
                      <strong>PDF professionnel</strong> avec signature électronique
                    </span>
                                    </>,
                                    <>
                                        <Check
                                            className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                                            aria-hidden="true"/>
                                        <span className="text-slate-800">
                      <strong>Envoi recommandé AR papier (LRAR)</strong> automatique
                    </span>
                                    </>,
                                    <>
                                        <Check
                                            className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                                            aria-hidden="true"/>
                                        <span className="text-slate-800">
                      <strong>Suivi postal</strong> en ligne
                    </span>
                                    </>,
                                    <>
                                        <Award
                                            className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"
                                            aria-hidden="true"/>
                                        <span className="text-slate-800">
                      <span className="font-semibold">0 impression</span>,{' '}
                                            <span className="font-semibold">0 déplacement</span>,{' '}
                                            <span className="font-semibold">0 file d'attente</span>
                    </span>
                                    </>,
                                ]}
                            />

                            <button
                                onClick={() => {
                                    setPaidDefaultOption('postal');
                                    setPaidFormEmail(letter?.buyer_email || '');
                                    setPaidModalOpen(true);
                                }}
                                className="hidden sm:block mt-3 sm:mt-6 w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 font-bold transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                            >
                <span className="inline-flex items-center gap-2">
                  <Package className="w-5 h-5" aria-hidden="true"/>
                  Envoyer ma lettre
                </span>
                            </button>

                            <p className="mt-1 sm:mt-2 text-[11px] leading-none text-slate-600 text-center">
                                * en semaine avant 17h30
                            </p>
                        </div>
                    </motion.div>

                    {/* PDF Pro */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{delay: 0.2}}
                        className="h-full"
                    >
                        <div className="h-full flex flex-col">
                            <div
                                className="flex-1 bg-white rounded-2xl p-4 sm:p-5 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-3 sm:mb-4">
                                    <div
                                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:block">
                                        <div
                                            className="col-span-2 flex items-center gap-2 sm:justify-center sm:mb-3">
                                            <div
                                                className="w-8.5 h-8.5 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                                                <Sparkles
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                                                    aria-hidden="true"/>
                                            </div>
                                            <div className="text-left sm:text-center">
                                                <h3 className="text-[15px] sm:text-lg font-semibold text-gray-900 leading-5">
                                                    PDF Professionnel
                                                </h3>
                                                <p className="text-[11px] sm:text-xs text-blue-800">
                                                    Vous ne gérez que l'envoi
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right sm:text-center">
                                            <div
                                                className="flex items-baseline justify-end sm:justify-center gap-1.5">
                                                <span
                                                    className="text-2xl sm:text-3xl font-bold text-blue-800">2,99€</span>
                                                <span
                                                    className="text-xs sm:text-sm text-slate-500 line-through">
                          {formatEuro(ORIGINAL_PRICES.pdf)}
                        </span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-blue-800 mt-0.5 sm:mt-1">
                                                Prix de lancement
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setPaidDefaultOption('pdf');
                                            setPaidFormEmail(letter?.buyer_email || '');
                                            setPaidModalOpen(true);
                                        }}
                                        className="sm:hidden mt-3 w-full py-2.5 bg-blue-700 text-white rounded-xl font-semibold shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                    >
                                        Télécharger maintenant
                                    </button>
                                </div>

                                <MobileList
                                    mobileVisible={2}
                                    items={[
                                        <>
                                            <Check
                                                className="w-5 h-5 text-blue-700 mt-0.5 shrink-0"
                                                aria-hidden="true"/>
                                            <span className="text-slate-800">Impact fort auprès du vendeur</span>
                                        </>,
                                        <>
                                            <Check
                                                className="w-5 h-5 text-blue-700 mt-0.5 shrink-0"
                                                aria-hidden="true"/>
                                            <span className="text-slate-800">Signature électronique</span>
                                        </>,
                                        <>
                                            <Check
                                                className="w-5 h-5 text-blue-700 mt-0.5 shrink-0"
                                                aria-hidden="true"/>
                                            <span className="text-slate-800">Téléchargement immédiat</span>
                                        </>,
                                        <>
                                            <Printer className="w-4 h-4 mt-0.5 shrink-0"
                                                     aria-hidden="true"/>
                                            <span className="text-slate-800">Impression et envoi à faire</span>
                                        </>,
                                    ]}
                                />

                                <button
                                    onClick={() => {
                                        setPaidDefaultOption('pdf');
                                        setPaidFormEmail(letter?.buyer_email || '');
                                        setPaidModalOpen(true);
                                    }}
                                    className="hidden sm:block mt-3 sm:mt-6 w-full py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 font-semibold transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                >
                                    Télécharger maintenant
                                </button>
                            </div>

                            {/* Aperçu compact (desktop only) */}
                            <div className="hidden sm:block">
                                <div
                                    ref={previewRef}
                                    className="mt-3 bg-white rounded-2xl p-4 text-center ring-1 ring-blue-100 shadow-sm"
                                >
                                    <h4 className="font-semibold text-blue-800 mb-1">Aperçu
                                        du PDF</h4>
                                    <p className="text-slate-700 text-sm mb-3">
                                        Voir le rendu avec filigrane (gratuit).
                                    </p>
                                    <button
                                        onClick={handleFreePreview}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-400 text-blue-800 rounded-xl hover:bg-blue-50 font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
                                    >
                                        <Eye className="w-4 h-4" aria-hidden="true"/>
                                        Voir l'aperçu gratuit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* BANDEAU LRAR */}
                <div className="mt-4 mb-4">
                    <div
                        className="rounded-2xl bg-white ring-1 ring-emerald-100 px-5 py-3 shadow-sm text-[15px]">
                        <div
                            className="flex items-start gap-3 max-w-3xl mx-auto text-left">
                            <div
                                className="shrink-0 w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center"
                                aria-hidden="true"
                            >
                                <Stamp className="w-4 h-4"/>
                            </div>
                            <p className="text-slate-700 leading-6">
                                Le recommandé{' '}
                                <span className="font-semibold">papier avec accusé de réception (LRAR)</span>{' '}
                                produit une
                                <span
                                    className="font-semibold"> preuve d'envoi</span> et
                                un
                                <span
                                    className="font-semibold"> accusé de réception</span> opposables.
                                Vos
                                justificatifs sont
                                <span className="font-semibold"> archivés et consultables</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* APERÇU (mobile uniquement) */}
                <motion.div
                    ref={previewRef}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                    className="mt-10 bg-white rounded-2xl p-6 text-center border-2 border-blue-200 shadow-sm sm:hidden"
                >
                    <h3 className="font-bold text-xl text-blue-800 mb-2">Pas encore
                        décidé ?</h3>
                    <p className="text-slate-800 mb-4">
                        Prévisualisez gratuitement le rendu PDF avec filigrane.
                    </p>
                    <button
                        onClick={handleFreePreview}
                        disabled={loading}
                        className="px-6 py-3 bg-white border-2 border-blue-400 text-blue-800 rounded-xl hover:bg-blue-50 font-semibold transition-all inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
                    >
                        <Eye className="w-5 h-5" aria-hidden="true"/>
                        Voir l'aperçu gratuit
                    </button>
                </motion.div>

                {/* FOOTER */}
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.4}}
                    className="mt-12 text-center space-y-3 text-xs sm:text-sm text-gray-700"
                >
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" aria-hidden="true"/>
                            Paiement sécurisé (Stancer)
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock className="w-4 h-4" aria-hidden="true"/>
                            Données protégées (RGPD)
                        </div>
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" aria-hidden="true"/>
                            Hébergement français
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                        <p className="font-medium text-gray-800 mb-1">
                            Ce service n'est pas un conseil juridique individualisé
                        </p>
                        <p className="leading-relaxed">
                            Les informations sont basées sur le Code de la consommation
                            français. Pour un conseil
                            personnalisé, consultez un professionnel du droit.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* réserve anti-recouvrement sticky */}
            <div className="h-20 sm:hidden" aria-hidden/>

            {/* MODALES */}
            <PaidModal
                isOpen={paidModalOpen}
                onClose={() => setPaidModalOpen(false)}
                onVerify={handleVerify}
                loading={previewLoading}
                defaultOption={paidDefaultOption}
                formEmail={paidFormEmail}
            />

            <VerificationModal
                isOpen={verificationModalOpen}
                onClose={() => setVerificationModalOpen(false)}
                onConfirm={handleConfirmPayment}
                selectedOption={pendingData?.type || 'pdf'}
                email={pendingData?.email || ''}
                signature={pendingData?.signature || ''}
                loading={paymentLoading}
                onPreview={handlePreviewWithSignature}
            />
        </div>
    );
}
