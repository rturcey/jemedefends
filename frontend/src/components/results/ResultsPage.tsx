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
    Printer, ChevronDown,
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

// ===============================
// TYPES
// ===============================
interface SignaturePadProps {
    onSignatureChange: (signature: string | null) => void;
}

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'free' | 'pdf' | 'postal';
    onSubmit: (email: string, signature?: string) => Promise<void>;
    loading: boolean;
}

// ===============================
// SIGNATURE PAD
// ===============================
const SignaturePad: React.FC<SignaturePadProps> = ({onSignatureChange}) => {
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
            return {x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top};
        }
        const me = e as React.MouseEvent;
        return {x: me.clientX - r.left, y: me.clientY - r.top};
    };

    const start = (e: React.MouseEvent | React.TouchEvent) => {
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
        if (!isDrawing) return;
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
                >
                    <RefreshCw className="w-3 h-3" aria-hidden="true"/>
                    Recommencer
                </button>
            )}
        </div>
    );
};

// ===============================
// MODAL COMMANDE
// ===============================
const OrderModal: React.FC<OrderModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   type,
                                                   onSubmit,
                                                   loading
                                               }) => {
    const [email, setEmail] = useState('');
    const [signature, setSignature] = useState<string | null>(null);
    const [withRelance, setWithRelance] = useState(type === 'postal');
    const [withPostalUpgrade, setWithPostalUpgrade] = useState(false);

    const needsSignature = type !== 'free';
    const canSubmit = (!!email || type === 'free') && (!needsSignature || signature);

    const basePrice =
        type === 'free'
            ? 0
            : type === 'pdf' && withPostalUpgrade
                ? PRICES.pdfPlusPostal
                : type === 'pdf'
                    ? PRICES.pdf
                    : PRICES.postal;

    const relancePrice =
        type === 'pdf' && withPostalUpgrade
            ? PRICES.relancePostalPromo
            : type === 'pdf'
                ? PRICES.relancePromo
                : PRICES.relancePostalPromo;

    const total = basePrice + (withRelance ? relancePrice : 0);

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
                    <h3 className="font-bold text-lg">
                        {type === 'free'
                            ? 'Version gratuite'
                            : type === 'pdf'
                                ? 'PDF Professionnel'
                                : 'Service Complet (PDF inclus)'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {type === 'pdf' && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Choisissez votre
                                formule :</h4>

                            {/* PDF seul */}
                            <div
                                className={`border-2 rounded-2xl p-3 cursor-pointer transition-all ${
                                    !withPostalUpgrade
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setWithPostalUpgrade(false)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                !withPostalUpgrade ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                            }`}
                                        >
                                            {!withPostalUpgrade && <div
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
                                    withPostalUpgrade
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setWithPostalUpgrade(true)}
                            >
                                <div
                                    className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                    On fait tout !
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                withPostalUpgrade ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                                            }`}
                                        >
                                            {withPostalUpgrade && <div
                                                className="w-2 h-2 bg-white rounded-full"/>}
                                        </div>
                                        <h5 className="font-bold text-gray-900">
                                            PDF + Envoi recommandé (LRAR papier)
                                        </h5>
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
                    )}

                    {type !== 'free' && (
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-800 mb-1">Votre
                                email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="exemple@email.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                            />
                        </div>
                    )}

                    {needsSignature && (
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-800 mb-2">
                                Votre signature électronique
                            </label>
                            <SignaturePad onSignatureChange={setSignature}/>
                        </div>
                    )}

                    {type !== 'free' && (
                        <div
                            className="bg-gradient-to-r from-amber-50 to-green-50 border-2 border-amber-300 rounded-2xl p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={withRelance}
                                    onChange={e => setWithRelance(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-amber-900">Relance automatique à J+30</span>
                                        <span
                                            className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                      -50%
                    </span>
                                    </div>
                                    <p className="text-xs text-amber-900 mb-2">
                                        Si pas de réponse sous 30 jours, nous renvoyons
                                        une lettre de relance.
                                    </p>
                                    <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-700">
                      {formatEuro(relancePrice)}
                    </span>
                                        <span
                                            className="text-xs text-slate-500 line-through">
                      {formatEuro(
                          type === 'pdf' && withPostalUpgrade ? 9.99 : type === 'pdf' ? 1.99 : 9.99,
                      )}
                    </span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    )}

                    {type !== 'free' && (
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between">
                                <span
                                    className="font-semibold text-gray-800">Total</span>
                                <span
                                    className="text-3xl font-bold text-blue-800">{formatEuro(total)}</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={async () => {
                            if (!canSubmit) return;
                            await onSubmit(email, signature || undefined);
                        }}
                        disabled={!canSubmit || loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        {loading ? (
                            <div
                                className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"/>
                        ) : type === 'free' ? (
                            <>
                                <Download className="w-5 h-5" aria-hidden="true"/>
                                Télécharger
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" aria-hidden="true"/>
                                Payer {formatEuro(total)}
                            </>
                        )}
                    </button>

                    <div
                        className="flex items-center justify-center gap-3 text-xs text-gray-600 pt-2">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" aria-hidden="true"/>
                            Paiement sécurisé
                        </div>
                        <div className="flex items-center gap-1">
                            <Lock className="w-3 h-3" aria-hidden="true"/>
                            Données protégées
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ===============================
// STICKY VISIBILITY (scroll + aperçu + modale + clavier)
// ===============================
function useStickyVisibility(previewRef: React.RefObject<HTMLDivElement>, isModalOpen: boolean) {
    const [visible, setVisible] = useState(true);
    const lastY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const y = window.scrollY || 0;
                const goingDown = y > lastY.current + 4;
                const goingUp = y < lastY.current - 4;
                lastY.current = y;

                const rect = previewRef.current?.getBoundingClientRect();
                const vh = window.innerHeight;
                const nearPreview = !!rect && rect.top < vh * 0.85 && rect.bottom > vh * 0.15;

                if (isModalOpen || nearPreview || goingDown) setVisible(false);
                else if (goingUp && !isModalOpen && !nearPreview) setVisible(true);

                ticking.current = false;
            });
        };
        const onResize = onScroll;
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        window.addEventListener('resize', onResize);

        // Masquer quand le clavier mobile est ouvert
        if ('visualViewport' in window) {
            const vv: any = (window as any).visualViewport;
            const handler = () => {
                const opened = vv.height < window.innerHeight - 120;
                if (opened) setVisible(false);
            };
            vv.addEventListener('resize', handler);
            return () => {
                window.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', onResize);
                vv.removeEventListener('resize', handler);
            };
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, [previewRef, isModalOpen]);

    return visible;
}

// ===============================
// DATA HOOK
// ===============================
const useResultsPage = () => {
    const [loading, setLoading] = useState(false);

    const getLetterId = (): string | null => sessionStorage.getItem('currentLetterId');

    const generateFreeVersion = async (email: string): Promise<void> => {
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

    const generatePaidVersion = async (
        type: 'pdf' | 'postal',
        email: string,
        signature: string,
    ): Promise<void> => {
        const letterId = getLetterId();
        if (!letterId) throw new Error('Aucune lettre trouvée');
        try {
            setLoading(true);
            const r = await fetch('/api/v1/letters/generate-pdf', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    letter_id: letterId,
                    signature_data_url: signature,
                    add_watermark: false,
                    pdf_type: 'final',
                }),
            });
            if (!r.ok) throw new Error(`Erreur ${r.status}`);

            const amount = type === 'postal' ? PRICES.postal : PRICES.pdf;
            sessionStorage.setItem(
                'pendingPayment',
                JSON.stringify({
                    type,
                    email,
                    letterId,
                    amount,
                }),
            );
            window.location.href = `/paiement?type=${type}&amount=${amount}&email=${encodeURIComponent(email)}`;
        } finally {
            setLoading(false);
        }
    };

    const previewLetter = async (): Promise<void> => {
        const letterId = getLetterId();
        if (!letterId) throw new Error('Aucune lettre trouvée');
        try {
            setLoading(true);
            const r = await fetch('/api/v1/letters/generate-pdf', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    letter_id: letterId,
                    signature_data_url: null,
                    add_watermark: true,
                    pdf_type: 'preview',
                }),
            });
            if (!r.ok) throw new Error(`Erreur ${r.status}`);
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } finally {
            setLoading(false);
        }
    };

    return {loading, generateFreeVersion, generatePaidVersion, previewLetter};
};

// ===============================
// STICKY CTA (MOBILE)
// ===============================
function StickyCTA({onPDF, onPostal}: { onPDF: () => void; onPostal: () => void }) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden pointer-events-none">
            <div
                className="mx-3 mb-[max(env(safe-area-inset-bottom),0.75rem)] rounded-2xl shadow-lg ring-1 ring-slate-200 bg-white/95 backdrop-blur pointer-events-auto">
                <div className="px-3 pt-3 flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-700">
            Finalisez en 2 minutes • offre de lancement
          </span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                        <Shield className="w-3 h-3" aria-hidden="true"/>
                        Paiement sécurisé
                    </div>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2">
                    <button
                        onClick={onPDF}
                        className="h-11 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 font-semibold text-sm active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                        PDF {formatEuro(PRICES.pdf)}
                    </button>
                    <button
                        onClick={onPostal}
                        className="h-11 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-sm active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-orange-200"
                    >
                        Complet {formatEuro(PRICES.postal)}
                    </button>
                </div>
            </div>
        </div>
    );
}


// === Liste: mobile collapsé, desktop complet ===
function MobileList({items, mobileVisible = 3}: {
    items: React.ReactNode[];
    mobileVisible?: number
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
// PAGE
// ===============================
export default function ResultsPage(): JSX.Element {


    const [modalType, setModalType] = useState<'free' | 'pdf' | 'postal' | null>(null);
    const {
        loading,
        generateFreeVersion,
        generatePaidVersion,
        previewLetter
    } = useResultsPage();

    const handleModalSubmit = async (email: string, signature?: string) => {
        if (modalType === 'free') {
            await generateFreeVersion(email);
            setModalType(null);
        } else if (modalType && signature) {
            await generatePaidVersion(modalType, email, signature);
        }
    };

    const previewRef = useRef<HTMLDivElement>(null);
    const stickyVisible = useStickyVisibility(previewRef, modalType !== null);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 sm:py-12 pb-28 sm:pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* HERO */}
                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
                            className="text-center mb-8">
                    {/* Badge caché sur mobile */}
                    <div
                        className="hidden sm:inline-flex items-center gap-2 bg-green-100 text-green-800 px-5 py-2 rounded-full font-semibold mb-3 text-sm shadow-sm">
                        <CheckCircle className="w-4 h-4" aria-hidden="true"/>
                        Votre lettre juridique est prête
                    </div>

                    <h1 className="hidden sm:block text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                        Plus qu'une étape : l'envoi
                    </h1>

                    {/* Icône insérée au début du texte sur mobile uniquement */}
                    <p className="text-base text-gray-700 max-w-xl mx-auto leading-relaxed mb-2">
                        <span>
      Téléchargez et/ou envoyez votre lettre. <strong
                            className="text-blue-700">Sans inscription !</strong>
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
                                        impression, signature, envoi LRAR) • ~1h de
                                        travail • coût ~8€
                                    </p>
                                </div>
                            </div>
                            <div className="sm:ml-auto w-full sm:w-auto">
                                <button
                                    onClick={() => setModalType('free')}
                                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-slate-800 rounded-xl hover:bg-gray-300 transition-colors font-medium inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-gray-200"
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
                            {/* HEADER carte — compact mobile, stack desktop */}
                            <div className="mb-3 sm:mb-4">
                                <div
                                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:block">
                                    {/* Icône + titres */}
                                    <div
                                        className="col-span-2 flex items-center gap-2 sm:justify-center sm:mb-3">
                                        <div
                                            className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Zap
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                                                aria-hidden="true"/>
                                        </div>
                                        <div className="text-left sm:text-center">
                                            <h3 className="text-base sm:text-xl font-semibold text-gray-900 leading-5">Service
                                                Complet</h3>
                                            <p className="text-[11px] sm:text-xs text-orange-800">On
                                                s'occupe de tout !</p>
                                        </div>
                                    </div>

                                    {/* Prix (à droite en mobile, centré en desktop) */}
                                    <div className="text-right sm:text-center">
                                        <div
                                            className="flex items-baseline justify-end sm:justify-center gap-1.5">
                                            <span
                                                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-orange-600">12,99€</span>
                                            <span
                                                className="text-xs sm:text-sm text-slate-500 line-through">{formatEuro(ORIGINAL_PRICES.postal)}</span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-orange-700 mt-0.5 sm:mt-1">Prix
                                            de lancement</p>
                                    </div>
                                </div>

                                {/* CTA mobile, collé au header */}
                                <button
                                    onClick={() => setModalType('postal')}
                                    className="sm:hidden mt-3 w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                                >
        <span className="inline-flex items-center gap-2">
          <Package className="w-5 h-5" aria-hidden="true"/>
          Envoyer ma lettre
        </span>
                                </button>
                            </div>

                            {/* Micro-preuve */}
                            <div
                                className="mx-auto w-full max-w-[290px] sm:max-w-none flex items-center justify-center gap-2 text-[12px] sm:text-[13px] text-emerald-900 bg-emerald-50/70 border border-emerald-100 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 mb-3 sm:mb-4">
                                <Clock className="w-4 h-4" aria-hidden="true"/>
                                <span>Courrier posté le jour-même*</span>
                            </div>

                            {/* Features: mobile collapsé, desktop complet */}
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
            <span className="font-semibold">0 impression</span>, <span
                                            className="font-semibold">0 déplacement</span>,{' '}
                                            <span className="font-semibold">0 file d’attente</span>
          </span>
                                    </>,
                                ]}
                            />

                            {/* CTA desktop */}
                            <button
                                onClick={() => setModalType('postal')}
                                className="hidden sm:block mt-3 sm:mt-6 w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 font-bold transition-all shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
                            >
      <span className="inline-flex items-center gap-2">
        <Package className="w-5 h-5" aria-hidden="true"/>
        Envoyer ma lettre
      </span>
                            </button>

                            <p className="mt-1 sm:mt-2 text-[11px] leading-none text-slate-600 text-center">*
                                en semaine avant 17h30</p>
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
                                {/* HEADER carte — compact mobile, stack desktop */}
                                <div className="mb-3 sm:mb-4">
                                    <div
                                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:block">
                                        {/* Icône + titres */}
                                        <div
                                            className="col-span-2 flex items-center gap-2 sm:justify-center sm:mb-3">
                                            <div
                                                className="w-8.5 h-8.5 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                                                <Sparkles
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                                                    aria-hidden="true"/>
                                            </div>
                                            <div className="text-left sm:text-center">
                                                <h3 className="text-[15px] sm:text-lg font-semibold text-gray-900 leading-5">PDF
                                                    Professionnel</h3>
                                                <p className="text-[11px] sm:text-xs text-blue-800">Vous
                                                    ne gérez que l'envoi</p>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="text-right sm:text-center">
                                            <div
                                                className="flex items-baseline justify-end sm:justify-center gap-1.5">
                                                <span
                                                    className="text-2xl sm:text-3xl font-bold text-blue-800">2,99€</span>
                                                <span
                                                    className="text-xs sm:text-sm text-slate-500 line-through">{formatEuro(ORIGINAL_PRICES.pdf)}</span>
                                            </div>
                                            <p className="text-[11px] sm:text-xs text-blue-800 mt-0.5 sm:mt-1">Prix
                                                de lancement</p>
                                        </div>
                                    </div>


                                    <button
                                        onClick={() => setModalType('pdf')}
                                        className="sm:hidden mt-3 w-full py-2.5 bg-blue-700 text-white rounded-xl font-semibold shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                                    >
                                        Télécharger maintenant
                                    </button>

                                </div>

                                {/* features */}
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
                                    onClick={() => setModalType('pdf')}
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
                                        onClick={() => previewLetter()}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-400 text-blue-800 rounded-xl hover:bg-blue-50 font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-blue-200"
                                    >
                                        <Eye className="w-4 h-4" aria-hidden="true"/>
                                        Voir l’aperçu gratuit
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
                                    className="font-semibold"> preuve d’envoi</span> et
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
                        onClick={() => previewLetter()}
                        disabled={loading}
                        className="px-6 py-3 bg-white border-2 border-blue-400 text-blue-800 rounded-xl hover:bg-blue-50 font-semibold transition-all inline-flex items-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200"
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

            {/*/!* Sticky CTA mobile *!/*/}
            {/*{stickyVisible && (*/}
            {/*    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}*/}
            {/*                exit={{opacity: 0, y: 10}} transition={{duration: 0.12}}>*/}
            {/*        <StickyCTA onPDF={() => setModalType('pdf')}*/}
            {/*                   onPostal={() => setModalType('postal')}/>*/}
            {/*    </motion.div>*/}
            {/*)}*/}

            {/* Modal */}
            <OrderModal
                isOpen={modalType !== null}
                onClose={() => setModalType(null)}
                type={modalType || 'free'}
                onSubmit={(email, signature) => handleModalSubmit(email, signature)}
                loading={loading}
            />
        </div>
    );
}
