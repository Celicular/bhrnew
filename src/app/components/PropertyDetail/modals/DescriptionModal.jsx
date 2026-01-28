import { Modal } from "@/app/components/ui/Modal";
import { decodeHtmlEntities } from "@/utils/htmlDecoder";

export function DescriptionModal({ isOpen, onClose, description, title }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="About This Property"
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {decodeHtmlEntities(description)}
        </p>
      </div>
    </Modal>
  );
}
