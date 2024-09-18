import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';


const Editoffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const offer = location.state?.offer; // Access the passed offer data from location state

  const [title, setTitle] = useState(offer?.title || '');
  const [image, setImage] = useState(offer?.image || '');
  const [description, setDescription] = useState(offer?.description || '');

  const handleSave = () => {
    // Logic to save the updated offer data
    console.log('Updated offer:', { title, image, description });
    // Navigate back to the offers list after saving
    navigate('/offers');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Offer</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Offer title"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Offer image URL"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Offer description"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/offers')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </form>
    </div>
  );
};

export default Editoffer;
