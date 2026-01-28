import { Modal } from "@/app/components/ui/Modal";
import { decodeHtmlEntities } from "@/utils/htmlDecoder";

export function LocationModal({ isOpen, onClose, description, location }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="About This Location"
      className="mt-20 md:mt-32"
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h3 className="text-lg font-serif text-midnight-navy dark:text-white mb-3">
          {location}
        </h3>
        <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {decodeHtmlEntities(description)}
        </p>
      </div>
    </Modal>
  );
}
