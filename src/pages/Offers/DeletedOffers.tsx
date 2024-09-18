import { useState } from 'react';
import { RotateCw, RefreshCw, Trash2, Undo } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from '@/components/Spinner';
import Pagination from '@/components/Pagination';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const DeletedOffers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items per page
  const queryClient = useQueryClient();

  // Fetch deleted offers (assuming backend provides a filter for deleted offers)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['deletedOffers', currentPage],
    queryFn: async () => {
      // Replace this with your actual API call to get deleted offers
      const response = await fetch(`/api/offers/deleted?page=${currentPage}`);
      return await response.json();
    },
  });

  const restoreOfferMutation = useMutation({
    mutationFn: async (id) => {
      // Replace with your API call to restore the offer
      return await fetch(`/api/offers/restore/${id}`, { method: 'PUT' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deletedOffers']);
    },
  });

  const permanentlyDeleteOfferMutation = useMutation({
    mutationFn: async (id) => {
      // Replace with your API call to permanently delete the offer
      return await fetch(`/api/offers/permanent-delete/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['deletedOffers']);
    },
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error loading deleted offers.</div>;
  }

  const offers = data.items; // Assuming the data structure contains `items` and pagination details
  const totalPages = Math.ceil(data.totalItems / itemsPerPage);

  return (
    <div className="relative w-full p-2">
      <div className="flex items-center justify-between pb-8">
        <h1 className="text-xl font-bold">Deleted Offers</h1>
        <Button
          variant="default"
          onClick={() => queryClient.invalidateQueries(['deletedOffers'])}
        >
          <RefreshCw className="mr-2" />
          Reload
        </Button>
      </div>

      {/* Deleted Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <AspectRatio ratio={16 / 9}>
              <img
                src={offer.image}
                alt={offer.title}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </AspectRatio>
            <CardHeader className="p-4">
              <CardTitle className="text-lg truncate">{offer.title}</CardTitle>
              <CardDescription className="truncate">{offer.description}</CardDescription>
            </CardHeader>
            <Separator />
            <CardFooter className="flex justify-between p-3 items-center">
              <span className="text-xs text-gray-500">Offer ID: {offer.id}</span>
              <div className="flex gap-4">
                <Undo
                  className="text-green-500 cursor-pointer"
                  onClick={() => restoreOfferMutation.mutate(offer.id)}
                />
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => permanentlyDeleteOfferMutation.mutate(offer.id)}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DeletedOffers;
