import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

let toastId = 0;
let setToastsGlobal = null;

export const toast = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    info: (msg) => addToast('info', msg),
    warn: (msg) => addToast('warn', msg),
};

function addToast(type, message) {
    const id = ++toastId;
    if (setToastsGlobal) {
        setToastsGlobal((prev) => [...prev, { id, type, message }]);
        setTimeout(() => removeToast(id), 4000);
    }
}

function removeToast(id) {
    if (setToastsGlobal) {
        setToastsGlobal((prev) => prev.filter((t) => t.id !== id));
    }
}

const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    warn: <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />,
};

const colourBorder = {
    success: 'border-green-200',
    error: 'border-red-200',
    info: 'border-blue-200',
    warn: 'border-yellow-200',
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);
    setToastsGlobal = setToasts;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 80, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 80, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`pointer-events-auto flex items-start gap-3 bg-white border rounded-xl px-4 py-3 shadow-xl min-w-[280px] max-w-sm ${colourBorder[t.type]}`}
                    >
                        {icons[t.type]}
                        <p className="text-sm text-gray-800 flex-1 leading-snug">{t.message}</p>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                            aria-label="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export const ToastProvider = ({ children }) => (
    <>
        {children}
        <ToastContainer />
    </>
);

export default ToastContainer;
