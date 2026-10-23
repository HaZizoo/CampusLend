import OfferItem from '../components/OfferItem';
import { addItem } from '../api/items';

const AddItemPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16">
        <div className="glass rounded-2xl shadow-glass p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
            Add a New Item
          </h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Share your belongings with fellow students and earn trust within our campus community.
          </p>
          <OfferItem onItemAdded={addItem} />
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
