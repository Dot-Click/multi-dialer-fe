import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchA2PStatus, resubmitBrand } from '@/store/slices/a2pSlice';
import { Header } from './A2PResubmitCPModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Brand resubmit confirmation. No form — the brand is submitted from the
 * stored business details. The modal exists mainly so the fee is
 * confirmed explicitly (TCR charges the tenant per submission attempt).
 * The confirmation checkbox is required before the submit button
 * enables.
 */
const A2PResubmitBrandModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
    const { submitting, error, stages } = useAppSelector((s) => s.a2p);
    const brand = stages.brand;
    const [ack, setAck] = useState(false);

    if (!isOpen) return null;

    const onSubmit = async () => {
        const result = await dispatch(resubmitBrand());
        if (resubmitBrand.fulfilled.match(result)) {
            dispatch(fetchA2PStatus());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
                <Header title="Resubmit Brand" onClose={onClose} />
                <div className="space-y-4 p-8">
                    {brand.message && (
                        <div className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
                            <strong>TCR flagged:</strong> {brand.message}
                        </div>
                    )}
                    {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                    <p className="text-[14px] text-[#495057]">
                        We'll resubmit your brand to TCR using the business info already on
                        file. If TCR's rejection called out fields on your Business Profile,
                        fix those first so this attempt succeeds.
                    </p>

                    <div className="rounded-lg bg-amber-50 px-3 py-3 text-[13px] text-amber-900">
                        <strong>A ${brand.resubmitFeeUsd} TCR resubmission fee applies.</strong>{' '}
                        Previous attempts: {brand.resubmitCount}.
                    </div>

                    <label className="flex items-start gap-2 text-[13px] text-[#495057]">
                        <input
                            type="checkbox"
                            checked={ack}
                            onChange={(e) => setAck(e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            I understand a ${brand.resubmitFeeUsd} fee will be charged and I want to resubmit.
                        </span>
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onSubmit}
                            disabled={!ack || submitting}
                            className="flex-1 rounded-xl bg-[#FFCA06] py-3.5 font-semibold text-black transition-all hover:shadow-lg disabled:opacity-50"
                        >
                            {submitting ? 'Submitting…' : 'Resubmit Brand'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-gray-100 py-3.5 font-semibold text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default A2PResubmitBrandModal;
